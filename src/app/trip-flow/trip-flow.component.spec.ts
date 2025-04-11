import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TripFlowComponent } from './trip-flow.component';

describe('TripFlowComponent', () => {
  let component: TripFlowComponent;
  let fixture: ComponentFixture<TripFlowComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TripFlowComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TripFlowComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
