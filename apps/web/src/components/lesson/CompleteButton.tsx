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
      className={`flex items-center gap-2 px-6 py-3 rounded-lg font-semibold transition-all duration-300 ${
        completed
          ? 'bg-indigo-900/40 text-amber-400 border-2 border-amber-600/60 shadow-glow-amber hover:bg-indigo-900/60'
          : 'btn-primary'
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
