import { Injectable } from '@nestjs/common';
import { SupabaseService } from '@infra/database/supabase.service';
import { handleSupabaseError } from '@common/exceptions/supabase-error.util';

@Injectable()
export class NotificationRepository {
    constructor(private supabase: SupabaseService) { }

    async findByUser(userId: string, limit = 20) {
        const { data, error } = await this.supabase.admin
            .from('notifications')
            .select('*')
            .eq('user_id', userId)
            .order('created_at', { ascending: false })
            .limit(limit);

        if (error) handleSupabaseError(error);
        return data ?? [];
    }

    async countUnread(userId: string): Promise<number> {
        const { count, error } = await this.supabase.admin
            .from('notifications')
            .select('*', { count: 'exact', head: true })
            .eq('user_id', userId)
            .eq('is_read', false);

        if (error) handleSupabaseError(error);
        return count ?? 0;
    }

    async markAsRead(id: string, userId: string) {
        const { data, error } = await (this.supabase.admin as any)
            .from('notifications')
            .update({ is_read: true })
            .eq('id', id)
            .eq('user_id', userId)
            .select()
            .single();

        if (error) handleSupabaseError(error);
        return data;
    }

    async markAllAsRead(userId: string) {
        const { error } = await (this.supabase.admin as any)
            .from('notifications')
            .update({ is_read: true })
            .eq('user_id', userId)
            .eq('is_read', false);

        if (error) handleSupabaseError(error);
        return { message: 'All notifications marked as read' };
    }

    async delete(id: string, userId: string) {
        const { error } = await this.supabase.admin
            .from('notifications')
            .delete()
            .eq('id', id)
            .eq('user_id', userId);

        if (error) handleSupabaseError(error);
    }

    async create(userId: string, title: string, body?: string, type = 'system', linkUrl?: string) {
        const { data, error } = await this.supabase.admin
            .from('notifications')
            .insert({ user_id: userId, title, body, type, link_url: linkUrl } as any)
            .select()
            .single();

        if (error) handleSupabaseError(error);
        return data;
    }
}
