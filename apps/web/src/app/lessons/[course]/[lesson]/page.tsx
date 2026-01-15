import MainLayout from '@/components/layout/MainLayout';
import Sidebar from '@/components/layout/Sidebar';

export default function LessonPage({
  params,
}: {
  params: { course: string; lesson: string };
}) {
  return (
    <MainLayout
      sidebar={<Sidebar />}
      aiPanel={
        <div className="flex items-center justify-center h-full p-8 text-center">
          <div>
            <div className="text-6xl mb-4">🤖</div>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
              AI Tutor
            </h3>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Coming soon! Ask me anything about this lesson.
            </p>
          </div>
        </div>
      }
    >
      <article className="prose dark:prose-invert max-w-none">
        <h1>
          {params.lesson
            .split('-')
            .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
            .join(' ')}
        </h1>

        <p className="lead">
          Welcome to the {params.course} {params.lesson} lesson! This is a
          placeholder page. Real lessons will be loaded from MDX files.
        </p>

        <h2>What you'll learn</h2>
        <ul>
          <li>Basic concepts</li>
          <li>Practical examples</li>
          <li>Hands-on exercises</li>
        </ul>

        <h2>Try it yourself</h2>
        <div className="not-prose">
          <div className="bg-gray-900 rounded-lg p-4 text-green-400 font-mono text-sm">
            <p># Code editor will be integrated here</p>
            <p>print("Hello, World!")</p>
          </div>
        </div>

        <div className="mt-8 flex gap-4">
          <button className="px-6 py-2 bg-purple-600 hover:bg-purple-700 text-white font-semibold rounded-lg transition-colors">
            Previous Lesson
          </button>
          <button className="px-6 py-2 bg-purple-600 hover:bg-purple-700 text-white font-semibold rounded-lg transition-colors">
            Next Lesson
          </button>
        </div>
      </article>
    </MainLayout>
  );
}
