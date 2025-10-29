import { Routes } from '@angular/router';
import { Initial } from './views/initial/initial';
import { HomePage } from './views/home-page/home-page';
import { authUsersGuard } from './users/auth-users-guard';

export const routes: Routes = [
  {
    path: '',
    component: Initial,
  },
  {
    path: 'home',
    component: HomePage,
    canActivate: [authUsersGuard]
  },
  {
    path: '**',
    redirectTo: '',
  },
];
