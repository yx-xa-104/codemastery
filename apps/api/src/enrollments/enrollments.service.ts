import { Injectable, NotFoundException, ConflictException } from '@nestjs/common';
import { SupabaseService } from '../supabase/supabase.service';
import { Tables } from '../types/database.types';
import { handleSupabaseError } from '../common/supabase-error.util';

type EnrollmentWithCourse = Tables<'enrollments'> & {
  courses: Pick<
    Tables<'courses'>,
    'id' | 'title' | 'slug' | 'thumbnail_url' | 'level' | 'duration_hours' | 'total_lessons'
  > & { categories: Pick<Tables<'categories'>, 'name'> | null };
};

@Injectable()
export class EnrollmentsService {
  constructor(private supabase: SupabaseService) {}

  async enroll(userId: string, courseId: string): Promise<Tables<'enrollments'>> {
    const { data: existing } = await this.supabase.admin
      .from('enrollments')
      .select('id')
      .eq('user_id', userId)
      .eq('course_id', courseId)
      .single();

    if (existing) {
      throw new ConflictException('Already enrolled in this course');
    }

    const { data, error } = await (this.supabase.admin as any)
      .from('enrollments')
      .insert({ user_id: userId, course_id: courseId })
      .select()
      .single();

    if (error) handleSupabaseError(error);

    // Increment enrollment count (best effort)
    try {
      await (this.supabase.admin as any).rpc('increment_enrollment_count', { p_course_id: courseId });
    } catch {
      // RPC may not exist yet — ignore
    }

    return data as Tables<'enrollments'>;
  }

  async unenroll(userId: string, courseId: string): Promise<{ message: string }> {
    const { error } = await this.supabase.admin
      .from('enrollments')
      .delete()
      .eq('user_id', userId)
      .eq('course_id', courseId);

    if (error) handleSupabaseError(error);
    return { message: 'Unenrolled successfully' };
  }

  async getMyEnrollments(userId: string): Promise<EnrollmentWithCourse[]> {
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

  async markLessonComplete(
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
}

