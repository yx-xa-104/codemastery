"use client";

import { useState, useEffect, Suspense } from "react";
import { TeacherLayout } from "@/features/teacher/components/TeacherLayout";
import { createClient } from "@/shared/lib/supabase/client";
import { useRouter, useSearchParams } from "next/navigation";
import { Save, Plus, Trash2, ArrowLeft, Loader2, Info, Code } from "lucide-react";
import Link from "next/link";

interface TestCase {
    input: string;
    expected_output: string;
    is_hidden: boolean;
}

function CreateExerciseContent() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const id = searchParams.get('id');
    const isEdit = !!id;

    const [loading, setLoading] = useState(isEdit);
    const [saving, setSaving] = useState(false);

    // Form states
    const [title, setTitle] = useState('');
    const [difficulty, setDifficulty] = useState('easy');
    const [language, setLanguage] = useState('javascript');
    const [category, setCategory] = useState('');
    const [description, setDescription] = useState('');
    const [starterCode, setStarterCode] = useState('');
    const [solutionCode, setSolutionCode] = useState('');
    const [hints, setHints] = useState<string[]>([]);
    const [testCases, setTestCases] = useState<TestCase[]>([{ input: '', expected_output: '', is_hidden: false }]);

    const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001";

    useEffect(() => {
        if (!isEdit) return;
        const fetchExercise = async () => {
            try {
                const res = await fetch(`${API_URL}/api/practice`);
                if (res.ok) {
                    const data = await res.json();
                    const exercise = data.find((e: any) => e.id === id);
                    if (exercise) {
                        setTitle(exercise.title || '');
                        setDifficulty(exercise.difficulty || 'easy');
                        setLanguage(exercise.language || 'javascript');
                        setCategory(exercise.category || '');
                        setDescription(exercise.description || '');
                        setStarterCode(exercise.starter_code || '');
                        setSolutionCode(exercise.solution_code || '');
                        setHints(exercise.hints || []);
                        if (exercise.test_cases && exercise.test_cases.length > 0) {
                            setTestCases(exercise.test_cases);
                        }
                    } else {
                        alert("Không tìm thấy bài tập!");
                        router.push('/teacher/exercises');
                    }
                }
            } catch (err) {
                console.error("Failed to fetch exercise", err);
            } finally {
                setLoading(false);
            }
        };
        fetchExercise();
    }, [id, isEdit, API_URL, router]);

    const handleSave = async () => {
        if (!title.trim() || !language) {
            alert("Vui lòng điền tên bài tập và ngôn ngữ.");
            return;
        }

        setSaving(true);
        const supabase = createClient();
        const { data: { session } } = await supabase.auth.getSession();
        
        if (!session) {
            alert("Vui lòng đăng nhập lại!");
            setSaving(false);
            return;
        }

        const payload = {
            title,
            description,
            difficulty,
            language,
            category,
            starter_code: starterCode,
            solution_code: solutionCode,
            hints: hints.filter(h => h.trim() !== ''),
            test_cases: testCases.filter(t => t.input.trim() !== '' || t.expected_output.trim() !== '')
        };

        try {
            const endpoint = isEdit ? `${API_URL}/api/practice/${id}` : `${API_URL}/api/practice`;
            const method = isEdit ? 'PATCH' : 'POST';

            const res = await fetch(endpoint, {
                method,
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${session.access_token}`
                },
                body: JSON.stringify(payload)
            });

            if (res.ok) {
                alert(isEdit ? "Cập nhật thành công!" : "Tạo bài tập thành công!");
                router.push('/teacher/exercises');
                router.refresh();
            } else {
                const err = await res.json();
                alert(`Lỗi: ${err.message || 'Không thể lưu bài tập'}`);
            }
        } catch (err) {
            console.error("Save error", err);
            alert("Đã xảy ra lỗi hệ thống.");
        } finally {
            setSaving(false);
        }
    };

    // UI Helpers
    const updateTestCase = (index: number, field: keyof TestCase, value: any) => {
        const newTests = [...testCases];
        newTests[index] = { ...newTests[index], [field]: value };
        setTestCases(newTests);
    };

    const addTestCase = () => setTestCases([...testCases, { input: '', expected_output: '', is_hidden: false }]);
    const removeTestCase = (index: number) => setTestCases(testCases.filter((_, i) => i !== index));

    const updateHint = (index: number, value: string) => {
        const newHints = [...hints];
        newHints[index] = value;
        setHints(newHints);
    };
    
    const addHint = () => setHints([...hints, '']);
    const removeHint = (index: number) => setHints(hints.filter((_, i) => i !== index));

    if (loading) {
        return (
            <TeacherLayout title={isEdit ? "Chỉnh sửa bài tập" : "Thêm bài tập mới"} subtitle="Đang tải dữ liệu...">
                <div className="flex justify-center items-center h-64"><Loader2 className="w-8 h-8 animate-spin text-indigo-500" /></div>
            </TeacherLayout>
        );
    }

    return (
        <TeacherLayout
            title={isEdit ? "Chỉnh sửa bài tập" : "Thêm bài tập mới"}
            subtitle="Cấu hình chi tiết bài toán và các Test Cases"
            action={
                <div className="flex items-center gap-3">
                    <Link href="/teacher/exercises" className="flex items-center gap-2 px-4 py-2 bg-[#0B1120] hover:bg-slate-800 border border-slate-700 text-slate-300 text-sm font-semibold rounded-lg transition-all">
                        <ArrowLeft className="w-4 h-4" /> Bỏ qua
                    </Link>
                    <button onClick={handleSave} disabled={saving} className="flex items-center gap-2 px-6 py-2 bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 text-white text-sm font-semibold rounded-lg transition-all shadow-lg shadow-indigo-500/20">
                        {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                        {saving ? "Đang lưu..." : "Lưu bài tập"}
                    </button>
                </div>
            }
        >
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-2 space-y-6">
                    {/* General Info */}
                    <div className="bg-[#0B1120] border border-slate-800 rounded-xl p-6">
                        <h3 className="text-white font-semibold mb-4">Thông tin chung</h3>
                        <div className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-slate-400 mb-1">Tên bài tập *</label>
                                <input value={title} onChange={e => setTitle(e.target.value)}
                                    className="w-full px-4 py-2.5 bg-[#050C1F] border border-slate-700 rounded-lg text-white focus:outline-none focus:border-indigo-500"
                                    placeholder="Vd: Tìm số nguyên tố..." />
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-slate-400 mb-1">Mức độ</label>
                                    <select value={difficulty} onChange={e => setDifficulty(e.target.value)}
                                        className="w-full px-4 py-2.5 bg-[#050C1F] border border-slate-700 rounded-lg text-white focus:outline-none focus:border-indigo-500">
                                        <option value="easy">Cơ bản</option>
                                        <option value="medium">Trung bình</option>
                                        <option value="hard">Nâng cao</option>
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-slate-400 mb-1">Ngôn ngữ *</label>
                                    <select value={language} onChange={e => setLanguage(e.target.value)}
                                        className="w-full px-4 py-2.5 bg-[#050C1F] border border-slate-700 rounded-lg text-white focus:outline-none focus:border-indigo-500">
                                        <option value="javascript">JavaScript</option>
                                        <option value="python">Python</option>
                                        <option value="cpp">C++</option>
                                        <option value="java">Java</option>
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-slate-400 mb-1">Danh mục</label>
                                    <input value={category} onChange={e => setCategory(e.target.value)}
                                        className="w-full px-4 py-2.5 bg-[#050C1F] border border-slate-700 rounded-lg text-white focus:outline-none focus:border-indigo-500"
                                        placeholder="Vd: arrays, strings..." />
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Description */}
                    <div className="bg-[#0B1120] border border-slate-800 rounded-xl p-6">
                        <div className="flex items-center justify-between mb-4">
                            <h3 className="text-white font-semibold">Nội dung đề bài</h3>
                            <span className="text-xs text-slate-500 flex items-center gap-1"><Info className="w-3 h-3"/> Hỗ trợ Markdown</span>
                        </div>
                        <textarea value={description} onChange={e => setDescription(e.target.value)}
                            className="w-full px-4 py-3 bg-[#050C1F] border border-slate-700 rounded-lg text-white font-mono text-sm focus:outline-none focus:border-indigo-500 min-h-[250px]"
                            placeholder="Mô tả đề bài..." />
                    </div>

                    {/* Code Templates */}
                    <div className="bg-[#0B1120] border border-slate-800 rounded-xl p-6">
                        <h3 className="text-white font-semibold mb-4">Code Template</h3>
                        <div className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-slate-400 mb-2">Code mẫu (Starter code)</label>
                                <textarea value={starterCode} onChange={e => setStarterCode(e.target.value)}
                                    className="w-full px-4 py-3 bg-[#050C1F] border border-slate-700 rounded-lg text-emerald-400 font-mono text-sm focus:outline-none focus:border-indigo-500 min-h-[150px] whitespace-pre"
                                    placeholder="def solution(n):&#10;    pass" />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-slate-400 mb-2">Đáp án (Solution code để tham khảo)</label>
                                <textarea value={solutionCode} onChange={e => setSolutionCode(e.target.value)}
                                    className="w-full px-4 py-3 bg-[#050C1F] border border-slate-700 rounded-lg text-green-400 font-mono text-sm focus:outline-none focus:border-indigo-500 min-h-[150px] whitespace-pre"
                                    placeholder="def solution(n):&#10;    return n * 2" />
                            </div>
                        </div>
                    </div>
                </div>

                <div className="space-y-6">
                    {/* Test Cases */}
                    <div className="bg-[#0B1120] border border-indigo-900/30 rounded-xl p-5 shadow-lg shadow-indigo-900/10">
                        <div className="flex items-center justify-between mb-4">
                            <h3 className="text-white font-semibold flex items-center gap-2">
                                <Code className="w-4 h-4 text-indigo-400" /> Test Cases
                            </h3>
                            <button onClick={addTestCase} className="text-xs bg-indigo-500/10 hover:bg-indigo-500/20 text-indigo-300 px-2 py-1 rounded transition-colors flex items-center gap-1 border border-indigo-500/20">
                                <Plus className="w-3 h-3" /> Thêm
                            </button>
                        </div>
                        
                        <div className="space-y-4">
                            {testCases.map((tc, idx) => (
                                <div key={idx} className="p-3 bg-[#050C1F] border border-slate-800 rounded-lg relative group">
                                    <button onClick={() => removeTestCase(idx)} className="absolute top-2 right-2 p-1 text-slate-600 hover:text-red-400 bg-slate-800 hover:bg-slate-700 rounded opacity-0 group-hover:opacity-100 transition-all">
                                        <Trash2 className="w-3 h-3" />
                                    </button>
                                    <div className="mb-2">
                                        <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Test Case #{idx + 1}</span>
                                    </div>
                                    <div className="space-y-2">
                                        <div>
                                            <label className="text-xs text-slate-400 block mb-1">Input (Tham số gọi hàm / std in)</label>
                                            <textarea value={tc.input} onChange={e => updateTestCase(idx, 'input', e.target.value)}
                                                className="w-full px-3 py-1.5 bg-[#0B1120] border border-slate-700 rounded text-slate-300 font-mono text-xs focus:outline-none focus:border-indigo-500 min-h-[50px] whitespace-pre" />
                                        </div>
                                        <div>
                                            <label className="text-xs text-slate-400 block mb-1">Cửa sổ / Kết quả mong đợi (Output)</label>
                                            <textarea value={tc.expected_output} onChange={e => updateTestCase(idx, 'expected_output', e.target.value)}
                                                className="w-full px-3 py-1.5 bg-[#0B1120] border border-slate-700 rounded text-green-400 font-mono text-xs focus:outline-none focus:border-indigo-500 min-h-[50px] whitespace-pre" />
                                        </div>
                                        <label className="flex items-center gap-2 mt-2 cursor-pointer">
                                            <input type="checkbox" checked={tc.is_hidden} onChange={e => updateTestCase(idx, 'is_hidden', e.target.checked)} className="rounded border-slate-700 bg-[#0B1120] text-indigo-500 focus:ring-0 focus:ring-offset-0" />
                                            <span className="text-xs text-slate-400">Ẩn Test Case (Hidden)</span>
                                        </label>
                                    </div>
                                </div>
                            ))}
                            {testCases.length === 0 && (
                                <div className="text-center py-6 text-sm text-slate-500 border border-dashed border-slate-700 rounded-lg">Không có Test Case nào</div>
                            )}
                        </div>
                    </div>

                    {/* Hints */}
                    <div className="bg-[#0B1120] border border-slate-800 rounded-xl p-5">
                        <div className="flex items-center justify-between mb-4">
                            <h3 className="text-white font-semibold flex items-center gap-2">Gợi ý (Hints)</h3>
                            <button onClick={addHint} className="text-xs bg-slate-800 hover:bg-slate-700 text-slate-300 px-2 py-1 rounded transition-colors flex items-center gap-1 border border-slate-700">
                                <Plus className="w-3 h-3" /> Thêm
                            </button>
                        </div>
                        <div className="space-y-2">
                            {hints.map((hint, idx) => (
                                <div key={idx} className="flex gap-2 items-start">
                                    <div className="w-6 h-6 shrink-0 rounded-full bg-slate-800 text-slate-400 flex items-center justify-center text-xs font-bold mt-1">{idx + 1}</div>
                                    <input value={hint} onChange={e => updateHint(idx, e.target.value)}
                                        className="flex-1 px-3 py-1.5 bg-[#050C1F] border border-slate-700 rounded text-slate-300 text-sm focus:outline-none focus:border-indigo-500"
                                        placeholder="Ví dụ: Sử dụng mảng để giải quyết..." />
                                    <button onClick={() => removeHint(idx)} className="p-2 text-slate-600 hover:text-red-400 bg-slate-800 hover:bg-slate-700 rounded mt-0.5">
                                        <Trash2 className="w-3 h-3" />
                                    </button>
                                </div>
                            ))}
                            {hints.length === 0 && (
                                <div className="text-center py-4 text-xs text-slate-500">Chưa có gợi ý</div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </TeacherLayout>
    );
}

export default function CreateExercisePage() {
    return (
        <Suspense fallback={
            <TeacherLayout title="Đang tải..." subtitle=""><div className="flex justify-center items-center h-64"><Loader2 className="w-8 h-8 animate-spin text-indigo-500" /></div></TeacherLayout>
        }>
            <CreateExerciseContent />
        </Suspense>
    );
}
