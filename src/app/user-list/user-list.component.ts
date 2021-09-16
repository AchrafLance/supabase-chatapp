import {Component, OnInit} from '@angular/core';
import {User} from '../shared/interfaces/user.type';
import {UserService} from '../shared/services/user.service';

@Component({
  selector: 'app-user-list',
  templateUrl: './user-list.component.html'
})
export class UserListComponent implements OnInit {

  view: string = 'cardView';
  userList: User[] = [];

  constructor(private userService: UserService) {
  }

  ngOnInit(): void {
    this.loadUserList();
  }

  async loadUserList() {
    this.userList = await this.userService.listOfUsers();
  }

  async onChangeStatus(user) {
    await this.userService.updateUserStatus(user);
  }
}
