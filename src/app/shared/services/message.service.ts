import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ChatMessage } from '../interfaces/chat-message';
import { SupabaseService } from './supabase.service';

const table = 'messages';

@Injectable({
    providedIn: 'root'
})
export class MessageService {
    constructor(private supabaseService: SupabaseService) {
    }

    addNewMessage(message: ChatMessage) {
        return this.supabaseService.supabase.from(table).insert(message).single();

    }

    async getChatMessages(chatId: number) {
        return await this.supabaseService.supabase.from(table).select('id, chat_id, sender(id, fullname, avatar_url), message_content, created_at').match({
            chat_id: chatId
        });
    }

    getMessageById(messageId: number){
        return this.supabaseService.supabase.from(table)
        .select('id, chat_id, sender(fullname, avatar_url), message_content, created_at')
        .match({id: messageId})
        .single();
    }

}
