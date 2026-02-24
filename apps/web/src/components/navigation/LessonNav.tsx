'use client';

import Link from 'next/link';
import { ChevronLeft, ChevronRight } from 'lucide-react';

interface LessonNavProps {
  previousLesson?: { title: string; href: string };
  nextLesson?: { title: string; href: string };
}

export default function LessonNav({ previousLesson, nextLesson }: LessonNavProps) {
  return (
    <nav className="flex items-center justify-between pt-8 border-t border-navy-700 mt-8">
      <div className="flex-1">
        {previousLesson ? (
          <Link
            href={previousLesson.href}
            className="group inline-flex items-center gap-2 px-5 py-2.5 bg-navy-800 hover:bg-navy-700 border border-navy-600 text-slate-300 hover:text-white font-medium rounded-lg transition-all text-sm"
          >
            <ChevronLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
            <div className="text-left">
              <div className="text-xs text-slate-500 uppercase tracking-wide">Trước</div>
              <div>{previousLesson.title}</div>
            </div>
          </Link>
        ) : <div />}
      </div>

      <div className="flex-1 flex justify-end">
        {nextLesson ? (
          <Link
            href={nextLesson.href}
            className="group inline-flex items-center gap-2 px-5 py-2.5 bg-accent-gold hover:bg-accent-gold-hover text-navy-950 font-bold rounded-lg shadow-lg shadow-amber-900/20 transition-all transform hover:scale-105 text-sm"
          >
            <div className="text-right">
              <div className="text-xs text-amber-900 uppercase tracking-wide">Tiếp theo</div>
              <div>{nextLesson.title}</div>
            </div>
            <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </Link>
        ) : <div />}
      </div>
    </nav>
  );
}

