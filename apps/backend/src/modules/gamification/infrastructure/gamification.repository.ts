import { Injectable } from '@nestjs/common';
import { SupabaseService } from '@infra/database/supabase.service';
import { handleSupabaseError } from '@common/exceptions/supabase-error.util';

@Injectable()
export class GamificationRepository {
    constructor(private supabase: SupabaseService) { }

    async getLeaderboard(limit = 20) {
        const { data, error } = await this.supabase.admin
            .from('profiles')
            .select('id, full_name, avatar_url, xp, streak_days')
            .order('xp', { ascending: false })
            .limit(limit);

        if (error) handleSupabaseError(error);
        return data ?? [];
    }

    async getUserStats(userId: string) {
        const { data: profile, error } = await this.supabase.admin
            .from('profiles')
            .select('id, full_name, avatar_url, xp, streak_days, last_activity_date')
            .eq('id', userId)
            .single();

        if (error) handleSupabaseError(error);

        // Calculate rank
        const { count } = await this.supabase.admin
            .from('profiles')
            .select('*', { count: 'exact', head: true })
            .gt('xp', (profile as any)?.xp ?? 0);

        return {
            ...(profile as any),
            rank: (count ?? 0) + 1,
        };
    }

    async awardXp(userId: string, xpAmount: number) {
        // Get current profile
        const { data: profile } = await this.supabase.admin
            .from('profiles')
            .select('xp, streak_days, last_activity_date')
            .eq('id', userId)
            .single();

        const currentXp = (profile as any)?.xp ?? 0;
        const currentStreak = (profile as any)?.streak_days ?? 0;
        const lastActivity = (profile as any)?.last_activity_date;

        // Calculate streak
        const today = new Date().toISOString().split('T')[0];
        const yesterday = new Date(Date.now() - 86400000).toISOString().split('T')[0];

        let newStreak = currentStreak;
        if (lastActivity === yesterday) {
            newStreak = currentStreak + 1;
        } else if (lastActivity !== today) {
            newStreak = 1; // Reset streak
        }

        // Apply streak bonus
        let bonusMultiplier = 1;
        if (newStreak >= 30) bonusMultiplier = 2.0;
        else if (newStreak >= 7) bonusMultiplier = 1.5;

        const finalXp = Math.round(xpAmount * bonusMultiplier);

        const { error } = await (this.supabase.admin as any)
            .from('profiles')
            .update({
                xp: currentXp + finalXp,
                streak_days: newStreak,
                last_activity_date: today,
            })
            .eq('id', userId);

        if (error) handleSupabaseError(error);

        return { xpEarned: finalXp, totalXp: currentXp + finalXp, streak: newStreak, bonusMultiplier };
    }

    async getUserBadges(userId: string) {
        const { data, error } = await this.supabase.admin
            .from('user_badges')
            .select('*, badges(*)')
            .eq('user_id', userId);

        if (error) handleSupabaseError(error);
        return data ?? [];
    }

    async getAvailableBadges() {
        const { data, error } = await this.supabase.admin
            .from('badges')
            .select('*')
            .order('criteria_value');

        if (error) handleSupabaseError(error);
        return data ?? [];
    }

    async awardBadge(userId: string, badgeId: string) {
        const { data, error } = await this.supabase.admin
            .from('user_badges')
            .insert({ user_id: userId, badge_id: badgeId } as any)
            .select()
            .single();

        // Ignore duplicate errors
        if (error && !error.message?.includes('duplicate')) {
            handleSupabaseError(error);
        }
        return data;
    }

    async checkAndAwardBadges(userId: string) {
        // Get user stats
        const { data: profile } = await this.supabase.admin
            .from('profiles')
            .select('xp, streak_days')
            .eq('id', userId)
            .single();

        // Get completed lessons count
        const { count: completedLessons } = await this.supabase.admin
            .from('lesson_progress')
            .select('*', { count: 'exact', head: true })
            .eq('user_id', userId)
            .eq('status', 'completed' as any);

        // Get available badges
        const badges = await this.getAvailableBadges();
        const userBadges = await this.getUserBadges(userId);
        const earnedBadgeIds = userBadges.map((ub: any) => ub.badge_id);

        const newBadges: any[] = [];

        for (const badge of badges) {
            if (earnedBadgeIds.includes((badge as any).id)) continue;

            const b = badge as any;
            let earned = false;

            switch (b.criteria_type) {
                case 'lessons_completed':
                    earned = (completedLessons ?? 0) >= b.criteria_value;
                    break;
                case 'streak_days':
                    earned = ((profile as any)?.streak_days ?? 0) >= b.criteria_value;
                    break;
                case 'xp_total':
                    earned = ((profile as any)?.xp ?? 0) >= b.criteria_value;
                    break;
            }

            if (earned) {
                await this.awardBadge(userId, b.id);
                newBadges.push(badge);
            }
        }

        return newBadges;
    }
}
