'use client';

import { useProgressStore } from '@/store/progressStore';
import { CheckCircle2, Circle } from 'lucide-react';
import { useEffect, useState } from 'react';

interface CompleteButtonProps {
  lessonId: string;
  lessonTitle: string;
}

export default function CompleteButton({ lessonId, lessonTitle }: CompleteButtonProps) {
  const [mounted, setMounted] = useState(false);
  const { isComplete, markComplete, markIncomplete } = useProgressStore();
  const completed = mounted ? isComplete(lessonId) : false;

  useEffect(() => {
    setMounted(true);
  }, []);

  const handleToggle = () => {
    if (completed) {
      markIncomplete(lessonId);
    } else {
      markComplete(lessonId);
    }
  };

  if (!mounted) {
    return null; // Avoid hydration mismatch
  }

  return (
    <button
      onClick={handleToggle}
      className={`flex items-center gap-2 px-6 py-3 rounded-lg font-semibold transition-all ${
        completed
          ? 'bg-green-100 text-green-700 hover:bg-green-200 dark:bg-green-900/20 dark:text-green-400 dark:hover:bg-green-900/30'
          : 'bg-gray-100 text-gray-700 hover:bg-gray-200 dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-gray-700'
      }`}
    >
      {completed ? (
        <>
          <CheckCircle2 className="w-5 h-5" />
          Completed
        </>
      ) : (
        <>
          <Circle className="w-5 h-5" />
          Mark as Complete
        </>
      )}
    </button>
  );
}
