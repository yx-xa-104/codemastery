import { Injectable } from '@nestjs/common';
import { SupabaseService } from '../supabase/supabase.service';

@Injectable()
export class ProfileService {
  constructor(private supabase: SupabaseService) {}

  async getProfile(userId: string) {
    const { data, error } = await this.supabase.admin
      .from('profiles')
      .select('*')
      .eq('id', userId)
      .single();

    if (error) throw error;
    return data;
  }

  async updateProfile(userId: string, updates: {
    full_name?: string;
    bio?: string;
    avatar_url?: string;
    date_of_birth?: string;
    student_id?: string;
    class_code?: string;
  }) {
    const { data, error } = await this.supabase.admin
      .from('profiles')
      .update(updates)
      .eq('id', userId)
      .select()
      .single();

    if (error) throw error;
    return data;
  }

  async getMyBadges(userId: string) {
    const { data, error } = await this.supabase.admin
      .from('user_badges')
      .select('*, badges(*)')
      .eq('user_id', userId)
      .order('earned_at', { ascending: false });

    if (error) throw error;
    return data;
  }

  async getLearningActivity(userId: string, days = 30) {
    const since = new Date();
    since.setDate(since.getDate() - days);

    const { data, error } = await this.supabase.admin
      .from('learning_activity')
      .select('*')
      .eq('user_id', userId)
      .gte('activity_date', since.toISOString().split('T')[0])
      .order('activity_date', { ascending: false });

    if (error) throw error;
    return data;
  }
}
