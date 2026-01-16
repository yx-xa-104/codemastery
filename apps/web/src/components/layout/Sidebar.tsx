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
    <div className="h-full overflow-y-auto p-6">
      {/* Logo */}
      <div className="mb-8">
        <Link href="/" className="block group">
          <h1 className="text-3xl font-bold bg-gradient-to-r from-white via-indigo-300 to-indigo-500 bg-clip-text text-transparent">
            CodeMastery
          </h1>
        </Link>
        <p className="text-sm text-gray-400 mt-2">
          Master Programming
        </p>
      </div>

      <nav className="space-y-2">
        {/* All Courses Link */}
        <Link
          href="/courses"
          className="block px-4 py-3 text-sm font-medium text-gray-300 hover:text-amber-500 hover:bg-indigo-900/40 rounded-lg transition-all duration-300 border border-transparent hover:border-amber-600/30 hover:shadow-glow-amber"
        >
          📚 All Courses
        </Link>

        {/* Course Sections */}
        <div className="pt-6">
          <h2 className="px-4 text-xs font-semibold text-amber-600 uppercase tracking-wider mb-3">
            Learning Paths
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
              <div key={course.id} className="mb-3">
                {/* Course Header */}
                <button
                  onClick={() => toggleCourse(course.id)}
                  className="w-full flex items-center justify-between px-4 py-3 text-sm font-medium text-gray-200 hover:text-amber-400 hover:bg-indigo-900/30 rounded-lg transition-all duration-300 border border-transparent hover:border-amber-600/30 hover:shadow-glow-amber"
                >
                  <div className="flex items-center gap-3">
                    <span className="text-2xl">{course.icon}</span>
                    <div className="text-left">
                      <div>{course.title}</div>
                      {mounted && progress > 0 && (
                        <div className="text-xs text-amber-600 font-semibold mt-0.5">
                          {progress}% Complete
                        </div>
                      )}
                    </div>
                  </div>
                  {isExpanded ? (
                    <ChevronDown className="w-4 h-4 text-amber-600" />
                  ) : (
                    <ChevronRight className="w-4 h-4 text-gray-500" />
                  )}
                </button>

                {/* Lessons List */}
                {isExpanded && (
                  <div className="mt-2 ml-6 space-y-1 border-l-2 border-amber-700/40 pl-4">
                    {course.lessons.map((lesson) => {
                      const href = `/lessons/${course.id}/${lesson.slug}`;
                      const isActive = pathname === href;
                      const completed = mounted && isComplete(`${course.id}-${lesson.slug}`);

                      return (
                        <Link
                          key={lesson.id}
                          href={href}
                          className={`flex items-center gap-3 px-4 py-2.5 text-sm rounded-lg transition-all duration-300 ${
                            isActive
                              ? 'bg-gradient-to-r from-amber-900/40 to-indigo-900/40 text-amber-400 font-semibold border border-amber-600/60 shadow-glow-amber-lg'
                              : 'text-gray-400 hover:text-gray-200 hover:bg-indigo-900/30 border border-transparent hover:border-indigo-600/40'
                          }`}
                        >
                          {completed ? (
                            <CheckCircle2 className="w-4 h-4 text-amber-600 flex-shrink-0" />
                          ) : (
                            <Circle className="w-4 h-4 text-gray-600 flex-shrink-0" />
                          )}
                          <span className="truncate flex-1">{lesson.title}</span>
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
