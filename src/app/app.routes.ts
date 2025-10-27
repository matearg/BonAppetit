import { Routes } from '@angular/router';
import { Initial } from './views/initial/initial';

export const routes: Routes = [
  {
    path: '',
    component: Initial,
  },
  {
    path: '**',
    redirectTo: '',
  },
];
