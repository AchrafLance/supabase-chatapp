import {Routes} from '@angular/router';

export const CommonLayout_ROUTES: Routes = [
  {
    path: 'dashboard',
    loadChildren: () => import('../../dashboard/dashboard.module').then(m => m.DashboardModule),
  },
  
  //Pages
  {
    path: 'pages',
    data: {
      title: 'Pages '
    },
    children: [
      {
        path: '',
        redirectTo: '/dashboard',
        pathMatch: 'full'
      },
      {
        path: '',
        loadChildren: () => import('../../pages/pages.module').then(m => m.PagesModule)
      },
      {
        path: 'chat',
        loadChildren: () => import('../../pages/pages.module').then(m => m.PagesModule)
      },
    ]
  }
];
