import fs from 'fs';
import path from 'path';

/**
 * Static mapping from course slug (DB) to content folder name.
 * New courses created via UI will use {courseSlug} as folder name automatically.
 */
const STATIC_FOLDER_MAP: Record<string, string> = {
  'fcc-responsive-web-design': 'fcc-responsive-web-design',
  'fcc-javascript': 'fcc-javascript',
  'fcc-frontend-libraries': 'fcc-frontend-libraries',
  'fcc-python': 'fcc-python',
  'fcc-relational-databases': 'fcc-relational-databases',
  'fcc-backend-apis': 'fcc-backend-apis',
  'lap-trinh-python-co-ban': 'python',
  'html-css-can-ban': 'html-css',
  'javascript-co-ban': 'javascript',
};

/**
 * Get the absolute path to the content directory.
 */
export function getContentDir(): string {
  const candidates = [
    path.join(process.cwd(), 'content'),
    path.join(process.cwd(), '..', '..', 'content'),
    path.join(process.cwd(), '..', 'content'),
  ];

  for (const dir of candidates) {
    if (fs.existsSync(dir)) {
      return dir;
    }
  }

  console.warn('[mdx-reader] Content dir not found. CWD:', process.cwd(), 'Tried:', candidates);
  return candidates[0];
}

/**
 * Resolve folder name for a course slug.
 * 1) Check static map first
 * 2) Check if a folder named {courseSlug} exists in content/
 */
function resolveCourseFolder(courseSlug: string): string | null {
  // Static map
  if (STATIC_FOLDER_MAP[courseSlug]) return STATIC_FOLDER_MAP[courseSlug];

  // Dynamic: check if folder exists
  const contentDir = getContentDir();
  const directFolder = path.join(contentDir, courseSlug);
  if (fs.existsSync(directFolder)) return courseSlug;

  return null;
}

/**
 * Read MDX lesson content from disk.
 */
export function readMdxContent(courseSlug: string, lessonSlug: string): string | null {
  const contentDir = getContentDir();
  const folderName = resolveCourseFolder(courseSlug);

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
  const fmRegex = /^---[\s\S]*?---\s*/;
  const body = raw.replace(fmRegex, '');
  return body.trim();
}

/**
 * Ensure the content directory for a course exists.
 */
export function ensureCourseContentDir(courseSlug: string): string {
  const contentDir = getContentDir();
  const courseDir = path.join(contentDir, courseSlug);
  if (!fs.existsSync(courseDir)) {
    fs.mkdirSync(courseDir, { recursive: true });
  }
  return courseDir;
}

/**
 * Write an MDX file for a lesson.
 */
export function writeMdxFile(
  courseSlug: string,
  lessonSlug: string,
  frontmatter: { title: string; description?: string; difficulty?: string; language?: string },
  markdownBody: string,
): string {
  const courseDir = ensureCourseContentDir(courseSlug);

  // Build frontmatter YAML
  const fmLines = ['---'];
  fmLines.push(`title: "${frontmatter.title.replace(/"/g, '\\"')}"`);
  if (frontmatter.description) fmLines.push(`description: "${frontmatter.description.replace(/"/g, '\\"')}"`);
  if (frontmatter.difficulty) fmLines.push(`difficulty: "${frontmatter.difficulty}"`);
  if (frontmatter.language) fmLines.push(`language: "${frontmatter.language}"`);
  fmLines.push('---');

  const content = fmLines.join('\n') + '\n\n' + markdownBody.trim() + '\n';

  const filePath = path.join(courseDir, `${lessonSlug}.mdx`);
  fs.writeFileSync(filePath, content, 'utf-8');

  return filePath;
}

