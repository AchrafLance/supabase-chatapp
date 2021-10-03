import { Injectable } from "@angular/core";
import { Chat } from "../interfaces/chat.type";
import { SupabaseSuperclass } from "./supabaseSuperClass";

const table = "chats";

@Injectable({
    providedIn: "root"
})
export class ChatService extends SupabaseSuperclass {
    constructor() {
        super()
    }
 
    async addChat(chat: Chat, contacts) { // WHEN ADDING A NEW MESSAGE
        const newChat = await this.getSupabase.from(table).insert(chat).single();
        for (let contact of contacts) {
            await this.getSupabase.from("users_chats").insert({
                user_id: contact,
                chat_id: newChat.data.id
            })
        }
        return newChat
    }

    async getChatByContactsId(contacts) { // WHEN CLICKING ON A USER
        return await this.getSupabase.from(table).select()
            .or(`contact_1.eq.${contacts[0]}, contact_1.eq.${contacts[1]})`)
            .or(`contact_2.eq.${contacts[1]}, contact_2.eq.${contacts[0]})`)
            .single();
    }

    async getChatByChatId(chatId: number) { // WHEN CLICKING ON A CHAT
        return await this.getSupabase.from("chats").select().match({
            id: chatId
        }).single();
    }
}