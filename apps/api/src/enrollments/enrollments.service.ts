import { Injectable, NotFoundException, ConflictException } from '@nestjs/common';
import { SupabaseService } from '../supabase/supabase.service';

@Injectable()
export class EnrollmentsService {
  constructor(private supabase: SupabaseService) {}

  async enroll(userId: string, courseId: string) {
    // Check if already enrolled
    const { data: existing } = await this.supabase.admin
      .from('enrollments')
      .select('id')
      .eq('user_id', userId)
      .eq('course_id', courseId)
      .single();

    if (existing) {
      throw new ConflictException('Already enrolled in this course');
    }

    const { data, error } = await this.supabase.admin
      .from('enrollments')
      .insert({ user_id: userId, course_id: courseId })
      .select()
      .single();

    if (error) throw error;

    // Increment enrollment count (best effort)
    try {
      await this.supabase.admin.rpc('increment_enrollment_count', { p_course_id: courseId });
    } catch {
      // RPC may not exist yet — ignore
    }

    return data;
  }

  async unenroll(userId: string, courseId: string) {
    const { error } = await this.supabase.admin
      .from('enrollments')
      .delete()
      .eq('user_id', userId)
      .eq('course_id', courseId);

    if (error) throw error;
    return { message: 'Unenrolled successfully' };
  }

  async getMyEnrollments(userId: string) {
    const { data, error } = await this.supabase.admin
      .from('enrollments')
      .select('*, courses(id, title, slug, thumbnail_url, level, duration_hours, total_lessons, categories(name))')
      .eq('user_id', userId)
      .order('enrolled_at', { ascending: false });

    if (error) throw error;
    return data;
  }

  async updateProgress(userId: string, courseId: string, progressPercent: number, currentLessonId?: string) {
    const { data, error } = await this.supabase.admin
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

    if (error) throw error;
    return data;
  }

  async markLessonComplete(userId: string, lessonId: string) {
    const { data, error } = await this.supabase.admin
      .from('lesson_progress')
      .upsert(
        { user_id: userId, lesson_id: lessonId, status: 'completed', completed_at: new Date().toISOString() },
        { onConflict: 'user_id,lesson_id' },
      )
      .select()
      .single();

    if (error) throw error;
    return data;
  }
}
