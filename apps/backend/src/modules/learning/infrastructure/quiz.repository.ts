import { Injectable } from '@nestjs/common';
import { SupabaseService } from '@infra/database/supabase.service';
import { handleSupabaseError } from '@common/exceptions/supabase-error.util';

@Injectable()
export class QuizRepository {
    constructor(private supabase: SupabaseService) { }

    async findByLesson(lessonId: string) {
        const { data, error } = await this.supabase.admin
            .from('quiz_questions')
            .select('*, quiz_options(*)')
            .eq('lesson_id', lessonId)
            .order('sort_order')
            .order('sort_order', { referencedTable: 'quiz_options' });

        if (error) handleSupabaseError(error);
        return data ?? [];
    }

    async createQuestion(lessonId: string, questionText: string, sortOrder: number, options: { option_text: string; is_correct?: boolean; sort_order?: number }[]) {
        const { data: question, error: qError } = await this.supabase.admin
            .from('quiz_questions')
            .insert({ lesson_id: lessonId, question_text: questionText, sort_order: sortOrder } as any)
            .select()
            .single();

        if (qError) handleSupabaseError(qError);

        if (options.length > 0) {
            const optionsData = options.map((opt, i) => ({
                question_id: (question as any).id,
                option_text: opt.option_text,
                is_correct: opt.is_correct ?? false,
                sort_order: opt.sort_order ?? i,
            }));

            const { error: oError } = await this.supabase.admin
                .from('quiz_options')
                .insert(optionsData as any);

            if (oError) handleSupabaseError(oError);
        }

        return this.findQuestionById((question as any).id);
    }

    async findQuestionById(questionId: string) {
        const { data, error } = await this.supabase.admin
            .from('quiz_questions')
            .select('*, quiz_options(*)')
            .eq('id', questionId)
            .order('sort_order', { referencedTable: 'quiz_options' })
            .single();

        if (error) handleSupabaseError(error);
        return data;
    }

    async updateQuestion(questionId: string, updates: { question_text?: string; sort_order?: number }, options?: { option_text: string; is_correct?: boolean; sort_order?: number }[]) {
        if (updates.question_text || updates.sort_order !== undefined) {
            const { error } = await (this.supabase.admin as any)
                .from('quiz_questions')
                .update(updates)
                .eq('id', questionId);

            if (error) handleSupabaseError(error);
        }

        if (options) {
            // Delete old options and insert new
            await this.supabase.admin
                .from('quiz_options')
                .delete()
                .eq('question_id', questionId);

            if (options.length > 0) {
                const optionsData = options.map((opt, i) => ({
                    question_id: questionId,
                    option_text: opt.option_text,
                    is_correct: opt.is_correct ?? false,
                    sort_order: opt.sort_order ?? i,
                }));

                const { error: oError } = await this.supabase.admin
                    .from('quiz_options')
                    .insert(optionsData as any);

                if (oError) handleSupabaseError(oError);
            }
        }

        return this.findQuestionById(questionId);
    }

    async deleteQuestion(questionId: string) {
        const { error } = await this.supabase.admin
            .from('quiz_questions')
            .delete()
            .eq('id', questionId);

        if (error) handleSupabaseError(error);
    }
}
