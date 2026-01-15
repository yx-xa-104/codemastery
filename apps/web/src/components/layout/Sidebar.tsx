import Link from 'next/link';

export default function Sidebar() {
  const courses = [
    {
      name: 'Python',
      slug: 'python',
      lessons: [
        { title: 'Introduction', slug: 'introduction' },
        { title: 'Variables', slug: 'variables' },
        { title: 'Loops', slug: 'loops' },
      ],
    },
    {
      name: 'JavaScript',
      slug: 'javascript',
      lessons: [
        { title: 'Getting Started', slug: 'getting-started' },
        { title: 'Functions', slug: 'functions' },
      ],
    },
  ];

  return (
    <div className="flex flex-col h-full">
      {/* Logo/Header */}
      <div className="px-4 py-5 border-b border-gray-200 dark:border-gray-800">
        <Link href="/" className="flex items-center gap-2">
          <div className="text-2xl font-bold text-purple-600">
            CodeMastery
          </div>
        </Link>
      </div>

      {/* Navigation */}
      <nav className="flex-1 overflow-y-auto px-4 py-4 space-y-6">
        {courses.map((course) => (
          <div key={course.slug}>
            <h3 className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-2">
              {course.name}
            </h3>
            <ul className="space-y-1">
              {course.lessons.map((lesson) => (
                <li key={lesson.slug}>
                  <Link
                    href={`/lessons/${course.slug}/${lesson.slug}`}
                    className="block px-3 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-purple-50 dark:hover:bg-purple-900/20 hover:text-purple-600 dark:hover:text-purple-400 rounded-md transition-colors"
                  >
                    {lesson.title}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </nav>

      {/* Footer */}
      <div className="p-4 border-t border-gray-200 dark:border-gray-800">
        <p className="text-xs text-gray-500 dark:text-gray-400">
          © 2026 CodeMastery
        </p>
      </div>
    </div>
  );
}
