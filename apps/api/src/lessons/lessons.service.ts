import { Injectable } from '@nestjs/common';
import { SupabaseService } from '../supabase/supabase.service';

@Injectable()
export class LessonsService {
  constructor(private supabase: SupabaseService) {}

  async findBySlug(courseSlug: string, lessonSlug: string) {
    // First get the course
    const { data: course } = await this.supabase.admin
      .from('courses')
      .select('id')
      .eq('slug', courseSlug)
      .single();

    if (!course) return null;

    const { data, error } = await this.supabase.admin
      .from('lessons')
      .select('*, modules(id, title, sort_order, course_id)')
      .eq('slug', lessonSlug)
      .single();

    if (error) return null;
    return data;
  }

  async getCourseLessons(courseId: string) {
    const { data, error } = await this.supabase.admin
      .from('modules')
      .select('*, lessons(*)')
      .eq('course_id', courseId)
      .order('sort_order')
      .order('sort_order', { referencedTable: 'lessons' });

    if (error) throw error;
    return data;
  }

  async getLessonContent(lessonId: string) {
    const { data, error } = await this.supabase.admin
      .from('lessons')
      .select('id, title, slug, content, lesson_type, video_url, duration_minutes, exercise_config')
      .eq('id', lessonId)
      .single();

    if (error) throw error;
    return data;
  }
}
