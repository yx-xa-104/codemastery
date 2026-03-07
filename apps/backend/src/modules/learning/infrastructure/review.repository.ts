import { Injectable } from '@nestjs/common';
import { SupabaseService } from '@infra/database/supabase.service';
import { handleSupabaseError } from '@common/exceptions/supabase-error.util';

@Injectable()
export class ReviewRepository {
    constructor(private supabase: SupabaseService) { }

    async findByCourse(courseId: string) {
        const { data, error } = await this.supabase.admin
            .from('course_reviews')
            .select('*, profiles(id, full_name, avatar_url)')
            .eq('course_id', courseId)
            .order('created_at', { ascending: false });

        if (error) handleSupabaseError(error);
        return data ?? [];
    }

    async create(userId: string, courseId: string, rating: number, comment?: string) {
        const { data, error } = await this.supabase.admin
            .from('course_reviews')
            .insert({ user_id: userId, course_id: courseId, rating, comment } as any)
            .select('*, profiles(id, full_name, avatar_url)')
            .single();

        if (error) handleSupabaseError(error);
        return data;
    }

    async update(id: string, userId: string, updates: { rating?: number; comment?: string }) {
        const { data, error } = await (this.supabase.admin as any)
            .from('course_reviews')
            .update(updates)
            .eq('id', id)
            .eq('user_id', userId)
            .select()
            .single();

        if (error) handleSupabaseError(error);
        return data;
    }

    async delete(id: string, userId: string) {
        const { error } = await this.supabase.admin
            .from('course_reviews')
            .delete()
            .eq('id', id)
            .eq('user_id', userId);

        if (error) handleSupabaseError(error);
    }

    async isEnrolled(userId: string, courseId: string): Promise<boolean> {
        const { data } = await this.supabase.admin
            .from('enrollments')
            .select('id')
            .eq('user_id', userId)
            .eq('course_id', courseId)
            .maybeSingle();

        return !!data;
    }
}
