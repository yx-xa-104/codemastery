import { Tables } from '@shared/database/database.types';

export type CourseWithCategory = Tables<'courses'> & {
  categories: Pick<Tables<'categories'>, 'id' | 'name' | 'slug'> | null;
};

export type ModuleWithLessons = Tables<'modules'> & {
  lessons: Tables<'lessons'>[];
};
