'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { ChevronDown, ChevronRight, CheckCircle2, Circle } from 'lucide-react';
import { useState, useEffect } from 'react';
import { coursesData } from '@/lib/courses';
import { useProgressStore } from '@/store/progressStore';

export default function Sidebar() {
  const pathname = usePathname();
  const [expandedCourses, setExpandedCourses] = useState<string[]>(['python']);
  const [mounted, setMounted] = useState(false);
  const { isComplete } = useProgressStore();

  useEffect(() => {
    setMounted(true);
  }, []);

  const toggleCourse = (courseId: string) => {
    setExpandedCourses((prev) =>
      prev.includes(courseId)
        ? prev.filter((id) => id !== courseId)
        : [...prev, courseId]
    );
  };

  return (
    <div className="flex flex-col h-full overflow-hidden">
      {/* Sidebar Header */}
      <div className="p-5 border-b border-navy-700 bg-navy-800/50 flex-shrink-0">
        <h2 className="font-bold text-lg text-white flex items-center gap-2">
          <span className="material-symbols-outlined text-accent-gold">school</span>
          Khóa học
        </h2>
      </div>

      {/* Scrollable nav */}
      <nav className="flex-1 overflow-y-auto p-3 space-y-1">
        {/* All Courses Link */}
        <Link
          href="/courses"
          className="block px-3 py-2.5 text-sm text-slate-400 hover:bg-navy-700 hover:text-white rounded transition-colors"
        >
          📚 Tất cả khóa học
        </Link>

        {/* Course Sections */}
        <div className="pt-4">
          <h2 className="px-3 text-xs font-bold text-indigo-400 uppercase tracking-wider mb-2">
            Lộ trình học
          </h2>

          {coursesData.map((course) => {
            const isExpanded = expandedCourses.includes(course.id);
            const completedCount = mounted
              ? course.lessons.filter((lesson) =>
                  isComplete(`${course.id}-${lesson.slug}`)
                ).length
              : 0;
            const progress = course.lessons.length > 0
              ? Math.round((completedCount / course.lessons.length) * 100)
              : 0;

            return (
              <div key={course.id} className="mb-1">
                {/* Course Header */}
                <button
                  onClick={() => toggleCourse(course.id)}
                  className="w-full flex items-center justify-between px-3 py-2.5 text-sm font-medium text-slate-300 hover:text-white hover:bg-navy-700 rounded transition-colors"
                >
                  <div className="flex items-center gap-2">
                    <span className="text-xl">{course.icon}</span>
                    <div className="text-left">
                      <div>{course.title}</div>
                      {mounted && progress > 0 && (
                        <div className="text-xs text-indigo-400 font-semibold mt-0.5">
                          {progress}% hoàn thành
                        </div>
                      )}
                    </div>
                  </div>
                  {isExpanded ? (
                    <ChevronDown className="w-4 h-4 text-indigo-400 flex-shrink-0" />
                  ) : (
                    <ChevronRight className="w-4 h-4 text-slate-500 flex-shrink-0" />
                  )}
                </button>

                {/* Lessons List */}
                {isExpanded && (
                  <div className="mt-1 ml-4 space-y-0.5 border-l border-indigo-500/30 pl-3">
                    {course.lessons.map((lesson) => {
                      const href = `/lessons/${course.id}/${lesson.slug}`;
                      const isActive = pathname === href;
                      const completed = mounted && isComplete(`${course.id}-${lesson.slug}`);

                      return (
                        <Link
                          key={lesson.id}
                          href={href}
                          className={`flex items-center gap-2 px-3 py-2 text-sm rounded transition-colors ${
                            isActive
                              ? 'bg-indigo-600 text-white font-medium shadow-lg'
                              : 'text-slate-400 hover:bg-navy-700 hover:text-white'
                          }`}
                        >
                          {completed ? (
                            <CheckCircle2 className="w-4 h-4 text-accent-gold flex-shrink-0" />
                          ) : (
                            <Circle className="w-4 h-4 text-slate-600 flex-shrink-0" />
                          )}
                          <span className="truncate">{lesson.title}</span>
                        </Link>
                      );
                    })}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </nav>
    </div>
  );
}

