// Auto-generated types from CodeMastery Supabase schema
// Based on supabase/migrations/001_initial_schema.sql

export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

export type UserRole = 'student' | 'teacher' | 'admin';
export type CourseLevel = 'beginner' | 'intermediate' | 'advanced';
export type CourseStatus = 'draft' | 'published' | 'archived';
export type LessonType = 'video' | 'article' | 'code_exercise' | 'quiz';
export type ProgressStatus = 'not_started' | 'in_progress' | 'completed';
export type PostType = 'announcement' | 'assignment' | 'discussion' | 'system';

export interface Database {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string;
          full_name: string;
          date_of_birth: string | null;
          student_id: string | null;
          class_code: string | null;
          email: string | null;
          avatar_url: string | null;
          bio: string | null;
          role: UserRole;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id: string;
          full_name: string;
          date_of_birth?: string | null;
          student_id?: string | null;
          class_code?: string | null;
          email?: string | null;
          avatar_url?: string | null;
          bio?: string | null;
          role?: UserRole;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          full_name?: string;
          date_of_birth?: string | null;
          student_id?: string | null;
          class_code?: string | null;
          email?: string | null;
          avatar_url?: string | null;
          bio?: string | null;
          role?: UserRole;
          updated_at?: string;
        };
        Relationships: [];
      };
      categories: {
        Row: {
          id: string;
          name: string;
          slug: string;
          icon: string | null;
          sort_order: number;
          created_at: string;
        };
        Insert: {
          id?: string;
          name: string;
          slug: string;
          icon?: string | null;
          sort_order?: number;
          created_at?: string;
        };
        Update: {
          name?: string;
          slug?: string;
          icon?: string | null;
          sort_order?: number;
        };
        Relationships: [];
      };
      courses: {
        Row: {
          id: string;
          title: string;
          slug: string;
          description: string | null;
          short_description: string | null;
          thumbnail_url: string | null;
          trailer_url: string | null;
          category_id: string | null;
          level: CourseLevel;
          language: string;
          duration_hours: number | null;
          total_lessons: number | null;
          teacher_id: string | null;
          status: CourseStatus;
          is_published: boolean;
          is_featured: boolean;
          is_hot: boolean;
          is_free: boolean;
          price: number | null;
          requirements: string[];
          learning_outcomes: string[];
          avg_rating: number | null;
          total_reviews: number | null;
          total_enrollments: number | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          title: string;
          slug: string;
          description?: string | null;
          short_description?: string | null;
          thumbnail_url?: string | null;
          trailer_url?: string | null;
          category_id?: string | null;
          level?: CourseLevel;
          language?: string;
          duration_hours?: number | null;
          total_lessons?: number | null;
          teacher_id?: string | null;
          status?: CourseStatus;
          is_published?: boolean;
          is_featured?: boolean;
          is_hot?: boolean;
          is_free?: boolean;
          requirements?: string[];
          learning_outcomes?: string[];
        };
        Update: {
          title?: string;
          slug?: string;
          description?: string | null;
          short_description?: string | null;
          thumbnail_url?: string | null;
          trailer_url?: string | null;
          category_id?: string | null;
          level?: CourseLevel;
          language?: string;
          duration_hours?: number | null;
          total_lessons?: number | null;
          teacher_id?: string | null;
          status?: CourseStatus;
          is_published?: boolean;
          is_featured?: boolean;
          is_hot?: boolean;
          is_free?: boolean;
          requirements?: string[];
          learning_outcomes?: string[];
        };
        Relationships: [
          {
            foreignKeyName: 'courses_category_id_fkey';
            columns: ['category_id'];
            isOneToOne: false;
            referencedRelation: 'categories';
            referencedColumns: ['id'];
          }
        ];
      };
      modules: {
        Row: {
          id: string;
          course_id: string;
          title: string;
          sort_order: number;
          created_at: string;
        };
        Insert: {
          id?: string;
          course_id: string;
          title: string;
          sort_order?: number;
          created_at?: string;
        };
        Update: {
          course_id?: string;
          title?: string;
          sort_order?: number;
        };
        Relationships: [
          {
            foreignKeyName: 'modules_course_id_fkey';
            columns: ['course_id'];
            isOneToOne: false;
            referencedRelation: 'courses';
            referencedColumns: ['id'];
          }
        ];
      };
      lessons: {
        Row: {
          id: string;
          module_id: string;
          title: string;
          slug: string | null;
          lesson_type: LessonType;
          content: string | null;
          content_html: string | null;
          video_url: string | null;
          duration_minutes: number | null;
          starter_code: string | null;
          exercise_config: Record<string, unknown> | null;
          solution_code: string | null;
          programming_language: string | null;
          sort_order: number;
          is_free_preview: boolean;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          module_id: string;
          title: string;
          slug?: string | null;
          lesson_type?: LessonType;
          content?: string | null;
          content_html?: string | null;
          video_url?: string | null;
          duration_minutes?: number | null;
          starter_code?: string | null;
          exercise_config?: Record<string, unknown> | null;
          solution_code?: string | null;
          programming_language?: string | null;
          sort_order?: number;
          is_free_preview?: boolean;
        };
        Update: {
          module_id?: string;
          title?: string;
          slug?: string | null;
          lesson_type?: LessonType;
          content?: string | null;
          content_html?: string | null;
          video_url?: string | null;
          duration_minutes?: number | null;
          starter_code?: string | null;
          exercise_config?: Record<string, unknown> | null;
          solution_code?: string | null;
          programming_language?: string | null;
          sort_order?: number;
          is_free_preview?: boolean;
        };
        Relationships: [
          {
            foreignKeyName: 'lessons_module_id_fkey';
            columns: ['module_id'];
            isOneToOne: false;
            referencedRelation: 'modules';
            referencedColumns: ['id'];
          }
        ];
      };
      quiz_questions: {
        Row: {
          id: string;
          lesson_id: string;
          question_text: string;
          sort_order: number;
          created_at: string;
        };
        Insert: {
          id?: string;
          lesson_id: string;
          question_text: string;
          sort_order?: number;
        };
        Update: {
          question_text?: string;
          sort_order?: number;
        };
        Relationships: [];
      };
      quiz_options: {
        Row: {
          id: string;
          question_id: string;
          option_text: string;
          is_correct: boolean;
          sort_order: number;
        };
        Insert: {
          id?: string;
          question_id: string;
          option_text: string;
          is_correct?: boolean;
          sort_order?: number;
        };
        Update: {
          option_text?: string;
          is_correct?: boolean;
          sort_order?: number;
        };
        Relationships: [];
      };
      enrollments: {
        Row: {
          id: string;
          user_id: string;
          course_id: string;
          progress_percent: number;
          current_lesson_id: string | null;
          enrolled_at: string;
          completed_at: string | null;
        };
        Insert: {
          id?: string;
          user_id: string;
          course_id: string;
          progress_percent?: number;
          current_lesson_id?: string | null;
        };
        Update: {
          progress_percent?: number;
          current_lesson_id?: string | null;
          completed_at?: string | null;
        };
        Relationships: [
          {
            foreignKeyName: 'enrollments_user_id_fkey';
            columns: ['user_id'];
            isOneToOne: false;
            referencedRelation: 'profiles';
            referencedColumns: ['id'];
          },
          {
            foreignKeyName: 'enrollments_course_id_fkey';
            columns: ['course_id'];
            isOneToOne: false;
            referencedRelation: 'courses';
            referencedColumns: ['id'];
          }
        ];
      };
      lesson_progress: {
        Row: {
          id: string;
          user_id: string;
          lesson_id: string;
          status: ProgressStatus;
          score: number | null;
          code_submission: string | null;
          completed_at: string | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          lesson_id: string;
          status?: ProgressStatus;
          score?: number | null;
          code_submission?: string | null;
          completed_at?: string | null;
        };
        Update: {
          status?: ProgressStatus;
          score?: number | null;
          code_submission?: string | null;
          completed_at?: string | null;
        };
        Relationships: [
          {
            foreignKeyName: 'lesson_progress_user_id_fkey';
            columns: ['user_id'];
            isOneToOne: false;
            referencedRelation: 'profiles';
            referencedColumns: ['id'];
          },
          {
            foreignKeyName: 'lesson_progress_lesson_id_fkey';
            columns: ['lesson_id'];
            isOneToOne: false;
            referencedRelation: 'lessons';
            referencedColumns: ['id'];
          }
        ];
      };
      pinned_courses: {
        Row: {
          id: string;
          user_id: string;
          course_id: string;
          pinned_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          course_id: string;
        };
        Update: never;
        Relationships: [];
      };
      learning_activity: {
        Row: {
          id: string;
          user_id: string;
          activity_date: string;
          duration_minutes: number;
          lessons_completed: number;
        };
        Insert: {
          id?: string;
          user_id: string;
          activity_date?: string;
          duration_minutes?: number;
          lessons_completed?: number;
        };
        Update: {
          duration_minutes?: number;
          lessons_completed?: number;
        };
        Relationships: [];
      };
      course_reviews: {
        Row: {
          id: string;
          user_id: string;
          course_id: string;
          rating: number;
          comment: string | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          course_id: string;
          rating: number;
          comment?: string | null;
        };
        Update: {
          rating?: number;
          comment?: string | null;
        };
        Relationships: [];
      };
      classrooms: {
        Row: {
          id: string;
          course_id: string;
          name: string;
          teacher_id: string | null;
          meeting_url: string | null;
          is_active: boolean;
          max_members: number;
          created_at: string;
        };
        Insert: {
          id?: string;
          course_id: string;
          name: string;
          teacher_id?: string | null;
          meeting_url?: string | null;
          is_active?: boolean;
          max_members?: number;
        };
        Update: {
          name?: string;
          teacher_id?: string | null;
          meeting_url?: string | null;
          is_active?: boolean;
          max_members?: number;
        };
        Relationships: [];
      };
      classroom_members: {
        Row: {
          id: string;
          classroom_id: string;
          user_id: string;
          role: string;
          joined_at: string;
          last_seen_at: string | null;
          is_online: boolean;
        };
        Insert: {
          id?: string;
          classroom_id: string;
          user_id: string;
          role?: string;
        };
        Update: {
          role?: string;
          last_seen_at?: string | null;
          is_online?: boolean;
        };
        Relationships: [];
      };
      classroom_posts: {
        Row: {
          id: string;
          classroom_id: string;
          author_id: string;
          content: string;
          post_type: PostType;
          is_pinned: boolean;
          is_important: boolean;
          attachment_urls: string[];
          likes_count: number;
          comments_count: number;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          classroom_id: string;
          author_id: string;
          content: string;
          post_type?: PostType;
          is_pinned?: boolean;
          is_important?: boolean;
          attachment_urls?: string[];
        };
        Update: {
          content?: string;
          post_type?: PostType;
          is_pinned?: boolean;
          is_important?: boolean;
          attachment_urls?: string[];
        };
        Relationships: [];
      };
      post_comments: {
        Row: {
          id: string;
          post_id: string;
          author_id: string;
          content: string;
          created_at: string;
        };
        Insert: {
          id?: string;
          post_id: string;
          author_id: string;
          content: string;
        };
        Update: {
          content?: string;
        };
        Relationships: [];
      };
      post_reactions: {
        Row: {
          id: string;
          post_id: string;
          user_id: string;
          reaction_type: string;
          created_at: string;
        };
        Insert: {
          id?: string;
          post_id: string;
          user_id: string;
          reaction_type?: string;
        };
        Update: {
          reaction_type?: string;
        };
        Relationships: [];
      };
      ai_conversations: {
        Row: {
          id: string;
          user_id: string;
          title: string | null;
          context_lesson_id: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          title?: string | null;
          context_lesson_id?: string | null;
        };
        Update: {
          title?: string | null;
          context_lesson_id?: string | null;
        };
        Relationships: [];
      };
      ai_messages: {
        Row: {
          id: string;
          conversation_id: string;
          role: string;
          content: string;
          code_snippet: string | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          conversation_id: string;
          role: string;
          content: string;
          code_snippet?: string | null;
        };
        Update: {
          content?: string;
          code_snippet?: string | null;
        };
        Relationships: [];
      };
      badges: {
        Row: {
          id: string;
          name: string;
          description: string | null;
          icon: string;
          criteria_type: string;
          criteria_value: number;
          created_at: string;
        };
        Insert: {
          id?: string;
          name: string;
          description?: string | null;
          icon: string;
          criteria_type: string;
          criteria_value?: number;
        };
        Update: {
          name?: string;
          description?: string | null;
          icon?: string;
          criteria_type?: string;
          criteria_value?: number;
        };
        Relationships: [];
      };
      user_badges: {
        Row: {
          id: string;
          user_id: string;
          badge_id: string;
          earned_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          badge_id: string;
        };
        Update: never;
        Relationships: [];
      };
      notifications: {
        Row: {
          id: string;
          user_id: string;
          title: string;
          body: string | null;
          type: string;
          link_url: string | null;
          is_read: boolean;
          created_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          title: string;
          body?: string | null;
          type?: string;
          link_url?: string | null;
          is_read?: boolean;
        };
        Update: {
          title?: string;
          body?: string | null;
          type?: string;
          link_url?: string | null;
          is_read?: boolean;
        };
        Relationships: [];
      };
    };
    Enums: {
      user_role: UserRole;
      course_level: CourseLevel;
      course_status: CourseStatus;
      lesson_type: LessonType;
      progress_status: ProgressStatus;
      post_type: PostType;
    };
  };
}

// Convenience type aliases
export type Tables<T extends keyof Database['public']['Tables']> =
  Database['public']['Tables'][T]['Row'];

export type InsertTables<T extends keyof Database['public']['Tables']> =
  Database['public']['Tables'][T]['Insert'];

export type UpdateTables<T extends keyof Database['public']['Tables']> =
  Database['public']['Tables'][T]['Update'];
