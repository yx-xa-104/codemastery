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

    // ── CRUD Operations ──────────────────────────────────────────────

    async create(courseData: Partial<Tables<'courses'>>): Promise<Tables<'courses'>> {
        const slug = this.generateSlug(courseData.title!);
        const { data, error } = await this.supabase.admin
            .from('courses')
            .insert({ ...courseData, slug } as any)
            .select()
            .single();

        if (error) handleSupabaseError(error);
        return data as Tables<'courses'>;
    }

    async update(id: string, courseData: Partial<Tables<'courses'>>): Promise<Tables<'courses'>> {
        const updateData: any = { ...courseData };
        if (courseData.title) {
            updateData.slug = this.generateSlug(courseData.title);
        }

        const { data, error } = await (this.supabase.admin as any)
            .from('courses')
            .update(updateData)
            .eq('id', id)
            .select()
            .single();

        if (error) handleSupabaseError(error, `Course "${id}" not found`);
        return data as Tables<'courses'>;
    }

    async delete(id: string): Promise<void> {
        const { error } = await this.supabase.admin
            .from('courses')
            .delete()
            .eq('id', id);

        if (error) handleSupabaseError(error);
    }

    async search(query: string): Promise<CourseWithCategory[]> {
        const { data, error } = await this.supabase.admin
            .from('courses')
            .select('*, categories(id, name, slug)')
            .eq('status', 'published' as any)
            .or(`title.ilike.%${query}%,description.ilike.%${query}%`)
            .order('total_enrollments', { ascending: false })
            .limit(20);

        if (error) handleSupabaseError(error);
        return data as CourseWithCategory[];
    }

    // ── Category CRUD ────────────────────────────────────────────────

    async createCategory(name: string, icon?: string, sortOrder?: number): Promise<Tables<'categories'>> {
        const slug = this.generateSlug(name);
        const { data, error } = await this.supabase.admin
            .from('categories')
            .insert({ name, slug, icon, sort_order: sortOrder ?? 0 } as any)
            .select()
            .single();

        if (error) handleSupabaseError(error);
        return data as Tables<'categories'>;
    }

    async updateCategory(id: string, updates: { name?: string; icon?: string; sort_order?: number }): Promise<Tables<'categories'>> {
        const updateData: any = { ...updates };
        if (updates.name) {
            updateData.slug = this.generateSlug(updates.name);
        }

        const { data, error } = await (this.supabase.admin as any)
            .from('categories')
            .update(updateData)
            .eq('id', id)
            .select()
            .single();

        if (error) handleSupabaseError(error);
        return data as Tables<'categories'>;
    }

    async deleteCategory(id: string): Promise<void> {
        const { error } = await this.supabase.admin
            .from('categories')
            .delete()
            .eq('id', id);

        if (error) handleSupabaseError(error);
    }

    // ── Helpers ───────────────────────────────────────────────────────

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
