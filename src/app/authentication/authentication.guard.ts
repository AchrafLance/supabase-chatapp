import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot } from '@angular/router';
import { Observable } from 'rxjs';
import { AuthenticationService } from '../shared/services/authentication.service';
import { SupabaseService } from '../shared/services/supabase.service';



@Injectable({
    providedIn: 'root'
})

export class AuthGuard implements CanActivate{

    constructor(private authService: AuthenticationService, private supabase: SupabaseService,
                private router: Router){

    }

    canActivate(
        route: ActivatedRouteSnapshot,
        state: RouterStateSnapshot): Observable<boolean> | Promise<boolean> | boolean {
           const currentUser = this.supabase.user;
           if (!currentUser){
               // try again after delay **work-aroud the delay supabase takes to load the user after google signin
               setTimeout(() => {
                const currentUser = this.supabase.user;
                if (currentUser) {
                    this.router.navigate(['']);
                    return true;
                }
                else{
                    this.router.navigate(['/login']);
                    return false;
                }
               }, 800);
           }
           else{
               return true;
           }


        }
}
