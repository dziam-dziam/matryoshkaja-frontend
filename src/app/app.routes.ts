import { Routes } from '@angular/router';

import { ApiCheck } from './features/api-check/api-check';
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
    path: 'api-check',
    component: ApiCheck,
  },
];
