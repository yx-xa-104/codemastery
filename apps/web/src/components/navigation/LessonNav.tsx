'use client';

import Link from 'next/link';
import { ChevronLeft, ChevronRight } from 'lucide-react';

interface LessonNavProps {
  previousLesson?: {
    title: string;
    href: string;
  };
  nextLesson?: {
    title: string;
    href: string;
  };
}

export default function LessonNav({ previousLesson, nextLesson }: LessonNavProps) {
  return (
    <nav className="flex items-center justify-between pt-8 border-t border-gray-200 dark:border-gray-800">
      {/* Previous Lesson */}
      <div className="flex-1">
        {previousLesson ? (
          <Link
            href={previousLesson.href}
            className="group flex items-center gap-2 px-6 py-3 bg-gray-100 hover:bg-gray-200 dark:bg-gray-800 dark:hover:bg-gray-700 text-gray-900 dark:text-white font-semibold rounded-lg transition-colors"
          >
            <ChevronLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
            <div className="text-left">
              <div className="text-xs text-gray-500 dark:text-gray-400 uppercase tracking-wide">
                Previous
              </div>
              <div className="text-sm">{previousLesson.title}</div>
            </div>
          </Link>
        ) : (
          <div></div>
        )}
      </div>

      {/* Next Lesson */}
      <div className="flex-1 flex justify-end">
        {nextLesson ? (
          <Link
            href={nextLesson.href}
            className="group flex items-center gap-2 px-6 py-3 bg-purple-600 hover:bg-purple-700 text-white font-semibold rounded-lg transition-colors"
          >
            <div className="text-right">
              <div className="text-xs text-purple-200 uppercase tracking-wide">
                Next
              </div>
              <div className="text-sm">{nextLesson.title}</div>
            </div>
            <ChevronRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
          </Link>
        ) : (
          <div></div>
        )}
      </div>
    </nav>
  );
}
