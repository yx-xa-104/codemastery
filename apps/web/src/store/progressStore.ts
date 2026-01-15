import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface ProgressState {
  completedLessons: string[]; // Array of lesson IDs (e.g., "python-02")
  markComplete: (lessonId: string) => void;
  markIncomplete: (lessonId: string) => void;
  isComplete: (lessonId: string) => boolean;
  getCourseProgress: (courseId: string) => { completed: number; total: number; percentage: number };
  clearProgress: () => void;
}

export const useProgressStore = create<ProgressState>()(
  persist(
    (set, get) => ({
      completedLessons: [],

      markComplete: (lessonId: string) => {
        set((state) => ({
          completedLessons: state.completedLessons.includes(lessonId)
            ? state.completedLessons
            : [...state.completedLessons, lessonId],
        }));
      },

      markIncomplete: (lessonId: string) => {
        set((state) => ({
          completedLessons: state.completedLessons.filter((id) => id !== lessonId),
        }));
      },

      isComplete: (lessonId: string) => {
        return get().completedLessons.includes(lessonId);
      },

      getCourseProgress: (courseId: string) => {
        const completedLessons = get().completedLessons;
        const courseLessons = completedLessons.filter((id) => id.startsWith(`${courseId}-`));
        
        // This is a simple implementation - should be enhanced with actual course data
        const completed = courseLessons.length;
        const total = 10; // Placeholder - should come from course metadata
        const percentage = total > 0 ? Math.round((completed / total) * 100) : 0;

        return { completed, total, percentage };
      },

      clearProgress: () => {
        set({ completedLessons: [] });
      },
    }),
    {
      name: 'codemastery-progress',
    }
  )
);
