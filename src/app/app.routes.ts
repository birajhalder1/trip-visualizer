import { Routes } from '@angular/router';
import { TripFlowComponent } from './trip-flow/trip-flow.component';

export const routes: Routes = [
    {
        path: '',
        redirectTo: 'home',
        pathMatch: 'full'
    },
    {
        path: 'home',
        component: TripFlowComponent
    }
];
