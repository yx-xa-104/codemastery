import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { createClient, SupabaseClient } from '@supabase/supabase-js';
import { Database } from './database.types';

@Injectable()
export class SupabaseService {
    private adminClient: SupabaseClient<Database>;

    constructor(private config: ConfigService) {
        this.adminClient = createClient<Database>(
            this.config.getOrThrow<string>('SUPABASE_URL'),
            this.config.getOrThrow<string>('SUPABASE_SERVICE_ROLE_KEY'),
            { auth: { autoRefreshToken: false, persistSession: false } },
        );
    }

    /** Admin client — bypasses RLS, use for server-side operations */
    get admin(): SupabaseClient<Database> {
        return this.adminClient;
    }

    /** Create a client scoped to a user's JWT — respects RLS */
    forUser(accessToken: string): SupabaseClient<Database> {
        return createClient<Database>(
            this.config.getOrThrow<string>('SUPABASE_URL'),
            this.config.getOrThrow<string>('SUPABASE_ANON_KEY'),
            {
                global: { headers: { Authorization: `Bearer ${accessToken}` } },
                auth: { autoRefreshToken: false, persistSession: false },
            },
        );
    }
}
