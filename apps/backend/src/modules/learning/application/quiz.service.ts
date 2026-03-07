import { Injectable } from '@nestjs/common';
import { QuizRepository } from '../infrastructure/quiz.repository';

@Injectable()
export class QuizService {
    constructor(private quizRepository: QuizRepository) { }

    async findByLesson(lessonId: string) {
        return this.quizRepository.findByLesson(lessonId);
    }

    async createQuestion(
        lessonId: string,
        questionText: string,
        sortOrder: number,
        options: { option_text: string; is_correct?: boolean; sort_order?: number }[],
    ) {
        return this.quizRepository.createQuestion(lessonId, questionText, sortOrder, options);
    }

    async updateQuestion(
        questionId: string,
        updates: { question_text?: string; sort_order?: number },
        options?: { option_text: string; is_correct?: boolean; sort_order?: number }[],
    ) {
        return this.quizRepository.updateQuestion(questionId, updates, options);
    }

    async deleteQuestion(questionId: string) {
        return this.quizRepository.deleteQuestion(questionId);
    }
}
