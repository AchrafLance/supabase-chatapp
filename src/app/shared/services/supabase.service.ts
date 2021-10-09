import {Injectable} from '@angular/core';
import {environment} from 'src/environments/environment';
import {createClient, SupabaseClient} from '@supabase/supabase-js';
import {Router} from '@angular/router';
import {User} from '../interfaces/user';


@Injectable({
  providedIn: 'root'
})
export class SupabaseService {

  public supabase: SupabaseClient;

  constructor(private router: Router) {
    this.supabase = createClient(environment.supaURL, environment.supaKEY);
  }

  get user() {
    return this.supabase.auth.user();
  }

  getCurrentUser() {
    return this.supabase
      .from('users')
      .select()
      .match({id: this.user.id})
      .single();
  }


  ////////////////////////////////////////////////////////////////////////////////////////////////////////////
  ////                                          AUTHENTICATION METHODS                                     ///
  ////////////////////////////////////////////////////////////////////////////////////////////////////////////

  signInWithGoogle() {
    return this.supabase.auth.signIn({
        provider: 'google'
      },

    );
  }

  signout() {
    this.supabase.auth.signOut();
    this.router.navigate(['/login']);
  }


  // signin(email, password) {
  //     return this.supabase.auth.signIn({
  //         email: email,
  //         password: password,
  //     })
  // }

  // resetPassword(email: string) {
  //     return this.supabase.auth.api.resetPasswordForEmail(email
  //         ,
  //         {
  //             redirectTo: "http://localhost:4200/update-password"
  //         }
  //     )
  // }

  // updatePassword(new_password) {
  //     return this.supabase.auth
  //         .update({ password: new_password })
  // }

  ////////////////////////////////////////////////////////////////////////////////////////////////////////////
  ////                                          User METHODS                                     ///
  ////////////////////////////////////////////////////////////////////////////////////////////////////////////

  updateUserAvatar(avatar) {
    return this.supabase
      .from('users')
      .update({
        avatarurl: avatar
      })
      .match({
        id: this.user.id
      });
  }

  updateUserBasicInfos(basicInfo) {
    return this.supabase
      .from('users')
      .update({
        basicInfo
      })
      .match({
        id: this.user.id
      });
  }

  updateUserEducation(education){
    return this.supabase
    .from('users')
    .update({
      education: education
    })
    .match({
      id:this.user.id
    })
  }

  updateUserExperience(experience){
    return this.supabase
    .from('users')
    .update({
      experience: experience
    })
    .match({
      id: this.user.id
    })
  }
  getUserList() {
    return this.supabase
      .from('users')
      .select('*');
  }

  makeUserOnline(){
    return this.supabase.from("users").update({
      isOnline: true
    }).match({
      id: this.user.id
    })
  }

  makeUserOffline(){
    return this.supabase.from("users").update({
      isOnline: false
    }).match({
      id: this.user.id
    })
  }

  //(id, contact_1, contact_2, latest_message)
  getUserChats(userId:any){
    return this.supabase.from("users_chats").select("id, user_id, chat_id(id, latest_message)").match({
      user_id:userId 
    })
  }

  getDestinaionContact(chatId:number, originContactId:string){
    return this.supabase.from("users_chats").select('user_id(id, fullname, avatar_url)')
                         .match({
                           chat_id: chatId,
                         })
                         .not("user_id","eq",originContactId)
                         .single()
  }

  getUserById(userId:any){
    return this.supabase.from("users").select("id, fullname, avatar_url").match({
      id: userId
    }).single();
  }

  removeAllSubscriptions(){
    for(let sub of this.supabase.getSubscriptions()){
      console.log("removing sub: ", sub)
      this.supabase.removeSubscription(sub)
    }
  }
}







