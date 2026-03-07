import { notFound } from "next/navigation";
import { LessonPageClient } from "./lesson-page-client";
import { cookies } from "next/headers";

interface Props {
    params: Promise<{ course: string; lesson: string }>;
}

export default async function LessonPage({ params }: Props) {
    const { course: courseSlug, lesson: lessonSlugOrId } = await params;

    // Server fetch utility with Authorization cookie
    const getAuthHeaders = async () => {
        const cookieStore = await cookies();
        const customSessionData = cookieStore.get('sb-auth-token');
        // Note: For NextJS SSR passing supabase token, we might have to pass session token
        // Wait, supabase stores tokens in cookies like sb-xxxx-auth-token.
        // It's often simpler to forward the cookie header as is
        return { Cookie: cookieStore.toString() };
    };

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

    // Headers with cookies for protected endpoint
    const authHeaders = await getAuthHeaders();

    // Fetch enrollment check
    let enrollmentId: string | undefined;
    const resStatus = await fetch(`${API_URL}/api/enrollments/courses/${course.id}/status`, {
        headers: authHeaders,
        cache: 'no-store'
    });
    if (resStatus.ok) {
        const statusData = await resStatus.json();
        enrollmentId = statusData.enrollmentId;
    }

    // Check if lesson is initially completed
    let isInitiallyCompleted = false;
    const resProgress = await fetch(`${API_URL}/api/enrollments/lessons/${lesson.id}/progress`, {
        headers: authHeaders,
        cache: 'no-store'
    });
    if (resProgress.ok) {
        const progressData = await resProgress.json();
        isInitiallyCompleted = progressData?.status === 'completed';
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
            userId={undefined} // Handled implicitly by API token downstream if needed
            enrollmentId={enrollmentId}
            isInitiallyCompleted={isInitiallyCompleted}
        />
    );
}
