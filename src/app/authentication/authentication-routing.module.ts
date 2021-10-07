import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { LoginComponent } from './login/login.component';
import { SignUpComponent } from './sign-up/sign-up.component';
import { PageNotFoundErrorComponent } from './page-not-found-error/page-not-found-error.component';
import { SiteDownErrorComponent } from './site-down-error/site-down-error.component';

const routes: Routes = [
    {
        path: 'login',
        component: LoginComponent,
        data: {
            title: 'Login'
        }
    },
    {
        path: 'sign-up',
        component: SignUpComponent,
        data: {
            title: 'Sign Up'
        }
    },
    {
        path: 'not-found',
        component: PageNotFoundErrorComponent,
        data: {
            title: '404'
        }
    },
    {
        path: 'site-down',
        component: SiteDownErrorComponent,
        data: {
            title: 'site is down'
        }
    }
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule],
})
export class AuthenticationRoutingModule { }
