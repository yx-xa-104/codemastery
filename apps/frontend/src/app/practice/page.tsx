"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  Code2, Search, Trophy, ChevronRight,
  Flame, Zap, Target, ArrowUpRight, BookOpen,
  Home
} from "lucide-react";
import { MainLayout } from "@/shared/components/layouts/MainLayout";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001";

interface Problem {
  id: string;
  title: string;
  slug: string;
  difficulty: string;
  language: string;
  category: string | null;
  total_submissions: number;
  total_accepted: number;
}

const DIFFICULTY_CONFIG: Record<string, { label: string; color: string; bg: string }> = {
  easy: { label: "Dễ", color: "text-green-400", bg: "bg-green-500/10 border-green-500/20" },
  medium: { label: "Trung bình", color: "text-amber-400", bg: "bg-amber-500/10 border-amber-500/20" },
  hard: { label: "Khó", color: "text-red-400", bg: "bg-red-500/10 border-red-500/20" },
};

const CATEGORIES = [
  { value: "", label: "Tất cả" },
  { value: "arrays", label: "Mảng" },
  { value: "strings", label: "Chuỗi" },
  { value: "math", label: "Toán học" },
  { value: "sorting", label: "Sắp xếp" },
  { value: "search", label: "Tìm kiếm" },
  { value: "recursion", label: "Đệ quy" },
  { value: "oop", label: "OOP" },
  { value: "data-structures", label: "Cấu trúc DL" },
];

