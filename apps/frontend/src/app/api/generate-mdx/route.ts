import { NextRequest, NextResponse } from 'next/server';
import { writeMdxFile } from '@/shared/lib/mdx-reader';

interface LessonPayload {
  slug: string;
  title: string;
  description?: string;
  difficulty?: string;
  language?: string;
  content: string;
}

interface GenerateMdxBody {
  courseSlug: string;
  lessons: LessonPayload[];
}

export async function POST(req: NextRequest) {
  try {
    const body: GenerateMdxBody = await req.json();

    if (!body.courseSlug || !body.lessons?.length) {
      return NextResponse.json(
        { error: 'courseSlug and lessons are required' },
        { status: 400 },
      );
    }

    const results: string[] = [];

    for (const lesson of body.lessons) {
      if (!lesson.slug || !lesson.title) continue;

      const filePath = writeMdxFile(
        body.courseSlug,
        lesson.slug,
        {
          title: lesson.title,
          description: lesson.description,
          difficulty: lesson.difficulty,
          language: lesson.language,
        },
        lesson.content || `# ${lesson.title}\n\nNội dung bài học sẽ được cập nhật...`,
      );

      results.push(filePath);
    }

    return NextResponse.json({
      success: true,
      filesCreated: results.length,
      files: results,
    });
  } catch (err: any) {
    console.error('[generate-mdx] Error:', err);
    return NextResponse.json(
      { error: err.message || 'Internal server error' },
      { status: 500 },
    );
  }
}
