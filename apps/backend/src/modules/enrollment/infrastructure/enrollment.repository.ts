import { Injectable } from '@nestjs/common';
import { SupabaseService } from '@infra/database/supabase.service';
import { Tables } from '@infra/database/database.types';
import { handleSupabaseError } from '@common/exceptions/supabase-error.util';
import { EnrollmentWithCourse } from '../domain/enrollment.interface';

@Injectable()
export class EnrollmentRepository {
    constructor(private supabase: SupabaseService) { }

    async findByUserAndCourse(userId: string, courseId: string): Promise<{ id: string } | null> {
        const { data } = await this.supabase.admin
            .from('enrollments')
            .select('id')
            .eq('user_id', userId)
            .eq('course_id', courseId)
            .maybeSingle();
        return data as { id: string } | null;
    }

    async create(userId: string, courseId: string): Promise<Tables<'enrollments'>> {
        const { data, error } = await (this.supabase.admin as any)
            .from('enrollments')
            .insert({ user_id: userId, course_id: courseId })
            .select()
            .single();

        if (error) handleSupabaseError(error);
        return data as Tables<'enrollments'>;
    }

    async delete(userId: string, courseId: string): Promise<void> {
        const { error } = await this.supabase.admin
            .from('enrollments')
            .delete()
            .eq('user_id', userId)
            .eq('course_id', courseId);

        if (error) handleSupabaseError(error);
    }

    async findByUser(userId: string): Promise<EnrollmentWithCourse[]> {
        const { data, error } = await this.supabase.admin
            .from('enrollments')
            .select('*, courses(id, title, slug, thumbnail_url, level, duration_hours, total_lessons, categories(name))')
            .eq('user_id', userId)
            .order('enrolled_at', { ascending: false });

        if (error) handleSupabaseError(error);
        return data as EnrollmentWithCourse[];
    }

    async updateProgress(
        userId: string,
        courseId: string,
        progressPercent: number,
        currentLessonId?: string,
    ): Promise<Tables<'enrollments'>> {
        const { data, error } = await (this.supabase.admin as any)
            .from('enrollments')
            .update({
                progress_percent: progressPercent,
                current_lesson_id: currentLessonId,
                ...(progressPercent >= 100 ? { completed_at: new Date().toISOString() } : {}),
            })
            .eq('user_id', userId)
            .eq('course_id', courseId)
            .select()
            .single();

        if (error) handleSupabaseError(error, 'Enrollment not found');
        return data as Tables<'enrollments'>;
    }

    async upsertLessonProgress(
        userId: string,
        lessonId: string,
    ): Promise<Tables<'lesson_progress'>> {
        const { data, error } = await (this.supabase.admin as any)
            .from('lesson_progress')
            .upsert(
                {
                    user_id: userId,
                    lesson_id: lessonId,
                    status: 'completed',
                    completed_at: new Date().toISOString(),
                },
                { onConflict: 'user_id,lesson_id' },
            )
            .select()
            .single();

        if (error) handleSupabaseError(error);
        return data as Tables<'lesson_progress'>;
    }

    async incrementEnrollmentCount(courseId: string): Promise<void> {
        try {
            await (this.supabase.admin as any).rpc('increment_enrollment_count', { p_course_id: courseId });
        } catch {
            // RPC may not exist yet — ignore
        }
    }

    async getLessonProgress(userId: string, lessonId: string): Promise<Tables<'lesson_progress'> | null> {
        const { data } = await this.supabase.admin
            .from('lesson_progress')
            .select('*')
            .eq('user_id', userId)
            .eq('lesson_id', lessonId)
            .maybeSingle();
        return data as Tables<'lesson_progress'> | null;
    }

    async getLessonType(lessonId: string): Promise<string | null> {
        const { data } = await this.supabase.admin
            .from('lessons')
            .select('lesson_type')
            .eq('id', lessonId)
            .single();
        return (data as any)?.lesson_type ?? null;
    }

    // ── Learning Activity ────────────────────────────────────────────

    async upsertLearningActivity(userId: string) {
        const today = new Date().toISOString().split('T')[0];

        // Try to update existing record for today
        const { data: existing } = await (this.supabase.admin as any)
            .from('learning_activity')
            .select('id, lessons_completed')
            .eq('user_id', userId)
            .eq('activity_date', today)
            .maybeSingle();

        if (existing) {
            await (this.supabase.admin as any)
                .from('learning_activity')
                .update({ lessons_completed: (existing.lessons_completed ?? 0) + 1 })
                .eq('id', existing.id);
        } else {
            await (this.supabase.admin as any)
                .from('learning_activity')
                .insert({ user_id: userId, activity_date: today, lessons_completed: 1 });
        }
    }

    // ── Pinned Courses ───────────────────────────────────────────────

    async pinCourse(userId: string, courseId: string) {
        const { data, error } = await (this.supabase.admin as any)
            .from('enrollments')
            .update({ is_pinned: true })
            .eq('user_id', userId)
            .eq('course_id', courseId)
            .select()
            .single();

        if (error) handleSupabaseError(error);
        return data;
    }

    async unpinCourse(userId: string, courseId: string) {
        const { data, error } = await (this.supabase.admin as any)
            .from('enrollments')
            .update({ is_pinned: false })
            .eq('user_id', userId)
            .eq('course_id', courseId)
            .select()
            .single();

        if (error) handleSupabaseError(error);
        return data;
    }

    async getPinnedCourses(userId: string) {
        const { data, error } = await this.supabase.admin
            .from('enrollments')
            .select('*, courses(id, title, slug, thumbnail_url, level, total_lessons, categories(name))')
            .eq('user_id', userId)
            .eq('is_pinned', true as any)
            .order('enrolled_at', { ascending: false });

        if (error) handleSupabaseError(error);
        return data ?? [];
    }

    // ── Code Submission ──────────────────────────────────────────────

    async saveCodeSubmission(userId: string, lessonId: string, code: string) {
        const { data, error } = await (this.supabase.admin as any)
            .from('lesson_progress')
            .upsert(
                {
                    user_id: userId,
                    lesson_id: lessonId,
                    code_submission: code,
                },
                { onConflict: 'user_id,lesson_id' },
            )
            .select()
            .single();

        if (error) handleSupabaseError(error);
        return data;
    }
}
