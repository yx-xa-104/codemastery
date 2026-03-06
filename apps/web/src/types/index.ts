// Bridge: re-export from shared/types for backward compatibility
export type {
  Tables,
  InsertTables,
  UpdateTables,
  UserRole,
  CourseLevel,
  CourseStatus,
  LessonType,
  ProgressStatus,
  PostType,
} from '@/shared/lib/supabase/database.types';

export type { Message, CodeEditorProps, Theme } from '@/shared/types';