export default function PracticePage() {
  const router = useRouter();
  const [problems, setProblems] = useState<Problem[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [difficulty, setDifficulty] = useState("");
  const [language, setLanguage] = useState("");
  const [category, setCategory] = useState("");

  useEffect(() => {
    (async () => {
      setLoading(true);
      try {
        const params = new URLSearchParams();
        if (search) params.set("search", search);
        if (difficulty) params.set("difficulty", difficulty);
        if (language) params.set("language", language);
        if (category) params.set("category", category);
        const res = await fetch(`${API_URL}/api/practice?${params}`);
        if (res.ok) setProblems(await res.json());
      } catch { /* */ }
      setLoading(false);
    })();
  }, [search, difficulty, language, category]);

  const acceptRate = (p: Problem) =>
    p.total_submissions > 0 ? Math.round((p.total_accepted / p.total_submissions) * 100) : 0;

  return (
    <MainLayout>
    <div className="text-white font-sans">
      {/* Hero */}
      <div className="relative overflow-hidden border-b border-slate-800">
        <div className="absolute inset-0 bg-gradient-to-br from-indigo-600/10 via-transparent to-amber-600/5" />
        <div className="max-w-6xl mx-auto px-4 py-12 relative">
          <div className="flex items-center gap-3 mb-3">
            <div className="p-2.5 rounded-xl bg-indigo-500/15 border border-indigo-500/20">
              <Code2 className="w-6 h-6 text-indigo-400" />
            </div>
            <h1 className="text-2xl lg:text-3xl font-black tracking-tight">Luyện tập</h1>
          </div>
          <p className="text-slate-400 text-sm max-w-xl">
            Rèn luyện kỹ năng lập trình qua các bài tập thực hành. Giải càng nhiều, kỹ năng càng vững!
          </p>

          {/* Stats */}
          <div className="flex gap-6 mt-6">
            {[
              { icon: Target, label: "Bài tập", value: problems.length, color: "text-indigo-400" },
              { icon: Flame, label: "Dễ", value: problems.filter(p => p.difficulty === "easy").length, color: "text-green-400" },
              { icon: Zap, label: "TB", value: problems.filter(p => p.difficulty === "medium").length, color: "text-amber-400" },
              { icon: Trophy, label: "Khó", value: problems.filter(p => p.difficulty === "hard").length, color: "text-red-400" },
            ].map((s, i) => (
              <div key={i} className="flex items-center gap-2">
                <s.icon className={`w-4 h-4 ${s.color}`} />
                <span className="text-xs text-slate-400">{s.label}:</span>
                <span className={`text-sm font-bold ${s.color}`}>{s.value}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 py-6">
        {/* Filters */}
        <div className="flex flex-wrap items-center gap-3 mb-6">
          <div className="relative flex-1 min-w-[200px] max-w-sm">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
            <input
              value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder="Tìm bài tập..."
              className="w-full pl-9 pr-3 py-2 bg-navy-950 border border-slate-700 rounded-lg text-sm text-white focus:border-indigo-500 focus:outline-none"
            />
          </div>

          <select value={difficulty} onChange={e => setDifficulty(e.target.value)}
            className="bg-navy-950 border border-slate-700 rounded-lg text-sm text-white px-3 py-2 focus:border-indigo-500">
            <option value="">Tất cả độ khó</option>
            <option value="easy">Dễ</option>
            <option value="medium">Trung bình</option>
            <option value="hard">Khó</option>
          </select>

          <select value={language} onChange={e => setLanguage(e.target.value)}
            className="bg-navy-950 border border-slate-700 rounded-lg text-sm text-white px-3 py-2 focus:border-indigo-500">
            <option value="">Tất cả ngôn ngữ</option>
            <option value="javascript">JavaScript</option>
            <option value="python">Python</option>
            <option value="c">C</option>
            <option value="cpp">C++</option>
            <option value="java">Java</option>
          </select>

          <select value={category} onChange={e => setCategory(e.target.value)}
            className="bg-navy-950 border border-slate-700 rounded-lg text-sm text-white px-3 py-2 focus:border-indigo-500">
            {CATEGORIES.map(c => <option key={c.value} value={c.value}>{c.label}</option>)}
          </select>
        </div>

        {/* Problem List */}
        {loading ? (
          <div className="text-center py-20 text-slate-500 text-sm">Đang tải...</div>
        ) : problems.length === 0 ? (
          <div className="text-center py-20">
            <BookOpen className="w-12 h-12 text-slate-600 mx-auto mb-3" />
            <p className="text-slate-400 text-sm">Chưa có bài tập nào.</p>
          </div>
        ) : (
          <div className="space-y-2">
            {/* Table Header */}
            <div className="grid grid-cols-12 gap-3 px-4 py-2 text-[10px] font-bold text-slate-500 uppercase tracking-wider">
              <div className="col-span-1">#</div>
              <div className="col-span-5">Tên bài</div>
              <div className="col-span-2">Độ khó</div>
              <div className="col-span-2">Ngôn ngữ</div>
              <div className="col-span-2 text-right">Tỉ lệ AC</div>
            </div>

            {problems.map((p, i) => {
              const dc = DIFFICULTY_CONFIG[p.difficulty] || DIFFICULTY_CONFIG.easy;
              return (
                <Link key={p.id} href={`/practice/${p.slug}`}
                  className="group grid grid-cols-12 gap-3 items-center px-4 py-3 bg-navy-900 hover:bg-navy-800 border border-slate-800 hover:border-indigo-500/30 rounded-xl transition-all cursor-pointer">
                  <div className="col-span-1 text-xs text-slate-500 font-mono">{i + 1}</div>
                  <div className="col-span-5 flex items-center gap-2 min-w-0">
                    <span className="text-sm font-medium text-white group-hover:text-indigo-300 transition-colors truncate">
                      {p.title}
                    </span>
                    <ArrowUpRight className="w-3.5 h-3.5 text-slate-600 group-hover:text-indigo-400 transition-colors shrink-0 opacity-0 group-hover:opacity-100" />
                  </div>
                  <div className="col-span-2">
                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${dc.bg} ${dc.color}`}>
                      {dc.label}
                    </span>
                  </div>
                  <div className="col-span-2">
                    <span className="text-xs text-slate-400">{p.language}</span>
                  </div>
                  <div className="col-span-2 text-right">
                    <span className={`text-xs font-mono ${acceptRate(p) > 60 ? "text-green-400" : acceptRate(p) > 30 ? "text-amber-400" : "text-slate-500"}`}>
                      {p.total_submissions > 0 ? `${acceptRate(p)}%` : "—"}
                    </span>
                  </div>
                </Link>
              );
            })}
          </div>
        )}
      </div>
    </div>
    </MainLayout>
  );
}
