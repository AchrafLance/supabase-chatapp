import { User } from "./user.type";
export interface Chat {
   id?: number; 
   contact_1?: User; 
   contact_2?: User; 
   latest_message: string; 
   created_at?:Date; 
}
