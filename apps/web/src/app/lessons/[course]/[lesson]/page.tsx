import MainLayout from '@/components/layout/MainLayout';
import Sidebar from '@/components/layout/Sidebar';
import LessonContent from '@/components/lesson/LessonContent';
import CodeEditor from '@/components/editor/CodeEditor';
import { getLessonContent } from '@/lib/mdx';

export default async function LessonPage({
  params,
}: {
  params: { course: string; lesson: string };
}) {
  const lessonData = await getLessonContent(params.course, params.lesson);

  if (!lessonData) {
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
        <div className="text-center py-16">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
            Lesson Not Found
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            The lesson "{params.lesson}" does not exist in the "{params.course}" course.
          </p>
        </div>
      </MainLayout>
    );
  }

  const { metadata, content } = lessonData;

  // Determine language from course name or metadata
  const language = (metadata.language || params.course) as 'python' | 'javascript' | 'java' | 'cpp';

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
              Ask me anything about: {metadata.title || params.lesson}
            </p>
          </div>
        </div>
      }
    >
      <LessonContent content={content} metadata={metadata} />

      {/* Interactive Code Editor Section */}
      <div className="mt-8">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
          Try It Yourself
        </h2>
        <CodeEditor
          language={language}
          initialCode={getInitialCode(language)}
          height="300px"
        />
      </div>

      {/* Navigation Buttons */}
      <div className="mt-12 flex items-center justify-between pt-8 border-t border-gray-200 dark:border-gray-800">
        <button className="px-6 py-3 bg-gray-200 hover:bg-gray-300 dark:bg-gray-800 dark:hover:bg-gray-700 text-gray-900 dark:text-white font-semibold rounded-lg transition-colors">
          ← Previous Lesson
        </button>
        <button className="px-6 py-3 bg-purple-600 hover:bg-purple-700 text-white font-semibold rounded-lg transition-colors">
          Next Lesson →
        </button>
      </div>
    </MainLayout>
  );
}

// Helper function to provide default starter code
function getInitialCode(language: string): string {
  const starterCode: Record<string, string> = {
    python: '# Write your Python code here\nprint("Hello, World!")',
    javascript: '// Write your JavaScript code here\nconsole.log("Hello, World!");',
    java: 'public class Main {\n    public static void main(String[] args) {\n        System.out.println("Hello, World!");\n    }\n}',
    cpp: '#include <iostream>\nusing namespace std;\n\nint main() {\n    cout << "Hello, World!" << endl;\n    return 0;\n}',
  };

  return starterCode[language] || '// Write your code here';
}
