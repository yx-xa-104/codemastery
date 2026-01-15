import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';

const contentDirectory = path.join(process.cwd(), '..', '..', 'content');

export interface LessonMetadata {
  title: string;
  description?: string;
  difficulty?: string;
  language?: string;
}

export interface LessonData {
  metadata: LessonMetadata;
  content: string;
  slug: string;
}

/**
 * Get lesson content from MDX file
 */
export async function getLessonContent(
  course: string,
  lesson: string
): Promise<LessonData | null> {
  try {
    const filePath = path.join(contentDirectory, course, `${lesson}.mdx`);
    
    if (!fs.existsSync(filePath)) {
      console.warn(`Lesson file not found: ${filePath}`);
      return null;
    }

    const fileContent = fs.readFileSync(filePath, 'utf-8');
    const { data, content } = matter(fileContent);

    return {
      metadata: data as LessonMetadata,
      content,
      slug: lesson,
    };
  } catch (error) {
    console.error(`Error loading lesson ${course}/${lesson}:`, error);
    return null;
  }
}

/**
 * Get all lessons for a course
 */
export async function getCourseLessons(course: string): Promise<string[]> {
  try {
    const courseDir = path.join(contentDirectory, course);
    
    if (!fs.existsSync(courseDir)) {
      return [];
    }

    const files = fs.readdirSync(courseDir);
    return files
      .filter((file) => file.endsWith('.mdx'))
      .map((file) => file.replace('.mdx', ''));
  } catch (error) {
    console.error(`Error getting lessons for ${course}:`, error);
    return [];
  }
}

/**
 * Get all available courses
 */
export async function getAllCourses(): Promise<string[]> {
  try {
    if (!fs.existsSync(contentDirectory)) {
      return [];
    }

    const entries = fs.readdirSync(contentDirectory, { withFileTypes: true });
    return entries
      .filter((entry) => entry.isDirectory())
      .map((entry) => entry.name);
  } catch (error) {
    console.error('Error getting courses:', error);
    return [];
  }
}
