import { Injectable } from '@nestjs/common';
import { SupabaseService } from '@infra/database/supabase.service';
import { Tables } from '@infra/database/database.types';
import { handleSupabaseError } from '@common/exceptions/supabase-error.util';
import { LessonWithModule, ModuleWithLessons } from '../domain/lesson.interface';

@Injectable()
export class LessonRepository {
    constructor(private supabase: SupabaseService) { }

    async findBySlug(
        courseSlug: string,
        lessonSlug: string,
    ): Promise<LessonWithModule | null> {
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

        if (error) handleSupabaseError(error, `Lesson "${lessonSlug}" not found`);
        return data as LessonWithModule;
    }

    async findModulesWithLessons(courseId: string): Promise<ModuleWithLessons[]> {
        const { data, error } = await this.supabase.admin
            .from('modules')
            .select('*, lessons(*)')
            .eq('course_id', courseId)
            .order('sort_order')
            .order('sort_order', { referencedTable: 'lessons' });

        if (error) handleSupabaseError(error);
        return data as ModuleWithLessons[];
    }

    async findContentById(lessonId: string): Promise<Tables<'lessons'>> {
        const { data, error } = await this.supabase.admin
            .from('lessons')
            .select('id, title, slug, content, lesson_type, video_url, duration_minutes, exercise_config')
            .eq('id', lessonId)
            .single();

        if (error) handleSupabaseError(error, `Lesson ${lessonId} not found`);
        return data as Tables<'lessons'>;
    }
}
