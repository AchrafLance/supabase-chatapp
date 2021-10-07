import { User } from "./user";

export class ChatMessage{
    id?: number; 
    chat_id: number; 
    sender: User; 
    message_content: string; 
    created_at?: Date; 
}