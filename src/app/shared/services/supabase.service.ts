import {Injectable} from '@angular/core';
import {environment} from 'src/environments/environment';
import {createClient, SupabaseClient} from '@supabase/supabase-js';


@Injectable({
  providedIn: 'root'
})
export class SupabaseService {

  public supabase: SupabaseClient;

  constructor() {
    this.supabase = createClient(environment.supaURL, environment.supaKEY);
  }

  removeAllSubscriptions(){
    for (const sub of this.supabase.getSubscriptions()){
      this.supabase.removeSubscription(sub);
    }
  }
}







