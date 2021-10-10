import { Component } from '@angular/core';
import { ActivatedRoute, NavigationEnd, Router } from '@angular/router';
import { filter, map } from 'rxjs/operators';
import { AuthenticationService } from 'src/app/shared/services/authentication.service';
import { SupabaseService } from 'src/app/shared/services/supabase.service';
import { UserService } from 'src/app/shared/services/user.service';
import { ThemeConstantService } from '../../shared/services/theme-constant.service';

@Component({
    selector: 'app-common-layout',
    templateUrl: './common-layout.component.html',
})

export class CommonLayoutComponent  {

    contentHeaderDisplay: string;
    isFolded: boolean ;
    isSideNavDark: boolean;
    isExpand: boolean;
    selectedHeaderColor: string;

    constructor(private authSerivce: AuthenticationService,
                private supabase: SupabaseService,
                private router: Router,
                private activatedRoute: ActivatedRoute,
                private themeService: ThemeConstantService,
                private userService: UserService) {

        this.router.events.pipe(
            filter(event => event instanceof NavigationEnd),
            map(() => {
                let child = this.activatedRoute.firstChild;
                while (child) {
                    if (child.firstChild) {
                        child = child.firstChild;
                    } else if (child.snapshot.data && child.snapshot.data.headerDisplay) {
                        return child.snapshot.data.headerDisplay;
                    } else {
                        return null;
                    }
                }
                return null;
            })
        ).subscribe( (data: any) => {
            this.contentHeaderDisplay = data;
        });
    }

    ngOnInit() {
        this.themeService.isMenuFoldedChanges.subscribe(isFolded => this.isFolded = isFolded);
        this.themeService.isSideNavDarkChanges.subscribe(isDark => this.isSideNavDark = isDark);
        this.themeService.selectedHeaderColor.subscribe(color => this.selectedHeaderColor = color);
        this.themeService.isExpandChanges.subscribe(isExpand => this.isExpand = isExpand);
        this.getCurrentUser();
    }



    async getCurrentUser(){ // set current user in localstorage after he signed in
        await this.userService.makeUserOnline();
        const {data, error} = await this.userService.getCurrentUser();
        if (data){
            this.authSerivce.currentUserSubject.next(data);
        }
    }
}
