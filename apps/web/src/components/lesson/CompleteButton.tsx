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

  useEffect(() => { setMounted(true); }, []);

  const handleToggle = () => {
    completed ? markIncomplete(lessonId) : markComplete(lessonId);
  };

  if (!mounted) return null;

  return (
    <button
      onClick={handleToggle}
      className={`flex items-center gap-2 px-6 py-3 rounded-lg font-semibold transition-all duration-300 text-sm ${
        completed
          ? 'bg-green-900/30 text-green-400 border border-green-600/50 hover:bg-green-900/50'
          : 'bg-accent-gold hover:bg-accent-gold-hover text-navy-950 shadow-lg shadow-amber-900/20 transform hover:scale-105'
      }`}
    >
      {completed ? (
        <><CheckCircle2 className="w-5 h-5" /> Đã hoàn thành</>
      ) : (
        <><Circle className="w-5 h-5" /> Đánh dấu hoàn thành</>
      )}
    </button>
  );
}

