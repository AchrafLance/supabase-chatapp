import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ChatComponent } from './chat/chat.component';

import { ProfileComponent } from './profile/profile.component';
import { SettingComponent } from './setting/setting.component';


const routes: Routes = [

    {
        path: 'profile',
        component: ProfileComponent,
        data: {
            title: 'Profile'
        }
    },

    {
        path: 'setting',
        component: SettingComponent,
        data: {
            title: 'Setting',
            headerDisplay: "none"
        }
    },

    {
        path: 'chat',
        component: ChatComponent,
        data: {
            title: 'Chat',
            headerDisplay: "none"
        }
    },
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule],
})
export class PagesRoutingModule { }
