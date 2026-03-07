import { Tables } from '@infra/database/database.types';

export type EnrollmentWithCourse = Tables<'enrollments'> & {
    courses: Pick<
        Tables<'courses'>,
        'id' | 'title' | 'slug' | 'thumbnail_url' | 'level' | 'duration_hours' | 'total_lessons'
    > & { categories: Pick<Tables<'categories'>, 'name'> | null };
};
