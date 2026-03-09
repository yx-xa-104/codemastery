"use client";

import { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import {
  ArrowLeft, BookOpen, Send, CheckCircle, XCircle,
  Clock, Trophy, ChevronDown, Zap, Lightbulb, Eye, EyeOff
} from "lucide-react";
import { Button } from "@/shared/components/ui/button";
import { CodeEditor } from "@/features/editor/components/CodeEditor";
import { createClient } from "@/shared/lib/supabase/client";
import ReactMarkdown from "react-markdown";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001";

interface Problem {
  id: string;
  title: string;
  slug: string;
  description: string;
  difficulty: string;
  language: string;
  category: string | null;
  starter_code: string;
  solution_code: string;
  test_cases: { input: string; expectedOutput: string; hidden?: boolean }[];
  hints: string[];
  total_submissions: number;
  total_accepted: number;
}

interface Submission {
  id: string;
  status: string;
  tests_passed: number;
  tests_total: number;
  submitted_at: string;
}

const DIFF_STYLE: Record<string, { label: string; color: string; bg: string }> = {
  easy: { label: "Dễ", color: "text-green-400", bg: "bg-green-500/10 border-green-500/20" },
  medium: { label: "Trung bình", color: "text-amber-400", bg: "bg-amber-500/10 border-amber-500/20" },
  hard: { label: "Khó", color: "text-red-400", bg: "bg-red-500/10 border-red-500/20" },
};

export default function PracticeProblemPage() {
  const params = useParams();
  const router = useRouter();
  const slug = params?.slug as string;

  const [problem, setProblem] = useState<Problem | null>(null);
  const [loading, setLoading] = useState(true);
  const [currentCode, setCurrentCode] = useState("");
  const [testsPassed, setTestsPassed] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [submitResult, setSubmitResult] = useState<{ status: string; isFirstAccept?: boolean; xp?: number } | null>(null);
  const [showHints, setShowHints] = useState(false);
  const [submissions, setSubmissions] = useState<Submission[]>([]);
  const [showSubmissions, setShowSubmissions] = useState(false);
  const [xpToast, setXpToast] = useState<number | null>(null);

  // Load problem
  useEffect(() => {
    if (!slug) return;
    (async () => {
      try {
        const res = await fetch(`${API_URL}/api/practice/${slug}`);
        if (res.ok) {
          const data = await res.json();
          setProblem(data);
          setCurrentCode(data.starter_code || "");
        }
      } catch { /* */ }
      setLoading(false);
    })();
  }, [slug]);

  // Auth helper
  const getToken = async () => {
    const supabase = createClient();
    const { data } = await supabase.auth.getSession();
    return data.session?.access_token ?? "";
  };

  // Handle code change
  const handleCodeChange = useCallback((code: string) => {
    setCurrentCode(code);
  }, []);

  // Handle test results
  const handleTestResults = useCallback((allPassed: boolean) => {
    setTestsPassed(allPassed);
  }, []);

  // Submit solution
  const handleSubmit = async () => {
    if (!problem || !testsPassed) return;
    setSubmitting(true);
    setSubmitResult(null);

    try {
      const token = await getToken();
      const res = await fetch(`${API_URL}/api/practice/${problem.id}/submit-result`, {
        method: "POST",
        headers: { "Authorization": `Bearer ${token}`, "Content-Type": "application/json" },
        body: JSON.stringify({
          code: currentCode,
          language: problem.language,
          tests_passed: problem.test_cases.length,
          tests_total: problem.test_cases.length,
        }),
      });

      if (res.ok) {
        const result = await res.json();
        setSubmitResult(result);

        if (result.isFirstAccept) {
          setXpToast(20);
          setTimeout(() => setXpToast(null), 3000);
        }
      }
    } catch { /* */ }
    setSubmitting(false);
  };

  // Load submissions
  const loadSubmissions = async () => {
    if (!problem) return;
    try {
      const token = await getToken();
      const res = await fetch(`${API_URL}/api/practice/${problem.id}/submissions`, {
        headers: { "Authorization": `Bearer ${token}` },
      });
      if (res.ok) setSubmissions(await res.json());
    } catch { /* */ }
    setShowSubmissions(true);
  };

  if (loading) {
    return (
      <div className="h-screen bg-[#010816] flex items-center justify-center text-slate-500 text-sm">
        Đang tải...
      </div>
    );
  }

  if (!problem) {
    return (
      <div className="h-screen bg-[#010816] flex items-center justify-center text-slate-500 text-sm">
        Bài tập không tồn tại
      </div>
    );
  }

  const dc = DIFF_STYLE[problem.difficulty] || DIFF_STYLE.easy;
  const acceptRate = problem.total_submissions > 0
    ? Math.round((problem.total_accepted / problem.total_submissions) * 100) : 0;

  return (
    <div className="flex flex-col h-screen bg-[#010816] text-white overflow-hidden font-sans">
      {/* XP Toast */}
      {xpToast && (
        <div className="fixed top-20 left-1/2 -translate-x-1/2 z-[100] animate-in fade-in slide-in-from-top-4 duration-300">
          <div className="flex items-center gap-2 px-5 py-3 bg-amber-500/20 border border-amber-500/40 rounded-xl backdrop-blur-md shadow-lg shadow-amber-500/10">
            <Zap className="w-5 h-5 text-amber-400 fill-amber-400" />
            <span className="text-amber-300 font-bold text-sm">+{xpToast} XP</span>
          </div>
        </div>
      )}

      {/* Top bar */}
      <nav className="h-12 bg-[#0B1120] border-b border-slate-800 flex items-center justify-between px-4 shrink-0 z-20">
        <div className="flex items-center gap-3 min-w-0">
          <Link href="/practice"
            className="p-1.5 rounded-full text-slate-400 hover:text-white hover:bg-white/5 transition-colors">
            <ArrowLeft className="w-4 h-4" />
          </Link>
          <div className="w-px h-5 bg-slate-700" />
          <h1 className="text-sm font-bold text-white truncate">{problem.title}</h1>
          <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${dc.bg} ${dc.color} shrink-0`}>
            {dc.label}
          </span>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-[10px] text-slate-500">
            AC: <span className="text-slate-300 font-mono">{acceptRate}%</span>
          </span>
          <Button onClick={handleSubmit} disabled={!testsPassed || submitting}
            className={`px-3 py-1.5 text-xs font-bold rounded-lg flex items-center gap-1.5 ${testsPassed
              ? "bg-green-600 hover:bg-green-500 text-white"
              : "bg-slate-800 text-slate-500 cursor-not-allowed"
              }`}>
            <Send className="w-3 h-3" />
            {submitting ? "Đang nộp..." : "Nộp bài"}
          </Button>
        </div>
      </nav>

      {/* Submit result banner */}
      {submitResult && (
        <div className={`px-4 py-2 text-xs font-medium flex items-center gap-2 ${submitResult.status === "accepted"
          ? "bg-green-500/10 text-green-400 border-b border-green-500/20"
          : "bg-red-500/10 text-red-400 border-b border-red-500/20"
          }`}>
          {submitResult.status === "accepted" ? (
            <><CheckCircle className="w-4 h-4" /> Accepted! {submitResult.isFirstAccept && "🎉 +20 XP"}</>
          ) : (
            <><XCircle className="w-4 h-4" /> Wrong Answer</>
          )}
        </div>
      )}

      {/* Split panel */}
      <div className="flex flex-1 overflow-hidden">
        {/* Left: Problem description */}
        <div className="w-[40%] xl:w-[35%] h-full overflow-y-auto border-r border-slate-800 shrink-0 scrollbar-thin scrollbar-thumb-slate-700 scrollbar-track-transparent">
          <div className="p-5">
            <div className="flex items-center gap-2 mb-4 text-xs font-semibold text-indigo-400 uppercase tracking-wider">
              <BookOpen className="w-4 h-4" />
              Đề bài
            </div>

            {/* Problem description */}
            <div className="prose prose-invert prose-sm max-w-none mb-6">
              <ReactMarkdown>{problem.description}</ReactMarkdown>
            </div>

            {/* Stats */}
            <div className="flex gap-4 mb-4 text-[11px] text-slate-500">
              <span>📝 {problem.total_submissions} lượt nộp</span>
              <span>✅ {problem.total_accepted} accepted</span>
              <span>📊 {acceptRate}% tỉ lệ</span>
            </div>

            {/* Hints */}
            {problem.hints && problem.hints.length > 0 && (
              <div className="mb-4">
                <button onClick={() => setShowHints(!showHints)}
                  className="flex items-center gap-1.5 text-xs text-amber-400 hover:text-amber-300 transition-colors">
                  <Lightbulb className="w-3.5 h-3.5" />
                  {showHints ? "Ẩn gợi ý" : `Xem gợi ý (${problem.hints.length})`}
                  <ChevronDown className={`w-3 h-3 transition-transform ${showHints ? "rotate-180" : ""}`} />
                </button>
                {showHints && (
                  <div className="mt-2 space-y-1 pl-4 border-l-2 border-amber-500/20">
                    {problem.hints.map((h, i) => (
                      <p key={i} className="text-xs text-amber-300/70">💡 {h}</p>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* Submissions history */}
            <button onClick={loadSubmissions}
              className="flex items-center gap-1.5 text-xs text-slate-400 hover:text-white transition-colors">
              <Clock className="w-3.5 h-3.5" />
              {showSubmissions ? "Ẩn lịch sử" : "Lịch sử nộp bài"}
            </button>
            {showSubmissions && submissions.length > 0 && (
              <div className="mt-2 space-y-1">
                {submissions.slice(0, 10).map(s => (
                  <div key={s.id} className="flex items-center justify-between text-[11px] px-2 py-1 bg-slate-900/50 rounded">
                    <span className={s.status === "accepted" ? "text-green-400" : "text-red-400"}>
                      {s.status === "accepted" ? "✅ Accepted" : "❌ Wrong Answer"}
                    </span>
                    <span className="text-slate-500">{s.tests_passed}/{s.tests_total}</span>
                    <span className="text-slate-600">{new Date(s.submitted_at).toLocaleDateString("vi-VN")}</span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Right: Code editor */}
        <div className="flex-1 min-w-0 p-3">
          <CodeEditor
            initialCode={problem.starter_code || `// ${problem.title}\n`}
            language={problem.language}
            onChange={handleCodeChange}
            testCases={problem.test_cases.map(tc => ({ ...tc, hidden: tc.hidden ?? false }))}
            onTestResults={handleTestResults}
          />
        </div>
      </div>
    </div>
  );
}
