import { Tables } from '@shared/database/database.types';

export type LessonWithModule = Tables<'lessons'> & {
  modules: Pick<Tables<'modules'>, 'id' | 'title' | 'sort_order' | 'course_id'> | null;
};

export type ModuleWithLessons = Tables<'modules'> & {
  lessons: Tables<'lessons'>[];
};
