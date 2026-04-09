import { Injectable } from '@nestjs/common';
import { SupabaseService } from '@infra/database/supabase.service';

@Injectable()
export class AdminRepository {
    constructor(private supabase: SupabaseService) { }

    async getDashboardStats() {
        const { count: courseCount } = await (this.supabase.admin as any).from('courses').select('*', { count: 'exact', head: true });
        const { count: enrollCount } = await (this.supabase.admin as any).from('enrollments').select('*', { count: 'exact', head: true });
        const { count: studentCount } = await (this.supabase.admin as any).from('profiles').select('*', { count: 'exact', head: true }).eq('role', 'student');

        // Average rating
        const { data: reviews } = await (this.supabase.admin as any)
            .from('course_reviews')
            .select('rating');
        const avgRating = reviews?.length
            ? (reviews.reduce((sum: number, r: any) => sum + r.rating, 0) / reviews.length).toFixed(1)
            : '0';

        return {
            courseCount: courseCount || 0,
            enrollCount: enrollCount || 0,
            studentCount: studentCount || 0,
            avgRating,
            reviewCount: reviews?.length || 0,
        };
    }

    async getRecentCourses(limit = 5) {
        const { data } = await (this.supabase.admin as any)
            .from('courses')
            .select('id, title, slug, status, total_enrollments, level, updated_at, categories(name)')
            .order('updated_at', { ascending: false })
            .limit(limit);
        return data || [];
    }

    async getRecentStudents(limit = 8) {
        const { data } = await (this.supabase.admin as any)
            .from('enrollments')
            .select('enrolled_at, profiles(full_name, avatar_url), courses(title)')
            .order('enrolled_at', { ascending: false })
            .limit(limit);
        return data || [];
    }

    async getTopCourses(limit = 5) {
        const { data } = await (this.supabase.admin as any)
            .from('courses')
            .select('id, title, total_enrollments, avg_rating')
            .order('total_enrollments', { ascending: false })
            .limit(limit);
        return data || [];
    }

    async getEnrollmentsByDay(days = 7) {
        const since = new Date();
        since.setDate(since.getDate() - days);
        const sinceStr = since.toISOString();

        const { data } = await (this.supabase.admin as any)
            .from('enrollments')
            .select('enrolled_at')
            .gte('enrolled_at', sinceStr)
            .order('enrolled_at');

        // Group by day of week
        const dayCounts: Record<string, number> = {};
        (data || []).forEach((e: any) => {
            const day = new Date(e.enrolled_at).toISOString().split('T')[0];
            dayCounts[day] = (dayCounts[day] || 0) + 1;
        });

        // Build last N days array
        const result = [];
        for (let i = days - 1; i >= 0; i--) {
            const d = new Date();
            d.setDate(d.getDate() - i);
            const key = d.toISOString().split('T')[0];
            const dayNames = ['CN', 'T2', 'T3', 'T4', 'T5', 'T6', 'T7'];
            result.push({
                date: key,
                label: dayNames[d.getDay()],
                count: dayCounts[key] || 0,
            });
        }
        return result;
    }

    async getReportStats() {
        const { count: totalStudents } = await (this.supabase.admin as any).from('profiles').select('*', { count: 'exact', head: true });
        const { count: totalEnrollments } = await (this.supabase.admin as any).from('enrollments').select('*', { count: 'exact', head: true });
        const { count: totalCourses } = await (this.supabase.admin as any).from('courses').select('*', { count: 'exact', head: true });

        const { data: reviews } = await (this.supabase.admin as any)
            .from('course_reviews')
            .select('rating');
        const avgRating = reviews?.length
            ? (reviews.reduce((sum: number, r: any) => sum + r.rating, 0) / reviews.length).toFixed(1)
            : '0';

        return {
            totalStudents: totalStudents || 0,
            totalEnrollments: totalEnrollments || 0,
            totalCourses: totalCourses || 0,
            avgRating,
            reviewCount: reviews?.length || 0,
        };
    }

    async getStudents() {
        const { data: students } = await (this.supabase.admin as any)
            .from('profiles')
            .select('id, full_name, email, role, avatar_url, updated_at');
        return students || [];
    }

    async getStudentEnrollments() {
        const { data: enrollments } = await (this.supabase.admin as any)
            .from('enrollments')
            .select('user_id, courses(id, title), progress_percent');
        return enrollments || [];
    }

    async getRecentEnrollments() {
        const { data: enrollments } = await (this.supabase.admin as any)
            .from('enrollments')
            .select('id, progress_percent, enrolled_at, user_id, courses(title, level), profiles(full_name, student_id, avatar_url)')
            .order('enrolled_at', { ascending: false })
            .limit(50);
        return enrollments || [];
    }

    async getAllUsers() {
        const { data: profiles } = await (this.supabase.admin as any)
            .from('profiles')
            .select('id, full_name, email, student_id, avatar_url, role, created_at, updated_at')
            .order('created_at', { ascending: false });

        // Check auth user ban status
        const users = profiles || [];
        const result = [];
        for (const p of users) {
            let isLocked = false;
            try {
                const { data: authUser } = await this.supabase.admin.auth.admin.getUserById(p.id);
                isLocked = !!authUser?.user?.banned_until &&
                    new Date(authUser.user.banned_until) > new Date();
            } catch { /* ignore */ }
            result.push({ ...p, is_locked: isLocked });
        }
        return result;
    }

    async updateUserRole(userId: string, role: string) {
        const { error } = await (this.supabase.admin as any)
            .from('profiles')
            .update({ role })
            .eq('id', userId);
        if (error) throw error;
        return { success: true };
    }

    async updateUserLockStatus(userId: string, locked: boolean) {
        if (locked) {
            // Ban user for 100 years (effectively permanent)
            const { error } = await this.supabase.admin.auth.admin.updateUserById(userId, {
                ban_duration: '876000h',
            });
            if (error) throw error;
        } else {
            // Unban user
            const { error } = await this.supabase.admin.auth.admin.updateUserById(userId, {
                ban_duration: 'none',
            });
            if (error) throw error;
        }
        return { success: true };
    }

    async resetUserPassword(userId: string) {
        const defaultPassword = 'CodeMastery@123';
        const { error } = await this.supabase.admin.auth.admin.updateUserById(userId, {
            password: defaultPassword,
        });
        if (error) throw error;
        return { success: true, defaultPassword };
    }
}
