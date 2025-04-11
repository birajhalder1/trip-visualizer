import { Component, OnInit, OnDestroy, ElementRef, ViewChild, AfterViewInit } from '@angular/core';
import { Network, DataSet } from 'vis-network/standalone';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

interface Trip {
  start: string;
  end: string;
}

interface VisNode {
  id: number;
  label: string;
  level: number;
  shape: string;
  color: { background: string; border: string; };
}

interface VisEdge {
  id: number;
  from: number;
  to: number;
  label: string;
  arrows?: string;
  smooth?: { enabled: boolean };
  level?: number;
  color?: { color: string; inherit: boolean | string };
}

@Component({
  selector: 'app-trip-flow',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './trip-flow.component.html',
  styleUrl: './trip-flow.component.css'
})
export class TripFlowComponent implements OnInit, AfterViewInit, OnDestroy {
  @ViewChild('networkContainer') networkContainer!: ElementRef;

  trips: Trip[] = [
    { start: 'BLR', end: 'MAA' },
    { start: 'MAA', end: 'HYD' },
    { start: 'BLR', end: 'HYD' },
    { start: 'HYB', end: 'DEL' },
    { start: 'DEL', end: 'BLR' },
  ];

  newStartPoint: string = '';
  newEndPoint: string = '';

  private networkInstance: Network | null = null;
  private nodes = new DataSet<VisNode>([]);
  private edges = new DataSet<VisEdge>([]);

  private readonly colors = {
    continued: { background: '#5dade2', border: '#3498db' },
    nonContinued: { background: '#ffffff', border: '#bdc3c7' },
    level1Edge: '#bdc3c7',
    level2Edge: '#f39c12',
    arrowColor: '#8e44ad'
  };

  constructor() { }

  ngOnInit(): void {
    this.updateDiagram();
  }

  ngAfterViewInit(): void {
    this.createNetwork();
  }

  ngOnDestroy(): void {
    if (this.networkInstance) {
      this.networkInstance.destroy();
      this.networkInstance = null;
    }
  }

  addTrip(): void {
    if (this.newStartPoint && this.newEndPoint) {
      const start = this.newStartPoint.trim().toUpperCase();
      const end = this.newEndPoint.trim().toUpperCase();
      if (start.length >= 3 && end.length >= 3) {
        this.trips.push({ start, end });
        this.newStartPoint = '';
        this.newEndPoint = '';
        this.updateDiagram();
      } else {
        alert('Start and End points must be at least 3 characters long.');
      }
    } else {
      alert('Please enter both Start and End points.');
    }
  }

  private createNetwork(): void {
    if (this.networkInstance) {
      this.networkInstance.destroy();
    }

    const container = this.networkContainer.nativeElement;
    const data:any = {
      nodes: this.nodes,
      edges: this.edges,
    };

    const options:any = {
      layout: {
        hierarchical: {
          enabled: true,
          direction: 'LR',
          levelSeparation: 200,
          nodeSpacing: 150,
          treeSpacing: 200,
          sortMethod: 'directed',
        },
      },
      physics: {
        enabled: false,
      },
      nodes: {
        shape: 'dot',
        size: 20,
        font: {
          size: 14,
          color: '#333',
        },
        borderWidth: 2,
      },
      edges: {
        width: 2,
        font: {
          size: 12,
          align: 'horizontal',
          color: '#555',
        },
        smooth: {
          enabled: false
        },
        arrows: {
          to: { enabled: false, scaleFactor: 1, type: 'arrow' }
        }
      },
      interaction: {
        dragNodes: false,
        dragView: true,
        zoomView: true,
      },
    };

    this.networkInstance = new Network(container, data, options);
  }

  private updateDiagram(): void {
    const newNodes: VisNode[] = [];
    const newEdges: VisEdge[] = [];

    if (this.trips.length === 0) {
      this.nodes.clear();
      this.edges.clear();
      return;
    }

    newNodes.push({
      id: 0,
      label: this.trips[0].start.substring(0, 3),
      level: 0,
      shape: 'dot',
      color: this.colors.nonContinued
    });

    for (let i = 0; i < this.trips.length; i++) {
      const currentTrip = this.trips[i];
      const prevTrip = i > 0 ? this.trips[i - 1] : null;

      const isContinued = prevTrip ? prevTrip.end === currentTrip.start : false;
      const isConsecutiveIdentical = prevTrip
        ? prevTrip.start === currentTrip.start && prevTrip.end === currentTrip.end
        : false;
      const targetLevel = isConsecutiveIdentical ? 1 : 0;

      const endNodeColor = isContinued ? this.colors.continued : this.colors.nonContinued;

      newNodes.push({
        id: i + 1,
        label: currentTrip.end.substring(0, 3),
        level: targetLevel,
        shape: 'dot',
        color: endNodeColor,
      });

      const edgeLabel = `${currentTrip.start.substring(0, 3)} - ${currentTrip.end.substring(0, 3)}`;
      const hasArrow = !isContinued && targetLevel === 0;

      newEdges.push({
        id: i,
        from: i,
        to: i + 1,
        label: edgeLabel,
        arrows: hasArrow ? 'to' : undefined,
        smooth: { enabled: false },
        level: targetLevel,
        color: { 
          color: targetLevel === 1 ? this.colors.level2Edge : this.colors.level1Edge, 
          inherit: false 
        }
      });
    }

    this.nodes.update(newNodes);
    this.edges.update(newEdges);

    if (this.networkInstance) {
      this.networkInstance.fit();
    }
  }
}