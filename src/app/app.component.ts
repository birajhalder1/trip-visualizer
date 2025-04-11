import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { TripFlowComponent } from './trip-flow/trip-flow.component';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, TripFlowComponent], // Add TripFlowComponent 
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  title = 'trip-visualizer';
}
