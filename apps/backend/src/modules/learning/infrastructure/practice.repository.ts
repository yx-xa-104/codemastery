import { Injectable } from '@nestjs/common';
import { SupabaseService } from '@infra/database/supabase.service';

@Injectable()
export class PracticeRepository {
    constructor(private supabase: SupabaseService) { }

    async findAll(filters?: { difficulty?: string; language?: string; category?: string; search?: string }) {
        let query = (this.supabase.admin as any)
            .from('practice_problems')
            .select('id, title, slug, difficulty, language, category, total_submissions, total_accepted, created_at')
            .order('created_at', { ascending: false });

        if (filters?.difficulty) query = query.eq('difficulty', filters.difficulty);
        if (filters?.language) query = query.eq('language', filters.language);
        if (filters?.category) query = query.eq('category', filters.category);
        if (filters?.search) query = query.ilike('title', `%${filters.search}%`);

        const { data, error } = await query;
        if (error) throw error;
        return data;
    }

    async findBySlug(slug: string) {
        const { data, error } = await (this.supabase.admin as any)
            .from('practice_problems')
            .select('*')
            .eq('slug', slug)
            .single();
        if (error) throw error;
        return data;
    }

    async findById(id: string) {
        const { data, error } = await (this.supabase.admin as any)
            .from('practice_problems')
            .select('*')
            .eq('id', id)
            .single();
        if (error) throw error;
        return data;
    }

    async create(problem: any) {
        const slug = problem.title
            .toLowerCase()
            .normalize('NFD').replace(/[\u0300-\u036f]/g, '')
            .replace(/đ/g, 'd').replace(/Đ/g, 'D')
            .replace(/[^a-z0-9\s-]/g, '')
            .replace(/\s+/g, '-')
            .replace(/-+/g, '-')
            .trim();

        const { data, error } = await (this.supabase.admin as any)
            .from('practice_problems')
            .insert({ ...problem, slug })
            .select()
            .single();
        if (error) throw error;
        return data;
    }

    async update(id: string, updates: any) {
        const { data, error } = await (this.supabase.admin as any)
            .from('practice_problems')
            .update(updates)
            .eq('id', id)
            .select()
            .single();
        if (error) throw error;
        return data;
    }

    async delete(id: string) {
        const { error } = await (this.supabase.admin as any)
            .from('practice_problems')
            .delete()
            .eq('id', id);
        if (error) throw error;
    }

    async createSubmission(submission: {
        user_id: string;
        problem_id: string;
        code: string;
        language: string;
        status: string;
        tests_passed: number;
        tests_total: number;
    }) {
        const { data, error } = await (this.supabase.admin as any)
            .from('practice_submissions')
            .insert(submission)
            .select()
            .single();
        if (error) throw error;
        return data;
    }

    async getUserSubmissions(userId: string, problemId: string) {
        const { data, error } = await (this.supabase.admin as any)
            .from('practice_submissions')
            .select('*')
            .eq('user_id', userId)
            .eq('problem_id', problemId)
            .order('submitted_at', { ascending: false });
        if (error) throw error;
        return data;
    }

    async incrementSubmissions(problemId: string, accepted: boolean) {
        const { data: problem } = await (this.supabase.admin as any)
            .from('practice_problems')
            .select('total_submissions, total_accepted')
            .eq('id', problemId)
            .single();

        if (problem) {
            await (this.supabase.admin as any)
                .from('practice_problems')
                .update({
                    total_submissions: (problem.total_submissions || 0) + 1,
                    total_accepted: accepted ? (problem.total_accepted || 0) + 1 : problem.total_accepted,
                })
                .eq('id', problemId);
        }
    }

    async hasUserSolved(userId: string, problemId: string): Promise<boolean> {
        const { data } = await (this.supabase.admin as any)
            .from('practice_submissions')
            .select('id')
            .eq('user_id', userId)
            .eq('problem_id', problemId)
            .eq('status', 'accepted')
            .limit(1);
        return (data?.length ?? 0) > 0;
    }
}
