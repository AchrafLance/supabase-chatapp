import { Injectable } from "@angular/core";
import { Chat } from "../interfaces/chat.type";
import { SupabaseSuperclass } from "./supabaseSuperClass";

const table = "chats";

@Injectable({
    providedIn:"root"
})
export class ChatService extends SupabaseSuperclass{
    constructor(){
        super()
    }

    async addChat(chat: Chat, contacts){
        const newChat = await this.getSupabase.from(table).insert(chat).single(); 
        for(let contact of contacts){
            await this.getSupabase.from("users_chats").insert({
                user_id: contact, 
                chat_id: newChat.data.id
          })
        }
        return newChat 
    }

     getChatByContactsId(contacts){
        this.getSupabase.from(table).select()
        .or(`contact_1.eq.${contacts[0]}, and(contact_2.eq.${contacts[1]})`)
        .or(`contact_1.eq.${contacts[1]}, and(contact_2.eq.${contacts[0]})`)
        .single();
    
    }
}