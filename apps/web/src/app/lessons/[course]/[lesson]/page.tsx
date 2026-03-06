import { createClient } from "@/lib/supabase/server";
import { notFound } from "next/navigation";
import { LessonPageClient } from "./lesson-page-client";

interface Props {
    params: { course: string; lesson: string };
}

export default async function LessonPage({ params }: Props) {
    const supabase = await createClient();

    // Get authenticated user (silent fail — page still works for preview)
    const { data: { user } } = await supabase.auth.getUser();

    // Fetch the course and its modules+lessons
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const { data: course } = await (supabase as any)
        .from('courses')
        .select('id, title, slug')
        .eq('slug', params.course)
        .single();

    if (!course) notFound();

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const { data: modules } = await (supabase as any)
        .from('modules')
        .select('id, title, sort_order, lessons(id, title, slug, lesson_type, duration_minutes, sort_order)')
        .eq('course_id', course.id)
        .order('sort_order')
        .order('sort_order', { referencedTable: 'lessons' });

    // Fetch the current lesson — the URL param may be slug or UUID
    const isUUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(params.lesson);
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const lessonQuery = (supabase as any)
        .from('lessons')
        .select('id, title, slug, content, lesson_type, video_url, exercise_config');

    const { data: lesson } = isUUID
        ? await lessonQuery.eq('id', params.lesson).single()
        : await lessonQuery.eq('slug', params.lesson).single();

    if (!lesson) notFound();

    // Fetch enrollment id for progress tracking (if user is logged in)
    let enrollmentId: string | undefined;
    if (user) {
        const { data: enrollment } = await (supabase as any)
            .from('enrollments')
            .select('id')
            .eq('user_id', user.id)
            .eq('course_id', course.id)
            .single();
        enrollmentId = enrollment?.id;
    }

    // Check if lesson is already completed
    let isInitiallyCompleted = false;
    if (user) {
        const { data: progress } = await (supabase as any)
            .from('lesson_progress')
            .select('status')
            .eq('user_id', user.id)
            .eq('lesson_id', lesson.id)
            .single();
        isInitiallyCompleted = progress?.status === 'completed';
    }

    // Map modules to the format Sidebar expects
    const sidebarModules = (modules ?? []).map((mod: any) => ({
        id: mod.id,
        title: mod.title,
        lessons: (mod.lessons as unknown as Array<{
            id: string; title: string; slug: string;
            lesson_type: string; duration_minutes: number | null;
        }>).map(l => ({
            id: l.id,
            title: l.title,
            slug: l.slug,
            duration: l.duration_minutes ? `${l.duration_minutes}:00` : '—',
            isCompleted: false,
            type: (l.lesson_type === 'video' ? 'video' : 'interactive') as 'video' | 'interactive',
        })),
    }));

    return (
        <LessonPageClient
            course={{ title: course.title, slug: course.slug }}
            lesson={{
                id: lesson.id,
                title: lesson.title,
                content: lesson.content,
                lessonType: lesson.lesson_type,
                exerciseConfig: lesson.exercise_config,
            }}
            modules={sidebarModules}
            userId={user?.id}
            enrollmentId={enrollmentId}
            isInitiallyCompleted={isInitiallyCompleted}
        />
    );
}
