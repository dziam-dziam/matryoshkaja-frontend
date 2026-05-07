import { Routes } from '@angular/router';

import { AboutPage } from './features/about/about-page/about-page';
import { AdminPanel } from './features/admin/admin-panel/admin-panel';
import { Lookbook } from './features/lookbook/lookbook-page/lookbook-page';

export const routes: Routes = [
  {
    path: '',
    pathMatch: 'full',
    redirectTo: 'lookbook',
  },
  {
    path: 'lookbook',
    component: Lookbook,
  },
  {
    path: 'about',
    component: AboutPage,
  },
  {
    path: 'admin',
    component: AdminPanel,
  },
];
