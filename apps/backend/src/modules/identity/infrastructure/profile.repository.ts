import { Injectable } from '@nestjs/common';
import { SupabaseService } from '@infra/database/supabase.service';
import { Tables } from '@infra/database/database.types';
import { handleSupabaseError } from '@common/exceptions/supabase-error.util';
import { BadgeWithDefinition } from '../domain/profile.interface';

@Injectable()
export class ProfileRepository {
    constructor(private supabase: SupabaseService) { }

    async findById(userId: string): Promise<Tables<'profiles'>> {
        const { data, error } = await this.supabase.admin
            .from('profiles')
            .select('*')
            .eq('id', userId)
            .maybeSingle();

        // If profile doesn't exist, we return a mock empty profile to prevent frontend crashes
        // The frontend will then allow the user to fill it and send an update.
        if (!data) {
             return { id: userId, full_name: '', email: '', avatar_url: null, bio: null, class_code: null, student_id: null, date_of_birth: null, gender: null, phone: null, role: 'student', created_at: new Date().toISOString(), updated_at: new Date().toISOString() } as unknown as Tables<'profiles'>;
        }

        if (error) handleSupabaseError(error, `Profile ${userId} not found`);
        return data as Tables<'profiles'>;
    }

    async update(
        userId: string,
        updates: {
            full_name?: string;
            bio?: string;
            avatar_url?: string;
            date_of_birth?: string;
            student_id?: string;
            class_code?: string;
            gender?: string;
        },
    ): Promise<Tables<'profiles'>> {
        // Use UPSERT so users without a profile row can successfully save their info
        const { data, error } = await (this.supabase.admin as any)
            .from('profiles')
            .upsert({ id: userId, ...updates }, { onConflict: 'id' })
            .select()
            .single();

        if (error) handleSupabaseError(error, 'Failed to update profile');
        return data as Tables<'profiles'>;
    }

    async uploadAvatar(userId: string, file: any): Promise<string> {
        const ext = file.originalname.split('.').pop() || 'jpg';
        const path = `${userId}.${ext}`;

        // Ensure bucket exists (idempotent)
        await this.supabase.admin.storage.createBucket('avatars', {
            public: true,
            fileSizeLimit: 2 * 1024 * 1024,
            allowedMimeTypes: ['image/jpeg', 'image/png', 'image/webp', 'image/gif'],
        }).catch(() => { /* bucket already exists — ignore */ });

        // Upload to Supabase Storage (upsert to overwrite old avatar)
        const { error } = await this.supabase.admin.storage
            .from('avatars')
            .upload(path, file.buffer, {
                contentType: file.mimetype,
                upsert: true,
            });

        if (error) handleSupabaseError(error, 'Failed to upload avatar');

        // Get public URL
        const { data: urlData } = this.supabase.admin.storage
            .from('avatars')
            .getPublicUrl(path);

        return urlData.publicUrl;
    }

    async findBadges(userId: string): Promise<BadgeWithDefinition[]> {
        const { data, error } = await this.supabase.admin
            .from('user_badges')
            .select('*, badges(*)')
            .eq('user_id', userId)
            .order('earned_at', { ascending: false });

        if (error) handleSupabaseError(error);
        return data as unknown as BadgeWithDefinition[];
    }

    async findLearningActivity(
        userId: string,
        since: Date,
    ): Promise<Tables<'learning_activity'>[]> {
        const { data, error } = await this.supabase.admin
            .from('learning_activity')
            .select('*')
            .eq('user_id', userId)
            .gte('activity_date', since.toISOString().split('T')[0])
            .order('activity_date', { ascending: false });

        if (error) handleSupabaseError(error);
        return data ?? [];
    }
}
