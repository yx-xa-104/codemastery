// =============================
// Types for CodeMastery App
// =============================
//
// DB Row types — always use these for data from Supabase / API
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
} from '../lib/supabase/database.types';

// --- Chat & AI ---
export interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
}

// --- Code Editor ---
export interface CodeEditorProps {
  initialCode?: string;
  language?: string;
  onRun?: (code: string) => void;
}

// --- Theme ---
export type Theme = 'dark' | 'light';

