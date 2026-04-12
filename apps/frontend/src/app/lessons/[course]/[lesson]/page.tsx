import { notFound, redirect } from "next/navigation";
import { LessonPageClient } from "./lesson-page-client";
import { createClient } from "@/shared/lib/supabase/server";
import { readMdxContent } from "@/shared/lib/mdx-reader";

interface Props {
    params: Promise<{ course: string; lesson: string }>;
}

export default async function LessonPage({ params }: Props) {
    const { course: courseSlug, lesson: lessonSlugOrId } = await params;

    // Get access token from Supabase server session
    const supabase = await createClient();
    const { data: { session } } = await supabase.auth.getSession();
    const authHeaders: Record<string, string> = session?.access_token
        ? { Authorization: `Bearer ${session.access_token}` }
        : {};

    const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001";

    // Fetch course
    const resCourse = await fetch(`${API_URL}/api/courses/${courseSlug}`, { next: { revalidate: 60 } });
    const course = resCourse.ok ? await resCourse.json() : null;
    if (!course) notFound();

    // Fetch modules
    const resModules = await fetch(`${API_URL}/api/courses/${courseSlug}/modules`, { next: { revalidate: 60 } });
    const modules = resModules.ok ? await resModules.json() : [];

    // Fetch lesson
    const resLesson = await fetch(`${API_URL}/api/lessons/${courseSlug}/${lessonSlugOrId}`, { next: { revalidate: 60 } });
    const lesson = resLesson.ok ? await resLesson.json() : null;
    if (!lesson) notFound();

    // Fetch enrollment check
    let enrollmentId: string | undefined;
    try {
        const resStatus = await fetch(`${API_URL}/api/enrollments/courses/${course.id}/status`, {
            headers: authHeaders,
            cache: 'no-store'
        });
        if (resStatus.ok) {
            const statusData = await resStatus.json();
            enrollmentId = statusData?.enrollmentId;
        }
    } catch { /* auth failed or no session */ }

    // Redirect to course page if user is not enrolled and lesson is not free preview
    if (!enrollmentId && !lesson.is_free_preview) {
        redirect(`/courses/${courseSlug}`);
    }

    // Check if lesson is initially completed
    let isInitiallyCompleted = false;
    try {
        const resProgress = await fetch(`${API_URL}/api/enrollments/lessons/${lesson.id}/progress`, {
            headers: authHeaders,
            cache: 'no-store'
        });
        if (resProgress.ok) {
            const text = await resProgress.text();
            if (text) {
                const progressData = JSON.parse(text);
                isInitiallyCompleted = progressData?.status === 'completed';
            }
        }
    } catch { /* auth failed or no session */ }

    // Fetch completed lesson IDs for this course
    let completedLessonIds: string[] = [];
    if (enrollmentId) {
        try {
            const resCompleted = await fetch(`${API_URL}/api/enrollments/courses/${course.id}/completed-lessons`, {
                headers: authHeaders,
                cache: 'no-store'
            });
            if (resCompleted.ok) {
                completedLessonIds = await resCompleted.json();
            }
        } catch { /* failed to fetch completed lessons */ }
    }

    // Map modules to the format Sidebar expects
    const sidebarModules = (modules ?? []).map((mod: any) => ({
        id: mod.id,
        title: mod.title,
        lessons: (mod.lessons as unknown as Array<{
            id: string; title: string; slug: string;
            lesson_type: string; duration_minutes: number | null;
            is_free_preview: boolean;
        }>).map(l => ({
            id: l.id,
            title: l.title,
            slug: l.slug,
            duration: l.duration_minutes ? `${l.duration_minutes}:00` : '—',
            isCompleted: completedLessonIds.includes(l.id),
            type: (l.lesson_type === 'video' ? 'video' : 'interactive') as 'video' | 'interactive',
            isLocked: !enrollmentId && !l.is_free_preview,
        })),
    }));

    // Try to load content from MDX file first, fallback to DB content_html
    const mdxContent = readMdxContent(courseSlug, lesson.slug);
    const lessonContent = mdxContent ?? lesson.content_html ?? lesson.content ?? null;

    // Fetch quiz questions directly from Supabase (avoids API route conflict)
    let quizQuestions: any[] = [];
    try {
        const { data: quizData } = await supabase
            .from('quiz_questions')
            .select('*, quiz_options(*)')
            .eq('lesson_id', lesson.id)
            .order('sort_order')
            .order('sort_order', { referencedTable: 'quiz_options' });
        quizQuestions = quizData ?? [];
    } catch { /* no quiz */ }

    return (
        <LessonPageClient
            course={{ id: course.id, title: course.title, slug: course.slug }}
            lesson={{
                id: lesson.id,
                title: lesson.title,
                content: lessonContent,
                lessonType: lesson.lesson_type,
                exerciseConfig: lesson.exercise_config ?? (lesson.programming_language ? {
                    language: lesson.programming_language,
                    starterCode: lesson.starter_code ?? null,
                } : null),
            }}
            modules={sidebarModules}
            userId={undefined}
            enrollmentId={enrollmentId}
            isInitiallyCompleted={isInitiallyCompleted}
            quizQuestions={quizQuestions}
        />
    );
}
