import {createClient, SupabaseClient} from '@supabase/supabase-js';
import {environment} from '../../../environments/environment';

export class SupabaseSuperclass {

  protected supabase: SupabaseClient;

  constructor() {
    this.initSupabaseObject();
  }

  private initSupabaseObject() {
    if (!this.supabase) {
      this.supabase = createClient(environment.supaURL, environment.supaKEY);
    }
  }

  public get getSupabase() {
    return this.supabase;
  }
}
