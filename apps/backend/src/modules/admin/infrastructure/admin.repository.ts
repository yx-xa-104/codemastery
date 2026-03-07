import { Injectable } from '@nestjs/common';
import { SupabaseService } from '@infra/database/supabase.service';

@Injectable()
export class AdminRepository {
    constructor(private supabase: SupabaseService) { }

    async getDashboardStats() {
        const { count: courseCount } = await (this.supabase.admin as any).from('courses').select('*', { count: 'exact', head: true });
        const { count: enrollCount } = await (this.supabase.admin as any).from('enrollments').select('*', { count: 'exact', head: true });

        return {
            courseCount: courseCount || 0,
            enrollCount: enrollCount || 0,
        };
    }

    async getReportStats() {
        const { count: totalStudents } = await (this.supabase.admin as any).from('profiles').select('*', { count: 'exact', head: true });
        const { count: totalEnrollments } = await (this.supabase.admin as any).from('enrollments').select('*', { count: 'exact', head: true });
        const { count: totalCourses } = await (this.supabase.admin as any).from('courses').select('*', { count: 'exact', head: true });

        return {
            totalStudents: totalStudents || 0,
            totalEnrollments: totalEnrollments || 0,
            totalCourses: totalCourses || 0,
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
}
