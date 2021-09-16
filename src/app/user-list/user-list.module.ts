import {NgModule} from '@angular/core';
import {UserListComponent} from './user-list.component';
import {UserListRoutingModule} from './user-list-routing.module';
import {NzAvatarModule} from 'ng-zorro-antd/avatar';
import {NzTableModule} from 'ng-zorro-antd/table';
import {NzRadioModule} from 'ng-zorro-antd/radio';
import {FormsModule} from '@angular/forms';
import {NzCardModule} from 'ng-zorro-antd/card';
import {CommonModule} from '@angular/common';
import {NzToolTipModule} from 'ng-zorro-antd/tooltip';
import {NzIconModule} from 'ng-zorro-antd/icon';
import {NzWaveModule} from 'ng-zorro-antd/core/wave';
import {NzButtonModule} from 'ng-zorro-antd/button';
import {NzSwitchModule} from 'ng-zorro-antd/switch';

@NgModule({
  declarations: [UserListComponent],
  imports: [UserListRoutingModule, NzAvatarModule, NzTableModule, NzRadioModule, FormsModule, NzCardModule, CommonModule, NzToolTipModule, NzIconModule, NzWaveModule, NzButtonModule, NzSwitchModule]
})
export class UserListModule {

}
