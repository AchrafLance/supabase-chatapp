import { User } from './user';
export interface Chat {
   id?: number;
   contact_1?: string;
   contact_2?: string;
   latest_message: string;
   created_at?: Date;
}
