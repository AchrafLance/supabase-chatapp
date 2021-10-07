import { NgModule } from '@angular/core';
import { RouterModule, Routes, PreloadAllModules } from '@angular/router';

import { FullLayoutComponent } from "./layouts/full-layout/full-layout.component";
import { CommonLayoutComponent } from "./layouts/common-layout/common-layout.component";
import { AuthGuard } from './authentication/authentication.guard';

const appRoutes: Routes = [
    {
        path: '',
        redirectTo: '/chat',
        pathMatch: 'full',
    },
    { 
        path: '', 
        component: CommonLayoutComponent,
        canActivate:[AuthGuard],
        children: [
            {
              path: '',
              loadChildren: () => import('./pages/pages.module').then(m => m.PagesModule)
            },
            
          ]
           
    },
    { 
        path: '', 
        component: FullLayoutComponent, 
        children: [
            {
                path: 'authentication',
                loadChildren: () => import('./authentication/authentication.module').then(m => m.AuthenticationModule)
            }
        ]
    }
];

@NgModule({
    imports: [
        RouterModule.forRoot(appRoutes, { 
            preloadingStrategy: PreloadAllModules,
            anchorScrolling: 'enabled',
            scrollPositionRestoration: 'enabled' 
        })
    ],
    exports: [
        RouterModule
    ]
})

export class AppRoutingModule {
}