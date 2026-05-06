import { Injectable } from '@nestjs/common';
import { EnrollmentRepository } from '../infrastructure/enrollment.repository';
import { SupabaseService } from '@infra/database/supabase.service';

@Injectable()
export class RoadmapService {
    constructor(
        private readonly enrollmentRepository: EnrollmentRepository,
        private readonly supabase: SupabaseService,
    ) {}

    async getPersonalizedRoadmap(userId: string) {
        // 1. Fetch all enrollments for the user
        const enrollments = await this.enrollmentRepository.findByUser(userId);

        if (!enrollments || enrollments.length === 0) {
            // No enrollments: fetch top 3 popular courses
            const suggestions = await this.getRecommendations(userId, [], []);
            return {
                suggestedRoadmap: suggestions,
                inProgress: [],
                notStarted: [],
                completed: [],
                message: 'Bạn chưa đăng ký khóa học nào. Khám phá các khóa học gợi ý ngay!',
            };
        }

        // 2. Categorize enrollments and collect habits
        const inProgress = [];
        const notStarted = [];
        const completed = [];
        
        const enrolledCourseIds = new Set<string>();
        const categoryFreq: Record<string, number> = {};

        for (const enrollment of enrollments) {
            const course = enrollment.courses as any;
            if (!course) continue;

            const progress = enrollment.progress_percent || 0;

            const courseItem = {
                id: course.id,
                title: course.title,
                slug: course.slug,
                thumbnail_url: course.thumbnail_url,
                level: course.level,
                progress_percent: progress,
                enrolled_at: enrollment.enrolled_at,
                next_lesson: null,
            };

            enrolledCourseIds.add(course.id);
            if (course.category_id) {
                categoryFreq[course.category_id] = (categoryFreq[course.category_id] || 0) + 1;
            }

            if (progress === 100) {
                completed.push(courseItem);
            } else if (progress > 0) {
                // Fetch next lesson logic
                const nextLesson = await this.getNextLesson(userId, course.id, enrollment.current_lesson_id);
                if (nextLesson) {
                    courseItem.next_lesson = nextLesson;
                }
                inProgress.push(courseItem);
            } else {
                // Not started yet
                const firstLesson = await this.getFirstLesson(course.id);
                if (firstLesson) {
                    courseItem.next_lesson = firstLesson;
                }
                notStarted.push(courseItem);
            }
        }

        // 3. Sort logic:
        // In Progress: sort by most recently active (we can use enrolled_at as a proxy if last_activity is missing, or just keep default order)
        // Not Started: sort by enrolled_at desc

        inProgress.sort((a, b) => new Date(b.enrolled_at).getTime() - new Date(a.enrolled_at).getTime());
        notStarted.sort((a, b) => new Date(b.enrolled_at).getTime() - new Date(a.enrolled_at).getTime());

        // Extract top categories based on frequency
        const topCategories = Object.entries(categoryFreq)
            .sort((a, b) => b[1] - a[1])
            .map(([catId]) => catId);

        const suggestedRoadmap = await this.getRecommendations(userId, Array.from(enrolledCourseIds), topCategories);

        return {
            suggestedRoadmap,
            inProgress,
            notStarted,
            completed,
        };
    }

