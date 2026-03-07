import { Tables } from '@shared/database/database.types';

export type BadgeWithDefinition = Tables<'user_badges'> & {
  badges: Tables<'badges'>;
};
