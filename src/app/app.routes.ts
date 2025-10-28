import { Routes } from '@angular/router';
import { Initial } from './views/initial/initial';
import { HomePage } from './views/home-page/home-page';

export const routes: Routes = [
  {
    path: '',
    component: Initial,
  },
  {
    path: 'home',
    component: HomePage,
  },
  {
    path: '**',
    redirectTo: '',
  },
];