    private async getRecommendations(userId: string, excludeCourseIds: string[], preferredCategoryIds: string[]) {
        let suggestions: any[] = [];
        
        // Find courses in preferred categories
        if (preferredCategoryIds.length > 0) {
            const { data: catCourses } = await this.supabase.admin
                .from('courses')
                .select('id, title, slug, thumbnail_url, level, total_lessons, category_id, total_enrollments')
                .eq('status', 'published')
                .in('category_id', preferredCategoryIds)
                .order('total_enrollments', { ascending: false });
                
            if (catCourses) {
                const filtered = catCourses.filter((c: any) => !excludeCourseIds.includes(c.id));
                suggestions = [...filtered];
            }
        }
        
        // If we don't have enough suggestions (less than 3), fallback to most popular courses
        if (suggestions.length < 3) {
            const currentIds = suggestions.map(s => s.id);
            const idsToExclude = [...excludeCourseIds, ...currentIds];
            
            let query = this.supabase.admin
                .from('courses')
                .select('id, title, slug, thumbnail_url, level, total_lessons, category_id, total_enrollments')
                .eq('status', 'published')
                .order('total_enrollments', { ascending: false })
                .limit(10);
                
            const { data: popularCourses } = await query;
            
            if (popularCourses) {
                const additional = popularCourses.filter((c: any) => !idsToExclude.includes(c.id));
                suggestions = [...suggestions, ...additional];
            }
        }
        
        // Limit to 3 suggestions and format
        return suggestions.slice(0, 3).map(course => ({
            id: course.id,
            title: course.title,
            slug: course.slug,
            thumbnail_url: course.thumbnail_url,
            level: course.level,
            total_lessons: course.total_lessons,
            reason: preferredCategoryIds.includes(course.category_id) ? 'Dựa trên chủ đề bạn quan tâm' : 'Khóa học nổi bật'
        }));
    }

    private async getNextLesson(userId: string, courseId: string, currentLessonId?: string) {
        // If we know the current lesson, we can try to find the next one by order
        // Otherwise, find the first incomplete lesson
        
        // 1. Fetch all modules and lessons for the course, ordered by index
        const { data: modulesData } = await this.supabase.admin
            .from('modules')
            .select('id, index')
            .eq('course_id', courseId)
            .order('index', { ascending: true });
        
        const modules = modulesData as any[];

        if (!modules || modules.length === 0) return null;
        const moduleIds = modules.map(m => m.id);

        const { data: lessonsData } = await this.supabase.admin
            .from('lessons')
            .select('id, title, lesson_type, index, module_id, duration_minutes')
            .in('module_id', moduleIds)
            .order('index', { ascending: true });
            
        const lessons = lessonsData as any[];

        if (!lessons || lessons.length === 0) return null;

        // Group lessons by module to maintain strict ordering: module index -> lesson index
        const sortedLessons = lessons.sort((a, b) => {
            const modA = modules.find(m => m.id === a.module_id)?.index || 0;
            const modB = modules.find(m => m.id === b.module_id)?.index || 0;
            if (modA !== modB) return modA - modB;
            return a.index - b.index;
        });

        const { data: completedLessonsData } = await this.supabase.admin
            .from('lesson_progress')
            .select('lesson_id')
            .eq('user_id', userId)
            .eq('status', 'completed')
            .in('lesson_id', sortedLessons.map(l => l.id));
            
        const completedLessons = completedLessonsData as any[];

        const completedSet = new Set((completedLessons || []).map(c => c.lesson_id));

        // 3. Find the first lesson that is NOT completed
        for (const lesson of sortedLessons) {
            if (!completedSet.has(lesson.id)) {
                return {
                    id: lesson.id,
                    title: lesson.title,
                    type: lesson.lesson_type,
                    duration: lesson.duration_minutes
                };
            }
        }

        return null;
    }

    private async getFirstLesson(courseId: string) {
        const { data: modulesData } = await this.supabase.admin
            .from('modules')
            .select('id')
            .eq('course_id', courseId)
            .order('index', { ascending: true })
            .limit(1);
            
        const modules = modulesData as any[];

        if (!modules || modules.length === 0) return null;

        const { data: lessonsData } = await this.supabase.admin
            .from('lessons')
            .select('id, title, lesson_type, duration_minutes')
            .eq('module_id', modules[0].id)
            .order('index', { ascending: true })
            .limit(1);
            
        const lessons = lessonsData as any[];

        if (!lessons || lessons.length === 0) return null;

        const lesson = lessons[0];
        return {
            id: lesson.id,
            title: lesson.title,
            type: lesson.lesson_type,
            duration: lesson.duration_minutes
        };
    }
}
