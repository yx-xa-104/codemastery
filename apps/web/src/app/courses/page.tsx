import Link from 'next/link';
import { coursesData } from '@/lib/courses';
import { BookOpen, Clock, TrendingUp } from 'lucide-react';

export default function CoursesPage() {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-12">
      <div className="container mx-auto px-4 max-w-6xl">
        {/* Header */}
        <div className="mb-12">
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
            Browse Courses
          </h1>
          <p className="text-lg text-gray-600 dark:text-gray-400">
            Choose a course and start your coding journey. All courses include interactive lessons and hands-on exercises.
          </p>
        </div>

        {/* Course Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {coursesData.map((course) => (
            <Link
              key={course.id}
              href={`/lessons/${course.id}/${course.lessons[0].slug}`}
              className="group"
            >
              <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md hover:shadow-xl transition-all overflow-hidden border border-gray-200 dark:border-gray-700">
                {/* Course Icon/Header */}
                <div className="bg-gradient-to-br from-purple-500 to-pink-500 p-6 text-center">
                  <div className="text-6xl mb-2">{course.icon}</div>
                  <h2 className="text-2xl font-bold text-white">
                    {course.title}
                  </h2>
                </div>

                {/* Course Content */}
                <div className="p-6">
                  <p className="text-gray-600 dark:text-gray-400 mb-4">
                    {course.description}
                  </p>

                  {/* Course Stats */}
                  <div className="flex items-center gap-4 text-sm text-gray-500 dark:text-gray-400 mb-4">
                    <div className="flex items-center gap-1">
                      <BookOpen className="w-4 h-4" />
                      <span>{course.lessons.length} lessons</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Clock className="w-4 h-4" />
                      <span>
                        {course.lessons.reduce((acc, l) => acc + (l.estimatedTime || 0), 0)} min
                      </span>
                    </div>
                  </div>

                  {/* Difficulty Badge */}
                  <div className="flex items-center gap-2">
                    <TrendingUp className="w-4 h-4 text-green-500" />
                    <span className="text-sm font-medium text-green-600 dark:text-green-400">
                      Beginner Friendly
                    </span>
                  </div>

                  {/* CTA */}
                  <button className="mt-6 w-full px-4 py-2 bg-purple-600 group-hover:bg-purple-700 text-white font-semibold rounded-lg transition-colors">
                    Start Learning
                  </button>
                </div>
              </div>
            </Link>
          ))}
        </div>

        {/* Coming Soon Section */}
        <div className="mt-12 p-8 bg-white dark:bg-gray-800 rounded-xl border-2 border-dashed border-gray-300 dark:border-gray-700 text-center">
          <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
            More Courses Coming Soon! 🚀
          </h3>
          <p className="text-gray-600 dark:text-gray-400">
            We're working on adding more programming languages and advanced topics.
          </p>
        </div>
      </div>
    </div>
  );
}
