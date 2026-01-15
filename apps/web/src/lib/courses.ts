// Course and Lesson metadata
export interface CourseMetadata {
  id: string;
  title: string;
  description: string;
  icon: string;
  lessons: LessonMetadata[];
}

export interface LessonMetadata {
  id: string;
  slug: string;
  title: string;
  description?: string;
  order: number;
  estimatedTime?: number;
}

// Course catalog
export const coursesData: CourseMetadata[] = [
  {
    id: 'python',
    title: 'Python',
    description: 'Learn Python programming from basics to advanced',
    icon: '🐍',
    lessons: [
      {
        id: 'python-01',
        slug: '01-introduction',
        title: 'Introduction to Python',
        order: 1,
        estimatedTime: 15,
      },
      {
        id: 'python-02',
        slug: '02-variables',
        title: 'Variables and Data Types',
        order: 2,
        estimatedTime: 20,
      },
      {
        id: 'python-03',
        slug: '03-control-flow',
        title: 'Control Flow',
        order: 3,
        estimatedTime: 25,
      },
      {
        id: 'python-04',
        slug: '04-functions',
        title: 'Functions',
        order: 4,
        estimatedTime: 20,
      },
    ],
  },
  {
    id: 'javascript',
    title: 'JavaScript',
    description: 'Master the language of the web',
    icon: '🌐',
    lessons: [
      {
        id: 'js-01',
        slug: '01-basics',
        title: 'JavaScript Basics',
        order: 1,
        estimatedTime: 20,
      },
    ],
  },
  {
    id: 'html-css',
    title: 'HTML & CSS',
    description: 'Build beautiful web pages',
    icon: '🎨',
    lessons: [
      {
        id: 'html-01',
        slug: '01-html-basics',
        title: 'HTML Fundamentals',
        order: 1,
        estimatedTime: 25,
      },
    ],
  },
];

// Helper functions
export function getCourse(courseId: string): CourseMetadata | undefined {
  return coursesData.find((course) => course.id === courseId);
}

export function getLesson(
  courseId: string,
  lessonSlug: string
): { course: CourseMetadata; lesson: LessonMetadata; index: number } | null {
  const course = getCourse(courseId);
  if (!course) return null;

  const index = course.lessons.findIndex((l) => l.slug === lessonSlug);
  if (index === -1) return null;

  return {
    course,
    lesson: course.lessons[index],
    index,
  };
}

export function getAdjacentLessons(courseId: string, lessonSlug: string) {
  const result = getLesson(courseId, lessonSlug);
  if (!result) return { previous: undefined, next: undefined };

  const { course, index } = result;

  const previous =
    index > 0
      ? {
          title: course.lessons[index - 1].title,
          href: `/lessons/${courseId}/${course.lessons[index - 1].slug}`,
        }
      : undefined;

  const next =
    index < course.lessons.length - 1
      ? {
          title: course.lessons[index + 1].title,
          href: `/lessons/${courseId}/${course.lessons[index + 1].slug}`,
        }
      : undefined;

  return { previous, next };
}

export function getCourseName(courseId: string): string {
  const course = getCourse(courseId);
  return course?.title || courseId;
}
