import { NgModule } from '@angular/core';
import { CommonModule } from "@angular/common";
import { SharedModule } from '../shared/shared.module';
import { ReactiveFormsModule } from '@angular/forms';
import { PagesRoutingModule } from './pages-routing.module';

import { NzCardModule } from 'ng-zorro-antd/card';
import { NzSkeletonModule } from 'ng-zorro-antd/skeleton';
import { NzAvatarModule } from 'ng-zorro-antd/avatar';
import { NzPaginationModule } from 'ng-zorro-antd/pagination';
import { NzDividerModule } from 'ng-zorro-antd/divider';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzListModule } from 'ng-zorro-antd/list';
import { NzTableModule } from 'ng-zorro-antd/table';
import { NzRadioModule } from 'ng-zorro-antd/radio';
import { NzRateModule } from 'ng-zorro-antd/rate';
import { NzTabsModule } from 'ng-zorro-antd/tabs';
import { NzTagModule } from 'ng-zorro-antd/tag';
import { NzFormModule } from 'ng-zorro-antd/form';
import { NzDatePickerModule } from 'ng-zorro-antd/date-picker';
import { NzSelectModule } from 'ng-zorro-antd/select';
import { NzSwitchModule } from 'ng-zorro-antd/switch';
import { NzUploadModule } from 'ng-zorro-antd/upload';
import { NzToolTipModule } from 'ng-zorro-antd/tooltip';
import { NzModalModule } from 'ng-zorro-antd/modal';
import { NzMessageModule } from 'ng-zorro-antd/message';
import { NzInputModule } from 'ng-zorro-antd/input';

import { ProfileComponent } from './profile/profile.component';
import { SettingComponent } from './setting/setting.component';

const antdModule = [
    NzCardModule,
    NzSkeletonModule,
    NzAvatarModule,
    NzPaginationModule,
    NzDividerModule,
    NzButtonModule,
    NzListModule,
    NzTableModule,
    NzRadioModule,
    NzRateModule,
    NzTabsModule,
    NzTagModule,
    NzFormModule,
    NzDatePickerModule,
    NzSelectModule,
    NzSwitchModule,
    NzUploadModule,
    NzToolTipModule,
    NzModalModule,
    NzMessageModule,
    NzInputModule
]

@NgModule({
    imports: [
        CommonModule,
        SharedModule,
        ReactiveFormsModule,
        PagesRoutingModule,
        ...antdModule
    ],
    declarations: [
        ProfileComponent,
        SettingComponent,
    ],
    providers: [
    ]
})

export class PagesModule {}