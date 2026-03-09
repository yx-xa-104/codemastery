"use client";

import Link from "next/link";
import { useState, useEffect, useRef, useCallback } from "react";
import {
  ArrowLeft, Plus, Save, Globe, ChevronDown, ChevronRight, Grip,
  PlayCircle, BookOpen, Code, CheckCircle, Trash2, FileText,
  AlertCircle, Bold, Italic, Heading1, Heading2, List, ListOrdered,
  Code2, Eye, Edit3, Settings, Loader2
} from "lucide-react";
import { Button } from "@/shared/components/ui/button";
import { createClient } from "@/shared/lib/supabase/client";
import { useRouter } from "next/navigation";
import ReactMarkdown from "react-markdown";

// ─── Types ──────────────────────────────────────────────────────────

interface QuizOption { text: string; isCorrect: boolean }
interface QuizQuestion { id: string; question: string; options: QuizOption[] }

interface LessonData {
  id: string;
  title: string;
  type: 'article' | 'code_exercise' | 'quiz';
  content: string;           // markdown content
  starterCode: string;
  solutionCode: string;
  programmingLanguage: string;
  quizQuestions: QuizQuestion[];
}

interface ModuleData {
  id: string;
  title: string;
  expanded: boolean;
  lessons: LessonData[];
}

interface Category { id: string; name: string; slug: string }

// ─── Constants ──────────────────────────────────────────────────────

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001";
const LANGUAGES = [
  'Python', 'JavaScript', 'TypeScript', 'C', 'C++', 'C#', 'Java',
  'PHP', 'HTML', 'CSS', 'Pascal', 'SQL (SQLite)', 'PostgreSQL', 'MySQL', 'SQL Server'
];

// ─── Helpers ────────────────────────────────────────────────────────

function newLesson(): LessonData {
  return {
    id: `l${Date.now()}`,
    title: 'Bài học mới',
    type: 'article',
    content: '',
    starterCode: '',
    solutionCode: '',
    programmingLanguage: 'Python',
    quizQuestions: [],
  };
}

function newQuestion(): QuizQuestion {
  return {
    id: `q${Date.now()}`,
    question: '',
    options: [
      { text: '', isCorrect: true },
      { text: '', isCorrect: false },
    ],
  };
}

// ─── Markdown Toolbar ───────────────────────────────────────────────

