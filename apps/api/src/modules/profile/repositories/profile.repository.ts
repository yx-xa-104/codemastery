import { Injectable } from '@nestjs/common';
import { SupabaseService } from '@shared/database/supabase.service';
import { Tables } from '@shared/database/database.types';
import { handleSupabaseError } from '@shared/exceptions/supabase-error.util';
import { BadgeWithDefinition } from '../interfaces/profile.interface';

@Injectable()
export class ProfileRepository {
  constructor(private supabase: SupabaseService) {}

  async findById(userId: string): Promise<Tables<'profiles'>> {
    const { data, error } = await this.supabase.admin
      .from('profiles')
      .select('*')
      .eq('id', userId)
      .single();

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
    },
  ): Promise<Tables<'profiles'>> {
    const { data, error } = await (this.supabase.admin as any)
      .from('profiles')
      .update(updates)
      .eq('id', userId)
      .select()
      .single();

    if (error) handleSupabaseError(error, 'Profile not found');
    return data as Tables<'profiles'>;
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
