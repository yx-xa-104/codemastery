"use client";

import { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import {
  ArrowLeft, BookOpen, Send, CheckCircle, XCircle,
  Clock, ChevronDown, Zap, Lightbulb, BarChart3, FileText
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

const DIFF_STYLE: Record<string, { label: string; color: string; bg: string; border: string }> = {
  easy: { label: "Dễ", color: "text-emerald-400", bg: "bg-emerald-500/10", border: "border-emerald-500/25" },
  medium: { label: "Trung bình", color: "text-amber-400", bg: "bg-amber-500/10", border: "border-amber-500/25" },
  hard: { label: "Khó", color: "text-red-400", bg: "bg-red-500/10", border: "border-red-500/25" },
};

export default function PracticeProblemPage() {
  const params = useParams();
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
  const [leftTab, setLeftTab] = useState<'problem' | 'submissions'>('problem');

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

  const getToken = async () => {
    const supabase = createClient();
    const { data } = await supabase.auth.getSession();
    return data.session?.access_token ?? "";
  };

  const handleCodeChange = useCallback((code: string) => setCurrentCode(code), []);
  const handleTestResults = useCallback((allPassed: boolean) => setTestsPassed(allPassed), []);

  const handleSubmit = async () => {
    if (!problem || !testsPassed) return;
    setSubmitting(true);
    setSubmitResult(null);
    try {
      const token = await getToken();
      const res = await fetch(`${API_URL}/api/practice/${problem.id}/submit-result`, {
        method: "POST",
        headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" },
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
        
        setProblem(prev => prev ? {
          ...prev,
          total_submissions: prev.total_submissions + 1,
          total_accepted: prev.total_accepted + (result.status === "accepted" ? 1 : 0)
        } : prev);
        
        loadSubmissions();

        if (result.isFirstAccept) {
          setXpToast(20);
          setTimeout(() => setXpToast(null), 3000);
        }
      }
    } catch { /* */ }
    setSubmitting(false);
  };

  const loadSubmissions = async () => {
    if (!problem) return;
    try {
      const token = await getToken();
      const res = await fetch(`${API_URL}/api/practice/${problem.id}/submissions`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.ok) setSubmissions(await res.json());
    } catch { /* */ }
  };

  const handleTabSubmissions = () => {
    setLeftTab('submissions');
    if (submissions.length === 0) loadSubmissions();
  };

  if (loading) {
    return (
      <div className="h-screen bg-[#010816] flex items-center justify-center">
        <div className="flex items-center gap-3 text-slate-500 text-sm">
          <div className="w-5 h-5 border-2 border-slate-700 border-t-indigo-500 rounded-full animate-spin" />
          Đang tải bài tập...
        </div>
      </div>
    );
  }

  if (!problem) {
    return (
      <div className="h-screen bg-[#010816] flex flex-col items-center justify-center gap-4">
        <div className="w-12 h-12 rounded-xl bg-slate-800/50 flex items-center justify-center">
          <FileText className="w-6 h-6 text-slate-600" />
        </div>
        <p className="text-slate-500 text-sm">Bài tập không tồn tại</p>
        <Link href="/practice" className="text-xs text-indigo-400 hover:text-indigo-300 transition-colors">
          ← Quay lại danh sách
        </Link>
      </div>
    );
  }

  const dc = DIFF_STYLE[problem.difficulty] || DIFF_STYLE.easy;
  const acceptRate = problem.total_submissions > 0
    ? Math.round((problem.total_accepted / problem.total_submissions) * 100) : 0;

  return (
    <div className="flex flex-col h-screen bg-[#010816] text-slate-300 overflow-hidden font-sans">
      {/* XP Toast */}
      {xpToast && (
        <div className="fixed top-20 left-1/2 -translate-x-1/2 z-100 animate-in fade-in slide-in-from-top-4 duration-300">
          <div className="flex items-center gap-2 px-5 py-3 bg-amber-500/20 border border-amber-500/40 rounded-xl backdrop-blur-md shadow-lg shadow-amber-500/10">
            <Zap className="w-5 h-5 text-amber-400 fill-amber-400" />
            <span className="text-amber-300 font-bold text-sm">+{xpToast} XP</span>
          </div>
        </div>
      )}

      {/* Top Bar — matching lesson page style */}
      <div className="flex h-14 bg-[#010816] border-b border-slate-800 items-center justify-between px-4 shrink-0 z-50">
        <div className="flex items-center gap-3 min-w-0">
          <Link
            href="/practice"
            className="flex size-8 rounded-full bg-slate-800 items-center justify-center text-slate-400 hover:text-white hover:bg-slate-700 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
          </Link>
          <h1 className="font-bold text-white text-sm lg:text-base tracking-tight truncate">
            {problem.title}
          </h1>
          <span className={`text-[10px] font-bold px-2.5 py-1 rounded-full border ${dc.bg} ${dc.border} ${dc.color} shrink-0`}>
            {dc.label}
          </span>
        </div>

        <div className="flex items-center gap-2">
          {/* Stats pill */}
          <div className="hidden sm:flex items-center gap-3 text-[11px] text-slate-500 bg-slate-800/40 px-3 py-1.5 rounded-lg border border-slate-700/40">
            <span className="flex items-center gap-1">
              <BarChart3 className="w-3 h-3" />
              <span className="text-slate-400 font-mono">{acceptRate}%</span>
            </span>
            <div className="w-px h-3 bg-slate-700" />
            <span>{problem.total_submissions} nộp</span>
          </div>

          {/* Submit button */}
          <Button
            onClick={handleSubmit}
            disabled={!testsPassed || submitting}
            className={`h-auto px-4 py-2 rounded-lg transition-all flex items-center gap-2 text-xs font-bold ${
              testsPassed
                ? "bg-emerald-600 hover:bg-emerald-500 text-white shadow-lg shadow-emerald-600/20"
                : "bg-slate-800/50 text-slate-500 border border-slate-700 cursor-not-allowed"
            }`}
          >
            <Send className="w-3.5 h-3.5" />
            {submitting ? "Đang nộp..." : "Nộp bài"}
          </Button>
        </div>
      </div>

      {/* Submit result banner */}
      {submitResult && (
        <div className={`px-4 py-2.5 text-xs font-semibold flex items-center gap-2 ${
          submitResult.status === "accepted"
            ? "bg-emerald-500/10 text-emerald-400 border-b border-emerald-500/20"
            : "bg-red-500/10 text-red-400 border-b border-red-500/20"
        }`}>
          {submitResult.status === "accepted" ? (
            <><CheckCircle className="w-4 h-4" /> Accepted! {submitResult.isFirstAccept && "🎉 +20 XP"}</>
          ) : (
            <><XCircle className="w-4 h-4" /> Wrong Answer</>
          )}
        </div>
      )}

      {/* Body */}
      <div className="flex flex-1 overflow-hidden">
        {/* Left panel */}
        <div className="lg:w-[40%] xl:w-[35%] h-[35vh] lg:h-full overflow-hidden border-b lg:border-b-0 lg:border-r border-slate-800 shrink-0 flex flex-col">
          {/* Left tabs */}
          <div className="flex items-center border-b border-slate-800 px-4 shrink-0">
            <button
              onClick={() => setLeftTab('problem')}
              className={`px-3 py-3 text-xs font-semibold transition-colors relative ${
                leftTab === 'problem'
                  ? 'text-white'
                  : 'text-slate-500 hover:text-slate-300'
              }`}
            >
              <span className="flex items-center gap-1.5">
                <BookOpen className="w-3.5 h-3.5" />
                Đề bài
              </span>
              {leftTab === 'problem' && (
                <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-indigo-500 rounded-full" />
              )}
            </button>
            <button
              onClick={handleTabSubmissions}
              className={`px-3 py-3 text-xs font-semibold transition-colors relative ${
                leftTab === 'submissions'
                  ? 'text-white'
                  : 'text-slate-500 hover:text-slate-300'
              }`}
            >
              <span className="flex items-center gap-1.5">
                <Clock className="w-3.5 h-3.5" />
                Lịch sử
              </span>
              {leftTab === 'submissions' && (
                <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-indigo-500 rounded-full" />
              )}
            </button>
          </div>

          <div className="flex-1 overflow-y-auto scrollbar-thin scrollbar-thumb-slate-700 scrollbar-track-transparent">
            {leftTab === 'problem' ? (
              <div className="p-5 lg:p-6 space-y-5">
                {/* Description box */}
                <div className="rounded-xl border border-slate-700/40 bg-slate-900/30 overflow-hidden">
                  <div className="flex items-center gap-2 px-4 py-2.5 border-b border-slate-700/30 bg-slate-800/30">
                    <BookOpen className="w-3.5 h-3.5 text-indigo-400" />
                    <span className="text-xs font-bold text-indigo-400 uppercase tracking-wider">Đề bài</span>
                  </div>
                  <div className="p-5 prose prose-invert prose-base max-w-none
                    prose-headings:text-white prose-headings:font-bold prose-headings:tracking-tight prose-headings:mt-3 prose-headings:mb-2
                    prose-p:text-white prose-p:leading-relaxed prose-p:my-2
                    prose-li:text-white prose-li:leading-relaxed
                    prose-code:text-indigo-300 prose-code:bg-indigo-500/10 prose-code:px-1.5 prose-code:py-0.5 prose-code:rounded prose-code:text-sm prose-code:font-semibold
                    prose-strong:text-white prose-strong:font-bold
                    prose-a:text-indigo-400 prose-a:no-underline hover:prose-a:text-indigo-300"
                  >
                    <ReactMarkdown>{problem.description}</ReactMarkdown>
                  </div>
                </div>

                {/* I/O Examples box */}
                {problem.test_cases.filter(tc => !tc.hidden).length > 0 && (
                  <div className="rounded-xl border border-slate-700/40 bg-slate-900/30 overflow-hidden">
                    <div className="flex items-center gap-2 px-4 py-2.5 border-b border-slate-700/30 bg-slate-800/30">
                      <Lightbulb className="w-3.5 h-3.5 text-cyan-400" />
                      <span className="text-xs font-bold text-cyan-400 uppercase tracking-wider">Ví dụ Input / Output</span>
                    </div>
                    <div className="p-4 space-y-3">
                      {problem.test_cases.filter(tc => !tc.hidden).map((tc, i) => (
                        <div key={i} className="rounded-lg overflow-hidden border border-slate-700/30 bg-[#010816]">
                          <div className="grid grid-cols-2">
                            <div className="p-3.5 border-r border-slate-700/30">
                              <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest block mb-2">Input</span>
                              <pre className="text-xs text-emerald-300/90 font-mono leading-relaxed whitespace-pre-wrap">{tc.input.trim() || '(trống)'}</pre>
                            </div>
                            <div className="p-3.5">
                              <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest block mb-2">Output</span>
                              <pre className="text-xs text-amber-300/90 font-mono leading-relaxed whitespace-pre-wrap">{tc.expectedOutput}</pre>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Hints box */}
                {problem.hints && problem.hints.length > 0 && (
                  <div className="rounded-xl border border-amber-500/20 bg-amber-500/5 overflow-hidden">
                    <button
                      onClick={() => setShowHints(!showHints)}
                      className="w-full flex items-center justify-between px-4 py-2.5 hover:bg-amber-500/5 transition-colors"
                    >
                      <span className="flex items-center gap-2 text-xs font-bold text-amber-400 uppercase tracking-wider">
                        <Lightbulb className="w-3.5 h-3.5" />
                        Gợi ý ({problem.hints.length})
                      </span>
                      <ChevronDown className={`w-3.5 h-3.5 text-amber-400 transition-transform duration-200 ${showHints ? "rotate-180" : ""}`} />
                    </button>
                    {showHints && (
                      <div className="px-4 pb-4 space-y-2.5 border-t border-amber-500/15">
                        {problem.hints.map((h, i) => (
                          <div key={i} className="flex items-start gap-2.5 pt-2.5">
                            <span className="shrink-0 w-5 h-5 rounded-md bg-amber-500/15 text-amber-400 text-[10px] font-bold flex items-center justify-center mt-0.5">
                              {i + 1}
                            </span>
                            <p className="text-xs text-amber-300/80 leading-relaxed">{h}</p>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                )}
              </div>
            ) : (
              /* Submissions tab */
              <div className="p-5 lg:p-6">
                {submissions.length === 0 ? (
                  <div className="text-center py-10">
                    <Clock className="w-8 h-8 text-slate-700 mx-auto mb-3" />
                    <p className="text-sm text-slate-500">Chưa có lượt nộp bài nào</p>
                  </div>
                ) : (
                  <div className="space-y-2">
                    {submissions.slice(0, 15).map(s => (
                      <div key={s.id} className="flex items-center justify-between px-3.5 py-2.5 bg-slate-900/40 border border-slate-700/30 rounded-xl text-xs">
                        <span className={`flex items-center gap-1.5 font-semibold ${
                          s.status === "accepted" ? "text-emerald-400" : "text-red-400"
                        }`}>
                          {s.status === "accepted"
                            ? <CheckCircle className="w-3.5 h-3.5" />
                            : <XCircle className="w-3.5 h-3.5" />
                          }
                          {s.status === "accepted" ? "Accepted" : "Wrong Answer"}
                        </span>
                        <span className="text-slate-400 font-mono">{s.tests_passed}/{s.tests_total}</span>
                        <span className="text-slate-600">{new Date(s.submitted_at).toLocaleDateString("vi-VN")}</span>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Right: Code editor */}
        <div className="flex-1 min-h-0 min-w-0 p-3 lg:p-4">
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
