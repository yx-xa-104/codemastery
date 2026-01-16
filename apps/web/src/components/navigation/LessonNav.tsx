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
    <nav className="flex items-center justify-between pt-8 border-t border-indigo-700/30">
      {/* Previous Lesson */}
      <div className="flex-1">
        {previousLesson ? (
          <Link
            href={previousLesson.href}
            className="group flex items-center gap-2 px-6 py-3 bg-midnight-800 hover:bg-midnight-700 border border-indigo-700/40 hover:border-indigo-600/60 text-gray-200 font-semibold rounded-lg transition-all duration-300"
          >
            <ChevronLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
            <div className="text-left">
              <div className="text-xs text-gray-500 uppercase tracking-wide">
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
            className="group flex items-center gap-2 px-6 py-3 btn-primary"
          >
            <div className="text-right">
              <div className="text-xs text-amber-900 uppercase tracking-wide">
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
