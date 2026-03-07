import { Injectable } from '@nestjs/common';
import { SupabaseService } from '@infra/database/supabase.service';
import { Tables } from '@infra/database/database.types';
import { handleSupabaseError } from '@common/exceptions/supabase-error.util';
import { CourseWithCategory, ModuleWithLessons } from '../domain/course.interface';

@Injectable()
export class CourseRepository {
    constructor(private supabase: SupabaseService) { }

    async findAll(filters?: {
        status?: string;
        categoryId?: string;
        level?: string;
    }): Promise<CourseWithCategory[]> {
        let query = this.supabase.admin
            .from('courses')
            .select('*, categories(id, name, slug)')
            .order('created_at', { ascending: false });

        if (filters?.status) query = query.eq('status', filters.status as any);
        if (filters?.categoryId) query = query.eq('category_id', filters.categoryId);
        if (filters?.level) query = query.eq('level', filters.level as any);

        const { data, error } = await query;
        if (error) handleSupabaseError(error);
        return data as CourseWithCategory[];
    }

    async findBySlug(slug: string): Promise<CourseWithCategory> {
        const { data, error } = await this.supabase.admin
            .from('courses')
            .select('*, categories(id, name, slug)')
            .eq('slug', slug)
            .single();

        if (error) handleSupabaseError(error, `Course "${slug}" not found`);
        return data as CourseWithCategory;
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

    async findAllCategories(): Promise<Tables<'categories'>[]> {
        const { data, error } = await this.supabase.admin
            .from('categories')
            .select('*')
            .order('sort_order');

        if (error) handleSupabaseError(error);
        return data ?? [];
    }
}
