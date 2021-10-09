import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { ChatMessage } from "../interfaces/chat-message";
import { SupabaseSuperclass } from "./supabaseSuperClass";

const table = "messages"; 

@Injectable({
    providedIn: "root"
})
export class MessageService extends SupabaseSuperclass {
    constructor() {
        super()
    }

    addNewMessage(message: ChatMessage) {
        return this.getSupabase.from(table).insert(message).single()

    }

    async getChatMessages(chatId: number) {
        return await this.getSupabase.from(table).select("id, chat_id, sender(id, fullname, avatar_url), message_content, created_at").match({
            chat_id: chatId
        })
    }

    getMessageById(messageId:number){
        return this.getSupabase.from(table)
        .select("id, chat_id, sender(fullname, avatar_url), message_content, created_at")
        .match({id:messageId})
        .single();
    }

}