import {Injectable} from '@angular/core';
import {SupabaseService} from './supabase.service';
import {User} from '../interfaces/user.type';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  constructor(private supabase: SupabaseService) {

  }

  async updateUserAvatar(avatar) {
    await this.supabase.updateUserAvatar(avatar);
  }

  async updateUserBasicInfos(basicInfo) {
    await this.supabase.updateUserBasicInfos(basicInfo);
  }

  async updateUserEducation(education){
   await this.supabase.updateUserEducation(education)
  }
  async updateUserExperience(experience){
    await this.supabase.updateUserExperience(experience)
  }

   listOfUsers() {
   return this.supabase.getUserList();
  }

  makeUserOnline() {
    return this.supabase.makeUserOnline()
  }
  makeUserOffline() {
    return this.supabase.makeUserOffline()
  }

}