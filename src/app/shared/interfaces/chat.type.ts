// export interface Chat {
//     name: string;
//     avatar: string;
//     msg: Msg[];
//     time: string;
// }


// export interface Msg {
//     avatar: string;
//     text: string;
//     from: string;
//     time: string;
//     msgType: 'text' | 'date' | 'image' | 'file';
// }

import { User } from "./user.type";
export interface Chat {
   id?: number; 
   contact_1: User; 
   contact_2: User; 
   latest_message: string; 
   created_at?:Date; 
}
