import { Component } from '@angular/core';
import { ROUTES } from './side-nav-routes.config';
import { ThemeConstantService } from '../../services/theme-constant.service';
import { UserService } from '../../services/user.service';
import { AuthenticationService } from '../../services/authentication.service';
import { SharedService } from '../../services/shared.service';
import { User } from '../../interfaces/user.type';

@Component({
    selector: 'app-sidenav',
    templateUrl: './side-nav.component.html',
    styleUrls: ['./side-nav.component.css']
})

export class SideNavComponent{

    public usersList: any[]
    isFolded : boolean;
    isSideNavDark : boolean;
    isExpand : boolean;

    constructor( private themeService: ThemeConstantService, 
                private userService: UserService, 
                private authService: AuthenticationService,
                private sharedService: SharedService) {}

    ngOnInit(): void {
        // this.menuItems = ROUTES.filter(menuItem => menuItem);

        this.authService.currentUser.subscribe(data => {
            if(data){
             this.getUsers();
             console.log("users", this.usersList)
            }
         })

        this.themeService.isMenuFoldedChanges.subscribe(isFolded => this.isFolded = isFolded);
        this.themeService.isExpandChanges.subscribe(isExpand => this.isExpand = isExpand);
        this.themeService.isSideNavDarkChanges.subscribe(isDark => this.isSideNavDark = isDark);
    }

    async getUsers() {
        const { data, error } = await this.userService.listOfUsers()
        if (data) {
            this.usersList = data.filter(user => user.id != this.authService.currentUserValue.id);
        }
    }

    closeMobileMenu(user:User): void {
        this.sharedService.selectedUserSubject.next(user); 

        if (window.innerWidth < 992) {
            console.log(window.innerWidth)
            this.isFolded = false;
            this.isExpand = !this.isExpand;
            this.themeService.toggleExpand(this.isExpand);
            this.themeService.toggleFold(this.isFolded);
        }
    }

}
