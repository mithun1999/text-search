import { createClient, SupabaseClient } from '@supabase/supabase-js';
import authConfig from 'src/config/auth.config';

export class SupabaseInstance {
  private static clientInstance: SupabaseClient;
  static getClient() {
    if (!SupabaseInstance.clientInstance) {
      SupabaseInstance.clientInstance = createClient(
        authConfig.supabaseUrl,
        authConfig.supabaseKey,
        { auth: { autoRefreshToken: true, detectSessionInUrl: false } },
      );
    }
    return SupabaseInstance.clientInstance;
  }
}
