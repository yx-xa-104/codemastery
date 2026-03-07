// Database
export { SupabaseModule } from './database/supabase.module';
export { SupabaseService } from './database/supabase.service';
export { Database, Tables, InsertTables, UpdateTables } from './database/database.types';
export type {
  UserRole,
  CourseLevel,
  CourseStatus,
  LessonType,
  ProgressStatus,
  PostType,
} from './database/database.types';

// Auth
export { AuthModule, SupabaseAuthGuard, CurrentUser, AccessToken } from './auth';

// Exceptions
export { handleSupabaseError } from './exceptions/supabase-error.util';
