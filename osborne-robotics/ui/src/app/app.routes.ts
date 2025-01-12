import { Routes } from '@angular/router';
import { ForkliftSimulatorComponent } from './forklift-simulator/forklift-simulator.component';
import { ForkliftFleetComponent } from './forklift-fleet/forklift-fleet.component';

export const routes: Routes = [
  { path: '', component: ForkliftFleetComponent },
  { path: 'fleet', component: ForkliftFleetComponent },
  { path: 'simulator', component: ForkliftSimulatorComponent },
];
