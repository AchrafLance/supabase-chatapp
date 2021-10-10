import { Component } from '@angular/core';
import { ROUTES } from './side-nav-routes.config';
import { ThemeConstantService } from '../../services/theme-constant.service';
import { UserService } from '../../services/user.service';
import { AuthenticationService } from '../../services/authentication.service';
import { SharedService } from '../../services/shared.service';
import { User } from '../../interfaces/user';
import { SupabaseService } from '../../services/supabase.service';

@Component({
    selector: 'app-sidenav',
    templateUrl: './side-nav.component.html',
    styleUrls: ['./side-nav.component.css']
})

export class SideNavComponent{

    public usersList: User[];
    isFolded: boolean;
    isSideNavDark: boolean;
    isExpand: boolean;

    constructor( private themeService: ThemeConstantService,
                 private userService: UserService,
                 private authService: AuthenticationService,
                 private sharedService: SharedService,
                 private supabaseService: SupabaseService) {}

    ngOnInit(): void {


        this.authService.currentUser.subscribe((data: User) => {
            if (data){
              this.getUsers();
              this.listenToUsers(); 
            }
         });

      

        this.themeService.isMenuFoldedChanges.subscribe(isFolded => this.isFolded = isFolded);
        this.themeService.isExpandChanges.subscribe(isExpand => this.isExpand = isExpand);
        this.themeService.isSideNavDarkChanges.subscribe(isDark => this.isSideNavDark = isDark);
    }

    private listenToUsers(){
          this.supabaseService.supabase.from('users')
          .on('UPDATE', payload => {
              let index = null;
              index = this.usersList.findIndex( user => user.id === payload.new.id);
              console.log('index', index);
              if (index != null){
                  this.usersList[index] = payload.new;
                  console.log('new user list', this.usersList);
              }
          }).subscribe();
    }

    private async getUsers() {
        const { data } = await this.userService.listOfUsers();
        if (data) {
            this.usersList = data.filter(user => user.id != this.authService.currentUserValue.id);
        }
    }

    closeMobileMenu(user: User): void {
        this.sharedService.selectedUserSubject.next(user);

        if (window.innerWidth < 992) {
            console.log(window.innerWidth);
            this.isFolded = false;
            this.isExpand = !this.isExpand;
            this.themeService.toggleExpand(this.isExpand);
            this.themeService.toggleFold(this.isFolded);
        }
    }

}
