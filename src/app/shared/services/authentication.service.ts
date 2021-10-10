import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

import { SupabaseService } from './supabase.service';
import { UserService } from './user.service';
import { Router } from '@angular/router';

@Injectable({
    providedIn: 'root'
})
export class AuthenticationService {
    public currentUserSubject: BehaviorSubject<any>;
    public currentUser: Observable<any>;

    constructor(
                private supabaseService: SupabaseService,
                private userService: UserService,
                private router: Router) {

        this.currentUserSubject = new BehaviorSubject<any>(this.userService.user);
        this.currentUser = this.currentUserSubject.asObservable();
    }

    public get currentUserValue(): any {
        return this.currentUserSubject.value;
    }

    async loginWithGoogle(){
     await this.supabaseService.supabase.auth.signIn({
        provider: 'google'
      }
    );

    }

    async logout() {
        await this.userService.makeUserOffline();
        this.currentUserSubject.next(null);
        this.supabaseService.removeAllSubscriptions();
        this.supabaseService.supabase.auth.signOut();
        this.router.navigate(['/login']);
    }
}
