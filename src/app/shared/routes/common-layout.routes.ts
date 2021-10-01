import {Routes} from '@angular/router';

export const CommonLayout_ROUTES: Routes = [
  {
    path: '',
    loadChildren: () => import('../../pages/pages.module').then(m => m.PagesModule)
  },
  
];