function MdToolbar({ textareaRef, onUpdate }: { textareaRef: React.RefObject<HTMLTextAreaElement | null>; onUpdate: (v: string) => void }) {
  const insert = (before: string, after = '') => {
    const ta = textareaRef.current;
    if (!ta) return;
    const start = ta.selectionStart;
    const end = ta.selectionEnd;
    const selected = ta.value.substring(start, end);
    const replacement = before + (selected || 'text') + after;
    const newVal = ta.value.substring(0, start) + replacement + ta.value.substring(end);
    onUpdate(newVal);
    setTimeout(() => {
      ta.focus();
      ta.setSelectionRange(start + before.length, start + before.length + (selected || 'text').length);
    }, 0);
  };

  const btns: [React.ReactNode, string, string, string][] = [
    [<Bold className="w-3.5 h-3.5" />, '**', '**', 'Bold'],
    [<Italic className="w-3.5 h-3.5" />, '*', '*', 'Italic'],
    [<Heading1 className="w-3.5 h-3.5" />, '# ', '', 'Heading 1'],
    [<Heading2 className="w-3.5 h-3.5" />, '## ', '', 'Heading 2'],
    [<List className="w-3.5 h-3.5" />, '- ', '', 'List'],
    [<ListOrdered className="w-3.5 h-3.5" />, '1. ', '', 'Ordered'],
    [<Code2 className="w-3.5 h-3.5" />, '```\n', '\n```', 'Code'],
  ];

  return (
    <div className="flex gap-0.5 p-1.5 border-b border-slate-800 bg-[#0d1526]">
      {btns.map(([icon, b, a, title], i) => (
        <button key={i} onClick={() => insert(b, a)} title={title}
          className="p-1.5 rounded text-slate-400 hover:text-white hover:bg-white/10 transition-colors">
          {icon}
        </button>
      ))}
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════
// MAIN COMPONENT
// ═══════════════════════════════════════════════════════════════════

export default function CourseCreatePage() {
  const router = useRouter();

  // ── Course state ──────────────────────────────────────────────
  const [courseTitle, setCourseTitle] = useState('');
  const [description, setDescription] = useState('');
  const [level, setLevel] = useState('beginner');
  const [categoryId, setCategoryId] = useState('');
  const [categories, setCategories] = useState<Category[]>([]);

  // ── UI state ──────────────────────────────────────────────────
  const [saving, setSaving] = useState(false);
  const [publishing, setPublishing] = useState(false);
  const [savedCourseId, setSavedCourseId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [showCourseSettings, setShowCourseSettings] = useState(false);
  const [previewMode, setPreviewMode] = useState(false);

  // ── Selected lesson ───────────────────────────────────────────
  const [selectedModuleIdx, setSelectedModuleIdx] = useState(0);
  const [selectedLessonIdx, setSelectedLessonIdx] = useState(-1);
  const [lessonTab, setLessonTab] = useState<'content' | 'code' | 'quiz' | 'settings'>('content');

  // ── Modules & lessons ─────────────────────────────────────────
  const [modules, setModules] = useState<ModuleData[]>([
    { id: 'm1', title: 'Chương 1', expanded: true, lessons: [newLesson()] },
  ]);

  const textareaRef = useRef<HTMLTextAreaElement>(null);

  // ── Auth ──────────────────────────────────────────────────────
  const getToken = async () => {
    const supabase = createClient();
    const { data } = await supabase.auth.getSession();
    return data.session?.access_token ?? '';
  };

  // ── Fetch categories ──────────────────────────────────────────
  useEffect(() => {
    (async () => {
      try {
        const res = await fetch(`${API_URL}/api/courses/categories`);
        if (res.ok) setCategories(await res.json());
      } catch { /* */ }
    })();
  }, []);

  // ── Auto-select first lesson ──────────────────────────────────
  useEffect(() => {
    if (modules[0]?.lessons.length > 0 && selectedLessonIdx === -1) {
      setSelectedLessonIdx(0);
    }
  }, [modules, selectedLessonIdx]);

  // ── Current lesson accessor ───────────────────────────────────
  const currentLesson = modules[selectedModuleIdx]?.lessons[selectedLessonIdx] ?? null;

  const updateCurrentLesson = useCallback((updates: Partial<LessonData>) => {
    setModules(prev => prev.map((m, mi) =>
      mi === selectedModuleIdx
        ? { ...m, lessons: m.lessons.map((l, li) => li === selectedLessonIdx ? { ...l, ...updates } : l) }
        : m
    ));
  }, [selectedModuleIdx, selectedLessonIdx]);

  // ── Module & lesson CRUD ──────────────────────────────────────
  const addModule = () => {
    setModules(prev => [...prev, {
      id: `m${Date.now()}`, title: `Chương ${prev.length + 1}`, expanded: true, lessons: [],
    }]);
  };

  const addLesson = (moduleIdx: number) => {
    setModules(prev => prev.map((m, i) =>
      i === moduleIdx ? { ...m, lessons: [...m.lessons, newLesson()] } : m
    ));
  };

  const removeLesson = (moduleIdx: number, lessonIdx: number) => {
    setModules(prev => prev.map((m, i) =>
      i === moduleIdx ? { ...m, lessons: m.lessons.filter((_, li) => li !== lessonIdx) } : m
    ));
    if (selectedModuleIdx === moduleIdx && selectedLessonIdx === lessonIdx) {
      setSelectedLessonIdx(-1);
    }
  };

  const removeModule = (moduleIdx: number) => {
    if (modules.length <= 1) return;
    setModules(prev => prev.filter((_, i) => i !== moduleIdx));
    if (selectedModuleIdx === moduleIdx) {
      setSelectedModuleIdx(0);
      setSelectedLessonIdx(modules[0]?.lessons.length > 0 ? 0 : -1);
    }
  };

  const toggleModule = (idx: number) => {
    setModules(prev => prev.map((m, i) => i === idx ? { ...m, expanded: !m.expanded } : m));
  };

  const selectLesson = (mi: number, li: number) => {
    setSelectedModuleIdx(mi);
    setSelectedLessonIdx(li);
    setLessonTab('content');
    setPreviewMode(false);
    setShowCourseSettings(false);
  };

  // ── Quiz CRUD ─────────────────────────────────────────────────
  const addQuizQuestion = () => updateCurrentLesson({
    quizQuestions: [...(currentLesson?.quizQuestions ?? []), newQuestion()],
  });

  const removeQuizQuestion = (qId: string) => updateCurrentLesson({
    quizQuestions: currentLesson?.quizQuestions.filter(q => q.id !== qId) ?? [],
  });

  const updateQuizQuestion = (qId: string, text: string) => updateCurrentLesson({
    quizQuestions: currentLesson?.quizQuestions.map(q => q.id === qId ? { ...q, question: text } : q) ?? [],
  });

  const updateQuizOption = (qId: string, oi: number, text: string) => updateCurrentLesson({
    quizQuestions: currentLesson?.quizQuestions.map(q =>
      q.id === qId ? { ...q, options: q.options.map((o, i) => i === oi ? { ...o, text } : o) } : q
    ) ?? [],
  });

  const setCorrectOption = (qId: string, oi: number) => updateCurrentLesson({
    quizQuestions: currentLesson?.quizQuestions.map(q =>
      q.id === qId ? { ...q, options: q.options.map((o, i) => ({ ...o, isCorrect: i === oi })) } : q
    ) ?? [],
  });

  const addQuizOption = (qId: string) => updateCurrentLesson({
    quizQuestions: currentLesson?.quizQuestions.map(q =>
      q.id === qId ? { ...q, options: [...q.options, { text: '', isCorrect: false }] } : q
    ) ?? [],
  });

  // ── SAVE ──────────────────────────────────────────────────────
  const handleSave = async () => {
    if (!courseTitle.trim()) { setError('Nhập tiêu đề khóa học'); return; }
    setSaving(true); setError(null); setSuccess(null);

    try {
      const token = await getToken();
      const headers = { 'Authorization': `Bearer ${token}`, 'Content-Type': 'application/json' };

      const coursePayload: Record<string, any> = { title: courseTitle };
      if (description.trim()) coursePayload.description = description;
      if (level) coursePayload.level = level;
      if (categoryId && categoryId.length > 0 && categoryId !== '') coursePayload.category_id = categoryId;

      let courseId = savedCourseId;
      let courseSlug = '';

      if (courseId) {
        const res = await fetch(`${API_URL}/api/courses/${courseId}`, { method: 'PATCH', headers, body: JSON.stringify(coursePayload) });
        if (!res.ok) { const e = await res.json().catch(() => ({})); throw new Error(e.message || `Lỗi ${res.status}`); }
        const c = await res.json();
        courseSlug = c.slug;
        setSuccess('Đã cập nhật!');
      } else {
        const res = await fetch(`${API_URL}/api/courses`, { method: 'POST', headers, body: JSON.stringify(coursePayload) });
        if (!res.ok) { const e = await res.json().catch(() => ({})); throw new Error(e.message || `Lỗi ${res.status}`); }
        const course = await res.json();
        courseId = course.id;
        courseSlug = course.slug;
        setSavedCourseId(courseId);

        // Create modules → lessons → quiz
        const allLessonsForMdx: any[] = [];

        for (let mi = 0; mi < modules.length; mi++) {
          const mod = modules[mi];
          const modRes = await fetch(`${API_URL}/api/courses/${courseId}/modules`, {
            method: 'POST', headers,
            body: JSON.stringify({ title: mod.title, sort_order: mi }),
          });
          if (!modRes.ok) continue;
          const savedMod = await modRes.json();

          for (let li = 0; li < mod.lessons.length; li++) {
            const lesson = mod.lessons[li];
            const lessonBody: Record<string, any> = {
              title: lesson.title,
              lesson_type: lesson.type,
              sort_order: li,
            };
            if (lesson.content.trim()) lessonBody.content_html = lesson.content;
            if (lesson.starterCode.trim()) lessonBody.starter_code = lesson.starterCode;
            if (lesson.solutionCode.trim()) lessonBody.solution_code = lesson.solutionCode;
            if (lesson.programmingLanguage) lessonBody.programming_language = lesson.programmingLanguage;

            const lessonRes = await fetch(`${API_URL}/api/modules/${savedMod.id}/lessons`, {
              method: 'POST', headers, body: JSON.stringify(lessonBody),
            });
            if (!lessonRes.ok) continue;
            const savedLesson = await lessonRes.json();

            // Save quiz questions
            for (let qi = 0; qi < lesson.quizQuestions.length; qi++) {
              const q = lesson.quizQuestions[qi];
              if (!q.question.trim()) continue;
              await fetch(`${API_URL}/api/lessons/${savedLesson.id}/quiz`, {
                method: 'POST', headers,
                body: JSON.stringify({
                  question_text: q.question,
                  sort_order: qi,
                  options: q.options.filter(o => o.text.trim()).map((o, oi) => ({
                    option_text: o.text,
                    is_correct: o.isCorrect,
                    sort_order: oi,
                  })),
                }),
              });
            }

            // Collect for MDX
            allLessonsForMdx.push({
              slug: savedLesson.slug || lesson.title.toLowerCase().replace(/[^a-z0-9\s]+/g, '').replace(/\s+/g, '-'),
              title: lesson.title,
              content: lesson.content || `# ${lesson.title}\n\nNội dung sẽ được cập nhật...`,
              difficulty: level || 'beginner',
              language: lesson.programmingLanguage?.toLowerCase() || 'python',
            });
          }
        }

        // Generate MDX files
        if (allLessonsForMdx.length > 0 && courseSlug) {
          await fetch('/api/generate-mdx', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ courseSlug, lessons: allLessonsForMdx }),
          });
        }

        setSuccess('Tạo khóa học thành công!');
      }
    } catch (err: any) {
      setError(err.message || 'Lỗi khi lưu');
    }
    setSaving(false);
  };

  const handlePublish = async () => {
    if (!savedCourseId) await handleSave();
    const id = savedCourseId;
    if (!id) return;
    setPublishing(true); setError(null);
    try {
      const token = await getToken();
      const res = await fetch(`${API_URL}/api/courses/${id}`, {
        method: 'PATCH',
        headers: { 'Authorization': `Bearer ${token}`, 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: 'published' }),
      });
      if (!res.ok) throw new Error('Không thể xuất bản');
      setSuccess('Đã xuất bản!');
      setTimeout(() => router.push('/teacher/courses'), 1500);
    } catch (err: any) { setError(err.message); }
    setPublishing(false);
  };

  // ═══════════════════════════════════════════════════════════════
  // RENDER
  // ═══════════════════════════════════════════════════════════════

  return (
    <div className="flex flex-col h-screen bg-[#010816] text-slate-100 overflow-hidden font-sans">
      {/* ── Top Nav ─────────────────────────────────────────────── */}
      <nav className="bg-[#0B1120] border-b border-slate-800 h-14 flex items-center justify-between px-4 z-20 shrink-0">
        <div className="flex items-center gap-3">
          <Link href="/teacher/courses" className="p-2 text-slate-400 hover:text-white rounded-full hover:bg-white/5 transition-colors">
            <ArrowLeft className="w-4 h-4" />
          </Link>
          <div className="w-px h-6 bg-slate-700" />
          <input
            value={courseTitle}
            onChange={e => setCourseTitle(e.target.value)}
            className="text-sm font-bold text-white bg-transparent border-none focus:outline-none max-w-[280px] placeholder-slate-500"
            placeholder="Tiêu đề khóa học..."
          />
        </div>
        <div className="flex items-center gap-2">
          {error && <span className="text-xs text-red-400 flex items-center gap-1 max-w-[200px] truncate"><AlertCircle className="w-3.5 h-3.5 shrink-0" /> {error}</span>}
          {success && <span className="text-xs text-green-400 flex items-center gap-1"><CheckCircle className="w-3.5 h-3.5" /> {success}</span>}
          <Button onClick={handleSave} disabled={saving} variant="ghost"
            className="px-3 py-1.5 text-xs text-slate-300 hover:text-white border border-slate-700 rounded-lg">
            {saving ? <><Loader2 className="w-3 h-3 animate-spin mr-1" /> Đang lưu...</> : <><Save className="w-3 h-3 mr-1" /> Lưu nháp</>}
          </Button>
          <Button onClick={handlePublish} disabled={publishing || saving}
            className="px-3 py-1.5 text-xs font-bold text-white bg-amber-500 hover:bg-amber-400 rounded-lg disabled:opacity-50">
            <Globe className="w-3 h-3 mr-1" /> {publishing ? 'Đang xuất bản...' : 'Xuất bản'}
          </Button>
        </div>
      </nav>

      <div className="flex flex-1 overflow-hidden">
        {/* ── Left Sidebar: Course Structure ─────────────────────── */}
        <aside className="w-64 bg-[#0B1120] border-r border-slate-800 flex flex-col shrink-0 overflow-hidden">
          <div className="p-3 border-b border-slate-800">
            <div className="flex items-center justify-between mb-2">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Cấu trúc khóa học</span>
              <button onClick={addModule} className="p-1 rounded text-slate-400 hover:text-amber-400 hover:bg-amber-500/10 transition-colors" title="Thêm chương">
                <Plus className="w-3.5 h-3.5" />
              </button>
            </div>
            <button
              onClick={() => { setShowCourseSettings(true); setSelectedLessonIdx(-1); }}
              className={`w-full text-left px-2.5 py-1.5 rounded-md text-xs transition-colors ${showCourseSettings && selectedLessonIdx === -1 ? 'bg-indigo-500/15 text-indigo-300 border border-indigo-500/30' : 'text-slate-400 hover:bg-white/5 hover:text-white border border-transparent'}`}>
              <Settings className="w-3 h-3 inline mr-1.5" />Cài đặt khóa học
            </button>
          </div>

          <div className="flex-1 overflow-y-auto py-2 px-2 space-y-1">
            {modules.map((mod, mi) => (
              <div key={mod.id}>
                <div className="flex items-center group">
                  <button onClick={() => toggleModule(mi)}
                    className="flex-1 flex items-center gap-1.5 px-2 py-1.5 text-xs font-semibold text-slate-300 hover:text-white rounded-md hover:bg-white/5 transition-colors text-left">
                    {mod.expanded ? <ChevronDown className="w-3 h-3 text-slate-500" /> : <ChevronRight className="w-3 h-3 text-slate-500" />}
                    <input value={mod.title} onClick={e => e.stopPropagation()}
                      onChange={e => setModules(prev => prev.map((m, i) => i === mi ? { ...m, title: e.target.value } : m))}
                      className="bg-transparent border-none text-xs font-semibold text-slate-300 focus:outline-none focus:text-white flex-1 min-w-0" />
                  </button>
                  <button onClick={() => removeModule(mi)}
                    className="p-1 rounded text-slate-500 hover:text-red-400 opacity-0 group-hover:opacity-100 transition-all" title="Xóa chương">
                    <Trash2 className="w-3 h-3" />
                  </button>
                </div>

                {mod.expanded && (
                  <div className="ml-3 pl-2 border-l border-slate-800 space-y-0.5 mt-0.5">
                    {mod.lessons.map((lesson, li) => (
                      <div key={lesson.id} className="flex items-center group">
                        <button
                          onClick={() => selectLesson(mi, li)}
                          className={`flex-1 flex items-center gap-1.5 px-2 py-1 text-[11px] rounded-md transition-colors text-left truncate ${mi === selectedModuleIdx && li === selectedLessonIdx && !showCourseSettings
                            ? 'bg-indigo-500/15 text-indigo-300 border border-indigo-500/30'
                            : 'text-slate-400 hover:bg-white/5 hover:text-white border border-transparent'
                            }`}>
                          {lesson.type === 'code_exercise' ? <Code className="w-3 h-3 text-amber-400 shrink-0" />
                            : lesson.type === 'quiz' ? <CheckCircle className="w-3 h-3 text-green-400 shrink-0" />
                              : <FileText className="w-3 h-3 text-indigo-400 shrink-0" />}
                          <input value={lesson.title} onClick={e => e.stopPropagation()}
                            onChange={e => setModules(prev => prev.map((m, i) => i === mi ? { ...m, lessons: m.lessons.map((l, j) => j === li ? { ...l, title: e.target.value } : l) } : m))}
                            className="bg-transparent border-none text-[11px] text-inherit focus:outline-none flex-1 min-w-0" />
                        </button>
                        <button onClick={() => removeLesson(mi, li)}
                          className="p-0.5 rounded text-slate-500 hover:text-red-400 opacity-0 group-hover:opacity-100 transition-all">
                          <Trash2 className="w-2.5 h-2.5" />
                        </button>
                      </div>
                    ))}
                    <button onClick={() => addLesson(mi)}
                      className="flex items-center gap-1 px-2 py-1 text-[11px] text-slate-500 hover:text-indigo-400 rounded-md hover:bg-white/5 transition-colors w-full">
                      <Plus className="w-3 h-3" /> Thêm bài học
                    </button>
                  </div>
                )}
              </div>
            ))}
          </div>
        </aside>

        {/* ── Right Panel ────────────────────────────────────────── */}
        <main className="flex-1 overflow-y-auto bg-[#010816]">
          {/* Course Settings Panel */}
          {(showCourseSettings || selectedLessonIdx === -1) && (
            <div className="max-w-2xl mx-auto p-6 space-y-6 mt-4">
              <h2 className="text-lg font-bold text-white">Cài đặt khóa học</h2>
              <div>
                <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-1.5">Tiêu đề</label>
                <input value={courseTitle} onChange={e => setCourseTitle(e.target.value)}
                  className="w-full bg-slate-900 border border-slate-700 rounded-lg text-white text-sm px-3 py-2 focus:border-indigo-500 focus:outline-none" />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-1.5">Mô tả</label>
                <textarea value={description} onChange={e => setDescription(e.target.value)} rows={3}
                  className="w-full bg-slate-900 border border-slate-700 rounded-lg text-white text-sm px-3 py-2 focus:border-indigo-500 focus:outline-none resize-none" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-1.5">Danh mục</label>
                  <select value={categoryId} onChange={e => setCategoryId(e.target.value)}
                    className="w-full bg-slate-900 border border-slate-700 rounded-lg text-white text-sm px-3 py-2 focus:border-indigo-500">
                    <option value="">Chọn danh mục</option>
                    {categories.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-1.5">Cấp độ</label>
                  <select value={level} onChange={e => setLevel(e.target.value)}
                    className="w-full bg-slate-900 border border-slate-700 rounded-lg text-white text-sm px-3 py-2 focus:border-indigo-500">
                    <option value="beginner">Cơ bản</option>
                    <option value="intermediate">Trung cấp</option>
                    <option value="advanced">Nâng cao</option>
                  </select>
                </div>
              </div>
            </div>
          )}

          {/* Lesson Editor */}
          {currentLesson && !showCourseSettings && (
            <div className="flex flex-col h-full">
              {/* Lesson tabs */}
              <div className="border-b border-slate-800 bg-[#0B1120]/50 px-4 flex items-center gap-0.5 shrink-0">
                {([
                  ['content', 'Nội dung', FileText],
                  ['code', 'Bài tập Code', Code],
                  ['quiz', 'Quiz', CheckCircle],
                  ['settings', 'Cài đặt', Settings],
                ] as const).map(([key, label, Icon]) => (
                  <button key={key} onClick={() => setLessonTab(key)}
                    className={`flex items-center gap-1.5 px-3 py-2.5 text-xs font-medium border-b-2 transition-colors ${lessonTab === key
                      ? 'border-amber-500 text-amber-400'
                      : 'border-transparent text-slate-400 hover:text-white'
                      }`}>
                    <Icon className="w-3.5 h-3.5" /> {label}
                  </button>
                ))}
                <div className="flex-1" />
                {lessonTab === 'content' && (
                  <button onClick={() => setPreviewMode(!previewMode)}
                    className={`flex items-center gap-1 px-2 py-1 rounded text-xs transition-colors ${previewMode ? 'text-amber-400 bg-amber-500/10' : 'text-slate-400 hover:text-white'}`}>
                    {previewMode ? <><Edit3 className="w-3 h-3" /> Soạn</> : <><Eye className="w-3 h-3" /> Xem trước</>}
                  </button>
                )}
              </div>

              <div className="flex-1 overflow-y-auto p-4">
                {/* ── Content Tab ──────────────────────────────── */}
                {lessonTab === 'content' && (
                  <div className="max-w-4xl mx-auto bg-[#0B1120] rounded-xl border border-slate-800 overflow-hidden">
                    {previewMode ? (
                      <div className="p-6 prose prose-invert prose-sm max-w-none min-h-[400px]">
                        <ReactMarkdown>{currentLesson.content || '*Chưa có nội dung...*'}</ReactMarkdown>
                      </div>
                    ) : (
                      <>
                        <MdToolbar textareaRef={textareaRef} onUpdate={v => updateCurrentLesson({ content: v })} />
                        <textarea
                          ref={textareaRef}
                          value={currentLesson.content}
                          onChange={e => updateCurrentLesson({ content: e.target.value })}
                          className="w-full min-h-[400px] bg-[#0B1120] text-slate-300 text-sm font-mono px-4 py-3 focus:outline-none resize-y border-0"
                          placeholder="Nhập nội dung bài học bằng Markdown..."
                        />
                      </>
                    )}
                  </div>
                )}

                {/* ── Code Tab ─────────────────────────────────── */}
                {lessonTab === 'code' && (
                  <div className="max-w-4xl mx-auto space-y-4">
                    <div className="flex items-center justify-between">
                      <h3 className="text-sm font-bold text-white">Bài tập Code</h3>
                      <select
                        value={currentLesson.programmingLanguage}
                        onChange={e => updateCurrentLesson({ programmingLanguage: e.target.value })}
                        className="bg-slate-900 border border-slate-700 rounded-lg text-white text-xs px-2 py-1 focus:border-indigo-500">
                        {LANGUAGES.map(l => <option key={l} value={l}>{l}</option>)}
                      </select>
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                      <div className="bg-[#0B1120] rounded-xl border border-slate-800 overflow-hidden">
                        <div className="px-3 py-2 border-b border-slate-800 text-[10px] font-bold text-slate-400 uppercase tracking-wider bg-[#0d1526]">
                          Starter Code
                        </div>
                        <textarea
                          value={currentLesson.starterCode}
                          onChange={e => updateCurrentLesson({ starterCode: e.target.value })}
                          className="w-full min-h-[250px] bg-[#1e1e1e] text-green-300 text-xs font-mono p-3 focus:outline-none resize-y border-0"
                          placeholder="# Code mẫu cho học viên..."
                        />
                      </div>
                      <div className="bg-[#0B1120] rounded-xl border border-slate-800 overflow-hidden">
                        <div className="px-3 py-2 border-b border-slate-800 text-[10px] font-bold text-slate-400 uppercase tracking-wider bg-[#0d1526]">
                          Solution Code
                        </div>
                        <textarea
                          value={currentLesson.solutionCode}
                          onChange={e => updateCurrentLesson({ solutionCode: e.target.value })}
                          className="w-full min-h-[250px] bg-[#1e1e1e] text-amber-300 text-xs font-mono p-3 focus:outline-none resize-y border-0"
                          placeholder="# Đáp án đúng..."
                        />
                      </div>
                    </div>
                  </div>
                )}

                {/* ── Quiz Tab ─────────────────────────────────── */}
                {lessonTab === 'quiz' && (
                  <div className="max-w-3xl mx-auto space-y-4">
                    <div className="flex items-center justify-between">
                      <h3 className="text-sm font-bold text-white">Câu hỏi trắc nghiệm</h3>
                      <Button onClick={addQuizQuestion} variant="outline"
                        className="text-xs bg-indigo-500/10 hover:bg-indigo-500/20 text-indigo-300 border-indigo-500/20 px-3 py-1 rounded-full h-auto">
                        <Plus className="w-3 h-3 mr-1" /> Thêm câu hỏi
                      </Button>
                    </div>

                    {currentLesson.quizQuestions.length === 0 && (
                      <div className="text-center py-12 text-slate-500 text-sm">
                        Chưa có câu hỏi nào. Bấm "Thêm câu hỏi" để bắt đầu.
                      </div>
                    )}

                    {currentLesson.quizQuestions.map((q, qi) => (
                      <div key={q.id} className="bg-[#0B1120] rounded-xl border border-slate-800 p-4 group">
                        <div className="flex justify-between mb-2">
                          <span className="text-[10px] font-bold text-slate-400 bg-slate-800 px-2 py-0.5 rounded">CÂU {qi + 1}</span>
                          <button onClick={() => removeQuizQuestion(q.id)}
                            className="p-1 text-slate-500 hover:text-red-400 opacity-0 group-hover:opacity-100 transition-all">
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                        <input value={q.question} onChange={e => updateQuizQuestion(q.id, e.target.value)}
                          className="w-full bg-slate-900 border border-slate-700 rounded-md text-white text-sm px-3 py-2 mb-3 focus:border-indigo-500 focus:outline-none"
                          placeholder="Nhập câu hỏi..." />

                        <div className="space-y-1.5">
                          {q.options.map((opt, oi) => (
                            <div key={oi} className="flex items-center gap-2">
                              <input type="radio" name={`q-${q.id}`} checked={opt.isCorrect} onChange={() => setCorrectOption(q.id, oi)}
                                className="h-3.5 w-3.5 text-green-500 bg-slate-800 border-slate-600" />
                              <input value={opt.text} onChange={e => updateQuizOption(q.id, oi, e.target.value)}
                                className={`flex-1 bg-transparent border-b text-sm px-1 py-0.5 focus:outline-none ${opt.isCorrect ? 'border-green-500/50 text-green-400' : 'border-slate-700 text-slate-300'}`}
                                placeholder="Nhập đáp án..." />
                            </div>
                          ))}
                          <button onClick={() => addQuizOption(q.id)}
                            className="text-xs text-indigo-400 hover:text-indigo-300 flex items-center gap-1 mt-1 pl-5">
                            <Plus className="w-3 h-3" /> Thêm đáp án
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}

                {/* ── Settings Tab ─────────────────────────────── */}
                {lessonTab === 'settings' && (
                  <div className="max-w-lg mx-auto space-y-4">
                    <h3 className="text-sm font-bold text-white">Cài đặt bài học</h3>
                    <div>
                      <label className="block text-xs font-bold text-slate-400 uppercase mb-1.5">Tiêu đề</label>
                      <input value={currentLesson.title}
                        onChange={e => updateCurrentLesson({ title: e.target.value })}
                        className="w-full bg-slate-900 border border-slate-700 rounded-lg text-white text-sm px-3 py-2 focus:border-indigo-500 focus:outline-none" />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-slate-400 uppercase mb-1.5">Loại bài học</label>
                      <select value={currentLesson.type}
                        onChange={e => updateCurrentLesson({ type: e.target.value as LessonData['type'] })}
                        className="w-full bg-slate-900 border border-slate-700 rounded-lg text-white text-sm px-3 py-2 focus:border-indigo-500">
                        <option value="article">Bài viết</option>
                        <option value="code_exercise">Bài tập code</option>
                        <option value="quiz">Trắc nghiệm</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-slate-400 uppercase mb-1.5">Ngôn ngữ lập trình</label>
                      <select value={currentLesson.programmingLanguage}
                        onChange={e => updateCurrentLesson({ programmingLanguage: e.target.value })}
                        className="w-full bg-slate-900 border border-slate-700 rounded-lg text-white text-sm px-3 py-2 focus:border-indigo-500">
                        {LANGUAGES.map(l => <option key={l} value={l}>{l}</option>)}
                      </select>
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}
