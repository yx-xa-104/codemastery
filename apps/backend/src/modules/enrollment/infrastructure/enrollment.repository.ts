import { Injectable } from '@nestjs/common';
import { SupabaseService } from '@infra/database/supabase.service';
import { Tables } from '@infra/database/database.types';
import { handleSupabaseError } from '@common/exceptions/supabase-error.util';
import { EnrollmentWithCourse } from '../domain/enrollment.interface';

@Injectable()
export class EnrollmentRepository {
    constructor(private supabase: SupabaseService) { }

    async findByUserAndCourse(userId: string, courseId: string): Promise<{ id: string, is_blocked?: boolean } | null> {
        const { data } = await (this.supabase.admin as any)
            .from('enrollments')
            .select('id, is_blocked')
            .eq('user_id', userId)
            .eq('course_id', courseId)
            .maybeSingle();
        return data as { id: string, is_blocked?: boolean } | null;
    }

    async create(userId: string, courseId: string): Promise<Tables<'enrollments'>> {
        // First check profile info
        const { data: profile } = await this.supabase.admin
            .from('profiles')
            .select('student_id, class_code')
            .eq('id', userId)
            .single();

        if (!profile || !(profile as any).student_id || !(profile as any).class_code) {
            throw new Error('REQUIRE_PROFILE_UPDATE');
        }

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

    async updateBlockStatus(userId: string, courseId: string, isBlocked: boolean): Promise<void> {
        const { error } = await (this.supabase.admin as any)
            .from('enrollments')
            .update({ is_blocked: isBlocked })
            .eq('user_id', userId)
            .eq('course_id', courseId);
            
        if (error) handleSupabaseError(error, 'Failed to update block status');
    }

    async getBlockedStudentsByCourse(courseId: string) {
        const { data, error } = await (this.supabase.admin as any)
            .from('enrollments')
            .select('user_id, enrolled_at, profiles!inner(full_name, avatar_url, student_id, class_code)')
            .eq('course_id', courseId)
            .eq('is_blocked', true);

        if (error) handleSupabaseError(error);
        return data;
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

    /**
     * Recalculate course progress_percent after a lesson is completed.
     * Finds the course via lesson → module → course chain,
     * then counts completed / total lessons.
     */
    async recalculateCourseProgress(userId: string, lessonId: string): Promise<void> {
        try {
            // Get module_id from lesson
            const { data: lessonData } = await this.supabase.admin
                .from('lessons')
                .select('module_id')
                .eq('id', lessonId)
                .single();
            if (!lessonData) return;

            // Get course_id from module
            const { data: moduleData } = await this.supabase.admin
                .from('modules')
                .select('course_id')
                .eq('id', (lessonData as any).module_id)
                .single();
            if (!moduleData) return;

            const courseId = (moduleData as any).course_id;

            // Count total lessons in the course
            const { data: allModules } = await this.supabase.admin
                .from('modules')
                .select('id')
                .eq('course_id', courseId);

            if (!allModules || allModules.length === 0) return;
            const moduleIds = allModules.map((m: any) => m.id);

            const { count: totalLessons } = await this.supabase.admin
                .from('lessons')
                .select('id', { count: 'exact', head: true })
                .in('module_id', moduleIds);

            if (!totalLessons) return;

            // Count completed lessons by this user
            const { data: allLessons } = await this.supabase.admin
                .from('lessons')
                .select('id')
                .in('module_id', moduleIds);

            if (!allLessons) return;
            const lessonIds = allLessons.map((l: any) => l.id);

            const { count: completedLessons } = await this.supabase.admin
                .from('lesson_progress')
                .select('id', { count: 'exact', head: true })
                .eq('user_id', userId)
                .eq('status', 'completed')
                .in('lesson_id', lessonIds);

            const progressPercent = Math.round(((completedLessons ?? 0) / totalLessons) * 100);

            // Update enrollment
            await (this.supabase.admin as any)
                .from('enrollments')
                .update({
                    progress_percent: progressPercent,
                    current_lesson_id: lessonId,
                    ...(progressPercent >= 100 ? { completed_at: new Date().toISOString() } : {}),
                })
                .eq('user_id', userId)
                .eq('course_id', courseId);
        } catch (err) {
            console.error('Failed to recalculate course progress:', err);
        }
    }

    /**
     * Get all completed lesson IDs for a user within a course's modules.
     */
    async getCompletedLessonIds(userId: string, courseId: string): Promise<string[]> {
        // Get all module IDs for the course
        const { data: modules } = await this.supabase.admin
            .from('modules')
            .select('id')
            .eq('course_id', courseId);

        if (!modules || modules.length === 0) return [];
        const moduleIds = modules.map((m: any) => m.id);

        // Get all lesson IDs in the course
        const { data: lessons } = await this.supabase.admin
            .from('lessons')
            .select('id')
            .in('module_id', moduleIds);

        if (!lessons || lessons.length === 0) return [];
        const lessonIds = lessons.map((l: any) => l.id);

        // Get completed lesson progress
        const { data: completed } = await this.supabase.admin
            .from('lesson_progress')
            .select('lesson_id')
            .eq('user_id', userId)
            .eq('status', 'completed')
            .in('lesson_id', lessonIds);

        return (completed ?? []).map((c: any) => c.lesson_id);
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

    async getLearningActivity(userId: string, days: number = 7) {
        const startDate = new Date();
        startDate.setDate(startDate.getDate() - days);
        const startStr = startDate.toISOString().split('T')[0];

        const { data, error } = await this.supabase.admin
            .from('learning_activity')
            .select('activity_date, lessons_completed, duration_minutes')
            .eq('user_id', userId)
            .gte('activity_date', startStr)
            .order('activity_date', { ascending: true });

        if (error) handleSupabaseError(error);
        return data ?? [];
    }

    async pinCourse(userId: string, courseId: string) {
        const { data, error } = await (this.supabase.admin as any)
            .from('pinned_courses')
            .upsert(
                { user_id: userId, course_id: courseId },
                { onConflict: 'user_id,course_id' },
            )
            .select()
            .single();

        if (error) handleSupabaseError(error);
        return data;
    }

    async unpinCourse(userId: string, courseId: string) {
        const { error } = await this.supabase.admin
            .from('pinned_courses')
            .delete()
            .eq('user_id', userId)
            .eq('course_id', courseId);

        if (error) handleSupabaseError(error);
        return { message: 'Unpinned' };
    }

    async getPinnedCourses(userId: string) {
        // First get pinned course IDs
        const { data: pinned, error: pinError } = await this.supabase.admin
            .from('pinned_courses')
            .select('course_id')
            .eq('user_id', userId)
            .order('pinned_at', { ascending: false });

        if (pinError) handleSupabaseError(pinError);
        if (!pinned || pinned.length === 0) return [];

        const courseIds = pinned.map((p: any) => p.course_id);

        // Get enrollments for those courses (includes progress_percent)
        const { data: enrollments, error: enrError } = await this.supabase.admin
            .from('enrollments')
            .select('*, courses(id, title, slug, thumbnail_url, level, total_lessons, categories(name))')
            .eq('user_id', userId)
            .in('course_id', courseIds);

        if (enrError) handleSupabaseError(enrError);
        return enrollments ?? [];
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
