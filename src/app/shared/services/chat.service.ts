import { Injectable } from '@angular/core';
import { Chat } from '../interfaces/chat';
import { SupabaseSuperclass } from './supabaseSuperClass';

const table = 'chats';

@Injectable({
    providedIn: 'root'
})
export class ChatService extends SupabaseSuperclass {
    constructor() {
        super();
    }

    /**
     * Performs insert into chat table,
     * Trigger implemented to also link each user to this chat in th users_chats table
     *
     * @param chat
     * @returns The chat inserted
     */
    async save(chat: Chat) {
        return await this.getSupabase.from(table).insert(chat).single();

    }

    /**
     * Select a chat object by contacts id, this is used when a user clicks
     * on an icon from the user list to chat
     *
     * @param contacts
     * @returns
     */
    async getChatByContactsId(contacts: any[]) {
        return await this.getSupabase.from('chats').select('*')
            .or(`contact_1.eq.${contacts[0]}, contact_1.eq.${contacts[1]})`)
            .or(`contact_2.eq.${contacts[1]}, contact_2.eq.${contacts[0]})`)
            .single();
    }

    /**
     * Select one chat object by its id, this is used when a user clicks on a chat
     * to load its messages
     *
     * @param chatId
     * @returns
     */
    async getChatByChatId(chatId: number) {
        return await this.getSupabase.from('chats').select('id, latest_message').match({
            id: chatId
        }).single();
    }
}
