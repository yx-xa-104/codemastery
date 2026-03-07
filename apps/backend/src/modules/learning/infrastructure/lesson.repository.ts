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
            .select('*')
            .eq('id', lessonId)
            .single();

        if (error) handleSupabaseError(error, `Lesson ${lessonId} not found`);
        return data as Tables<'lessons'>;
    }

    // ── CRUD Operations ──────────────────────────────────────────────

    async create(moduleId: string, lessonData: Partial<Tables<'lessons'>>): Promise<Tables<'lessons'>> {
        const slug = this.generateSlug(lessonData.title!);

        // Auto-detect next sort_order if not provided
        let sortOrder = lessonData.sort_order;
        if (sortOrder === undefined) {
            const { data: existing } = await this.supabase.admin
                .from('lessons')
                .select('sort_order')
                .eq('module_id', moduleId)
                .order('sort_order', { ascending: false })
                .limit(1);

            sortOrder = existing && existing.length > 0 ? (existing[0] as any).sort_order + 1 : 0;
        }

        const { data, error } = await this.supabase.admin
            .from('lessons')
            .insert({ ...lessonData, module_id: moduleId, slug, sort_order: sortOrder } as any)
            .select()
            .single();

        if (error) handleSupabaseError(error);

        // Update course total_lessons count
        await this.updateCourseLessonCount(moduleId);

        return data as Tables<'lessons'>;
    }

    async update(id: string, lessonData: Partial<Tables<'lessons'>>): Promise<Tables<'lessons'>> {
        const updateData: any = { ...lessonData };
        if (lessonData.title) {
            updateData.slug = this.generateSlug(lessonData.title);
        }

        const { data, error } = await (this.supabase.admin as any)
            .from('lessons')
            .update(updateData)
            .eq('id', id)
            .select()
            .single();

        if (error) handleSupabaseError(error, `Lesson "${id}" not found`);
        return data as Tables<'lessons'>;
    }

    async delete(id: string): Promise<void> {
        // Get module_id before delete for count update
        const { data: lesson } = await this.supabase.admin
            .from('lessons')
            .select('module_id')
            .eq('id', id)
            .single();

        const { error } = await this.supabase.admin
            .from('lessons')
            .delete()
            .eq('id', id);

        if (error) handleSupabaseError(error);

        if (lesson) {
            await this.updateCourseLessonCount((lesson as any).module_id);
        }
    }

    private async updateCourseLessonCount(moduleId: string) {
        const { data: mod } = await this.supabase.admin
            .from('modules')
            .select('course_id')
            .eq('id', moduleId)
            .single();

        if (mod) {
            const { count } = await this.supabase.admin
                .from('lessons')
                .select('*', { count: 'exact', head: true })
                .in('module_id',
                    (await this.supabase.admin
                        .from('modules')
                        .select('id')
                        .eq('course_id', (mod as any).course_id)
                    ).data?.map((m: any) => m.id) ?? []
                );

            await (this.supabase.admin as any)
                .from('courses')
                .update({ total_lessons: count ?? 0 })
                .eq('id', (mod as any).course_id);
        }
    }

    private generateSlug(title: string): string {
        return title
            .toLowerCase()
            .normalize('NFD')
            .replace(/[\u0300-\u036f]/g, '')
            .replace(/đ/g, 'd')
            .replace(/[^a-z0-9\s-]/g, '')
            .replace(/\s+/g, '-')
            .replace(/-+/g, '-')
            .trim();
    }
}
