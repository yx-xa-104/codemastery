import { Injectable } from '@nestjs/common';
import { SupabaseService } from '../supabase/supabase.service';
import { Tables } from '../types/database.types';
import { handleSupabaseError } from '../common/supabase-error.util';

type BadgeWithDefinition = Tables<'user_badges'> & {
  badges: Tables<'badges'>;
};

@Injectable()
export class ProfileService {
  constructor(private supabase: SupabaseService) {}

  async getProfile(userId: string): Promise<Tables<'profiles'>> {
    const { data, error } = await this.supabase.admin
      .from('profiles')
      .select('*')
      .eq('id', userId)
      .single();

    if (error) handleSupabaseError(error, `Profile ${userId} not found`);
    return data as Tables<'profiles'>;
  }

  async updateProfile(
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

  async getMyBadges(userId: string): Promise<BadgeWithDefinition[]> {
    const { data, error } = await this.supabase.admin
      .from('user_badges')
      .select('*, badges(*)')
      .eq('user_id', userId)
      .order('earned_at', { ascending: false });

    if (error) handleSupabaseError(error);
    return data as unknown as BadgeWithDefinition[];
  }

  async getLearningActivity(
    userId: string,
    days = 30,
  ): Promise<Tables<'learning_activity'>[]> {
    const since = new Date();
    since.setDate(since.getDate() - days);

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

