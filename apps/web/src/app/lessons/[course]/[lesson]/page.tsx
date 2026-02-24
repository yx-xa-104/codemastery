import MainLayout from '@/components/layout/MainLayout';
import Sidebar from '@/components/layout/Sidebar';
import LessonContent from '@/components/lesson/LessonContent';
import CodeEditor from '@/components/editor/CodeEditor';
import LessonNav from '@/components/navigation/LessonNav';
import CompleteButton from '@/components/lesson/CompleteButton';
import AiChat from '@/components/ai/AiChat';
import { getLessonContent } from '@/lib/mdx';
import { getAdjacentLessons, getCourseName, getLesson } from '@/lib/courses';
import Link from 'next/link';

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
        aiPanel={<AiChat lessonTitle="Not Found" />}
      >
        <div className="text-center py-16">
          <h1 className="text-3xl font-bold text-white mb-4">Bài học không tồn tại</h1>
          <p className="text-slate-400">
            Bài &quot;{params.lesson}&quot; không có trong khóa &quot;{params.course}&quot;.
          </p>
          <Link href="/" className="mt-6 inline-block px-6 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-500 transition-colors">
            Về trang chủ
          </Link>
        </div>
      </MainLayout>
    );
  }

  const { metadata, content } = lessonData;
  const courseName = getCourseName(params.course);
  const { previous, next } = getAdjacentLessons(params.course, params.lesson);

  const language = (metadata.language || params.course) as 'python' | 'javascript' | 'java' | 'cpp';

  return (
    <MainLayout
      sidebar={<Sidebar />}
      aiPanel={<AiChat lessonTitle={metadata.title || params.lesson} />}
    >
      {/* Lesson Content */}
      <LessonContent content={content} metadata={metadata} />

      {/* Try It Yourself */}
      <div className="mt-10">
        <h2 className="text-2xl font-bold text-white flex items-center gap-2 mb-4">
          <span className="material-symbols-outlined text-accent-gold">code</span>
          Thử nghiệm ngay
        </h2>
        <CodeEditor
          language={language}
          initialCode={getInitialCode(language)}
          height="300px"
        />
      </div>

      {/* Complete Button */}
      <div className="mt-8 flex justify-center">
        <CompleteButton
          lessonId={`${params.course}-${params.lesson}`}
          lessonTitle={metadata.title || params.lesson}
        />
      </div>

      {/* Lesson Navigation */}
      <LessonNav previousLesson={previous} nextLesson={next} />
    </MainLayout>
  );
}

function getInitialCode(language: string): string {
  const starterCode: Record<string, string> = {
    python: '# Viết code Python của bạn ở đây\nprint("Hello, World!")',
    javascript: '// Viết code JavaScript của bạn ở đây\nconsole.log("Hello, World!");',
    java: 'public class Main {\n    public static void main(String[] args) {\n        System.out.println("Hello, World!");\n    }\n}',
    cpp: '#include <iostream>\nusing namespace std;\n\nint main() {\n    cout << "Hello, World!" << endl;\n    return 0;\n}',
  };
  return starterCode[language] || '// Viết code của bạn ở đây';
}
