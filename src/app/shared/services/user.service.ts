import { Injectable } from '@angular/core';
import { SupabaseService } from './supabase.service';
import { BasicUserInfo } from '../interfaces/basic-user-info';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  constructor(private supabaseService: SupabaseService) {}

  get user() {
    return this.supabaseService.supabase.auth.user();
  }

  getCurrentUser() {
    return this.supabaseService.supabase
      .from('users')
      .select()
      .match({ id: this.user.id })
      .single();
  }

  async updateUserAvatar(avatar:string) {
    await this.supabaseService.supabase.from('users')
      .update({
        avatar_url: avatar
      })
      .match({
        id: this.user.id
      });
  }

  async updateUserBasicInfos(basicInfo:BasicUserInfo) {
    await this.supabaseService.supabase.from('users')
      .update(
        basicInfo
      )
      .match({
        id: this.user.id
      });
  }

  listOfUsers() {
    return this.supabaseService.supabase.from('users')
      .select('*');
  }

  makeUserOnline() {
    return this.supabaseService.supabase.from('users').update({
      isOnline: true
    }).match({
      id: this.user.id
    });
  }

  makeUserOffline() {
    return this.supabaseService.supabase.from('users').update({
      isOnline: false
    }).match({
      id: this.user.id
    });
  }

  async getUserChats(userId: any) {
    return await this.supabaseService.supabase.from('users_chats')
      .select('id, user_id, chat_id(id, latest_message)')
      .match({
        user_id: userId
      });
  }

  async getUserById(userId: any) {
    return await this.supabaseService.supabase.from('users').select('id, fullname, avatar_url').match({
      id: userId
    }).single();
  }

  /**
   * getting the destination user of a chat
   * 
   * @param chatId   the chat id 
   * @param originContactId the current user id 
   * @returns 
   */
  getDestinaionContact(chatId: number, originContactId: string) {
    return this.supabaseService.supabase.from('users_chats').select('user_id(id, fullname, avatar_url)')
      .match({
        chat_id: chatId,
      })
      .not('user_id', 'eq', originContactId)
      .single();
  }
}
