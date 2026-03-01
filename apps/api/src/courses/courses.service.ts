import { Injectable } from '@nestjs/common';
import { SupabaseService } from '../supabase/supabase.service';

@Injectable()
export class CoursesService {
  constructor(private supabase: SupabaseService) {}

  async findAll(filters?: { status?: string; categoryId?: string; level?: string }) {
    let query = this.supabase.admin
      .from('courses')
      .select('*, categories(id, name, slug)')
      .order('created_at', { ascending: false });

    if (filters?.status) query = query.eq('status', filters.status);
    if (filters?.categoryId) query = query.eq('category_id', filters.categoryId);
    if (filters?.level) query = query.eq('level', filters.level);

    const { data, error } = await query;
    if (error) throw error;
    return data;
  }

  async findBySlug(slug: string) {
    const { data, error } = await this.supabase.admin
      .from('courses')
      .select('*, categories(id, name, slug)')
      .eq('slug', slug)
      .single();

    if (error) throw error;
    return data;
  }

  async findModulesWithLessons(courseId: string) {
    const { data, error } = await this.supabase.admin
      .from('modules')
      .select('*, lessons(*)')
      .eq('course_id', courseId)
      .order('sort_order')
      .order('sort_order', { referencedTable: 'lessons' });

    if (error) throw error;
    return data;
  }

  async getCategories() {
    const { data, error } = await this.supabase.admin
      .from('categories')
      .select('*')
      .order('sort_order');

    if (error) throw error;
    return data;
  }
}
