import fs from 'fs';
import path from 'path';

/**
 * Mapping from course slug (DB) to content folder name.
 * This decouples the DB slugs from filesystem folder names.
 */
const COURSE_FOLDER_MAP: Record<string, string> = {
  'fcc-responsive-web-design': 'fcc-responsive-web-design',
  'fcc-javascript': 'fcc-javascript',
  'fcc-frontend-libraries': 'fcc-frontend-libraries',
  'fcc-python': 'fcc-python',
  'fcc-relational-databases': 'fcc-relational-databases',
  'fcc-backend-apis': 'fcc-backend-apis',
  // Existing courses
  'lap-trinh-python-co-ban': 'python',
  'html-css-can-ban': 'html-css',
  'javascript-co-ban': 'javascript',
};

/**
 * Get the absolute path to the content directory.
 * In Next.js, process.cwd() = the app's root directory.
 * Content is at the monorepo root /content/.
 */
function getContentDir(): string {
  const candidates = [
    path.join(process.cwd(), 'content'),             // if CWD = monorepo root
    path.join(process.cwd(), '..', '..', 'content'),  // if CWD = apps/frontend
    path.join(process.cwd(), '..', 'content'),         // if CWD = apps/
  ];

  for (const dir of candidates) {
    if (fs.existsSync(dir)) {
      return dir;
    }
  }

  // Debug: log which paths were tried
  console.warn('[mdx-reader] Content dir not found. CWD:', process.cwd(), 'Tried:', candidates);
  return candidates[0];
}

/**
 * Read MDX lesson content from disk.
 *
 * @param courseSlug - Course slug from DB (e.g. "fcc-responsive-web-design")
 * @param lessonSlug - Lesson slug from DB (e.g. "html-structure")
 * @returns Markdown content string, or null if file not found
 */
export function readMdxContent(courseSlug: string, lessonSlug: string): string | null {
  const contentDir = getContentDir();
  const folderName = COURSE_FOLDER_MAP[courseSlug];

  if (!folderName) return null;

  const courseDir = path.join(contentDir, folderName);
  if (!fs.existsSync(courseDir)) return null;

  // Try exact match first: {lessonSlug}.mdx
  const exactPath = path.join(courseDir, `${lessonSlug}.mdx`);
  if (fs.existsSync(exactPath)) {
    return parseMdxFile(exactPath);
  }

  // Try with number prefix: {NN}-{lessonSlug}.mdx
  try {
    const files = fs.readdirSync(courseDir);
    const match = files.find(f =>
      f.endsWith('.mdx') && f.replace(/^\d+-/, '').replace('.mdx', '') === lessonSlug
    );
    if (match) {
      return parseMdxFile(path.join(courseDir, match));
    }
  } catch {
    return null;
  }

  return null;
}

/**
 * Read MDX file and strip frontmatter, return markdown body.
 */
function parseMdxFile(filePath: string): string {
  const raw = fs.readFileSync(filePath, 'utf-8');

  // Strip frontmatter (--- ... ---)
  const fmRegex = /^---[\s\S]*?---\s*/;
  const body = raw.replace(fmRegex, '');

  return body.trim();
}
