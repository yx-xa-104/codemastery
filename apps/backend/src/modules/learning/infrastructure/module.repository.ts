import { Injectable } from '@nestjs/common';
import { SupabaseService } from '@infra/database/supabase.service';
import { handleSupabaseError } from '@common/exceptions/supabase-error.util';

@Injectable()
export class ModuleRepository {
    constructor(private supabase: SupabaseService) { }

    async create(courseId: string, title: string, sortOrder?: number) {
        // Auto-detect next sort_order if not provided
        if (sortOrder === undefined) {
            const { data: existing } = await this.supabase.admin
                .from('modules')
                .select('sort_order')
                .eq('course_id', courseId)
                .order('sort_order', { ascending: false })
                .limit(1);

            sortOrder = existing && existing.length > 0 ? (existing[0] as any).sort_order + 1 : 0;
        }

        const { data, error } = await this.supabase.admin
            .from('modules')
            .insert({ course_id: courseId, title, sort_order: sortOrder } as any)
            .select()
            .single();

        if (error) handleSupabaseError(error);
        return data;
    }

    async update(id: string, updates: { title?: string; sort_order?: number }) {
        const { data, error } = await (this.supabase.admin as any)
            .from('modules')
            .update(updates)
            .eq('id', id)
            .select()
            .single();

        if (error) handleSupabaseError(error);
        return data;
    }

    async delete(id: string) {
        const { error } = await this.supabase.admin
            .from('modules')
            .delete()
            .eq('id', id);

        if (error) handleSupabaseError(error);
    }

    async reorder(items: { id: string; sort_order: number }[]) {
        for (const item of items) {
            await (this.supabase.admin as any)
                .from('modules')
                .update({ sort_order: item.sort_order })
                .eq('id', item.id);
        }
    }
}
