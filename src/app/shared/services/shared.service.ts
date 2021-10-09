import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { User } from '../interfaces/user';

@Injectable({
    providedIn: 'root'
})
export class SharedService{
    selectedUserSubject: BehaviorSubject<User>;
    selectedUser: Observable<any>;

    constructor(){
       this.selectedUserSubject = new BehaviorSubject<User>(null);
       this.selectedUser = this.selectedUserSubject.asObservable();
    }

    get chatIdentifierValue(){
        return this.selectedUserSubject.value;
    }

}
