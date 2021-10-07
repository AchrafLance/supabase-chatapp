import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable } from 'rxjs';
import { map } from 'rxjs/operators';

import { User } from '../interfaces/user';
import { SupabaseService } from './supabase.service';
import { UserService } from './user.service';

const USER_AUTH_API_URL = '/api-url';

@Injectable({
    providedIn:"root"
})
export class AuthenticationService {
    public currentUserSubject: BehaviorSubject<any>;
    public currentUser: Observable<any>;

    constructor(private http: HttpClient, 
                private supabase:SupabaseService,
                private userService: UserService) {
        this.currentUserSubject = new BehaviorSubject<any>(this.supabase.user);
        this.currentUser = this.currentUserSubject.asObservable();
    }

    public get currentUserValue(): any {
        return this.currentUserSubject.value;
    }

    login(username: string, password: string) {
        return this.http.post<any>(USER_AUTH_API_URL, { username, password })
        .pipe(map(user => {
            if (user && user.token) {
                localStorage.setItem('currentUser', JSON.stringify(user));
                this.currentUserSubject.next(user);
            }
            return user;
        }));
    }

    async loginWithGoogle(){
     await this.supabase.signInWithGoogle();   

    }

    async logout() {
        await this.userService.makeUserOffline()
        this.currentUserSubject.next(null);
        this.supabase.removeAllSubscriptions();
        this.supabase.signout();       
    }
}