"use client";

import Link from "next/link";
import { useState } from "react";
import { ArrowLeft, Plus, Save, Globe, ChevronDown, ChevronRight, Grip, PlayCircle, BookOpen, Code, CheckCircle, Trash2, FileText } from "lucide-react";
import { Button } from "@/shared/components/ui/button";

interface Lesson {
    id: string;
    title: string;
    type: 'video' | 'interactive' | 'quiz';
}
interface Module {
    id: string;
    title: string;
    lessons: Lesson[];
    expanded: boolean;
}

const LANGUAGES = ['Python 3', 'JavaScript (Node)', 'C++', 'Java'];

export default function CourseCreatePage() {
    const [courseTitle, setCourseTitle] = useState('Lập trình Python Cơ bản');
    const [activeTab, setActiveTab] = useState<'content' | 'settings' | 'preview'>('content');
    const [saving, setSaving] = useState(false);
    const [selectedLang, setSelectedLang] = useState(LANGUAGES[0]);
    const [modules, setModules] = useState<Module[]>([
        {
            id: 'm1', title: '1. Nhập môn Python', expanded: true,
            lessons: [
                { id: 'l1', title: '1.1 Tổng quan ngôn ngữ', type: 'video' },
                { id: 'l2', title: '1.2 Cài đặt môi trường', type: 'video' },
                { id: 'l3', title: '1.3 Viết dòng code đầu tiên', type: 'interactive' },
            ]
        },
        { id: 'm2', title: '2. Biến và Kiểu dữ liệu', expanded: false, lessons: [] },
        { id: 'm3', title: '3. Cấu trúc điều khiển', expanded: false, lessons: [] },
    ]);

    const addModule = () => {
        setModules(prev => [...prev, {
            id: `m${Date.now()}`, title: `${prev.length + 1}. Module mới`, expanded: true, lessons: []
        }]);
    };

    const addLesson = (moduleId: string) => {
        setModules(prev => prev.map(m =>
            m.id === moduleId
                ? { ...m, lessons: [...m.lessons, { id: `l${Date.now()}`, title: 'Bài học mới', type: 'interactive' }] }
                : m
        ));
    };

    const toggleModule = (id: string) => setModules(prev => prev.map(m => m.id === id ? { ...m, expanded: !m.expanded } : m));

    const handleSave = async () => {
        setSaving(true);
        await new Promise(r => setTimeout(r, 1000));
        setSaving(false);
    };

    const lessonIcon = (type: Lesson['type']) => {
        if (type === 'video') return <PlayCircle className="w-4 h-4 text-amber-400" />;
        if (type === 'quiz') return <CheckCircle className="w-4 h-4 text-green-400" />;
        return <Code className="w-4 h-4 text-indigo-400" />;
    };

    return (
        <div className="flex flex-col h-screen bg-[#010816] text-slate-100 overflow-hidden font-sans">
            <nav className="bg-[#0B1120] border-b border-slate-800 h-16 flex items-center justify-between px-4 sm:px-6 z-20 shrink-0">
                <div className="flex items-center gap-4">
                    <Link href="/teacher/dashboard" className="flex items-center gap-2 text-slate-400 hover:text-white transition-colors p-2 rounded-full hover:bg-white/5">
                        <ArrowLeft className="w-4 h-4" />
                    </Link>
                    <div className="w-px h-6 bg-slate-700" />
                    <div className="flex flex-col">
                        <span className="text-[10px] text-slate-400 uppercase tracking-wider font-semibold">Tạo khóa học mới</span>
                        <input value={courseTitle} onChange={e => setCourseTitle(e.target.value)}
                            className="text-base font-bold text-white bg-transparent border-none focus:outline-none focus:ring-0 p-0 max-w-[300px]" />
                    </div>
                </div>
                <div className="flex items-center gap-3">
                    <span className="hidden md:flex text-xs text-slate-500 items-center gap-1.5">
                        <span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" /> Đã lưu bản nháp
                    </span>
                    <Button onClick={handleSave} disabled={saving} variant="ghost" className="px-4 py-2 text-sm font-medium text-slate-300 hover:text-white hover:bg-white/5 border border-transparent hover:border-slate-700 rounded-lg transition-all">
                        {saving ? 'Đang lưu...' : 'Lưu nháp'}
                    </Button>
                    <Button className="px-4 py-2 text-sm font-bold text-white bg-amber-500 hover:bg-amber-400 rounded-lg shadow-md flex items-center gap-2 transition-all hover:-translate-y-0.5">
                        <Globe className="w-4 h-4" /> Xuất bản
                    </Button>
                </div>
            </nav>

            <div className="flex flex-1 overflow-hidden">
                <aside className="w-72 bg-[#050C1F] border-r border-slate-800 flex flex-col overflow-y-auto shrink-0">
                    <div className="p-4 border-b border-slate-800 flex justify-between items-center sticky top-0 bg-[#050C1F]/95 backdrop-blur z-10">
                        <h2 className="font-bold text-slate-200 text-xs uppercase tracking-wide">Cấu trúc khóa học</h2>
                        <Button variant="ghost" size="icon" onClick={addModule} className="text-indigo-400 hover:text-white hover:bg-indigo-500/20 p-1.5 rounded transition-colors h-7 w-7" title="Thêm chương">
                            <Plus className="w-4 h-4" />
                        </Button>
                    </div>
                    <div className="p-3 space-y-3 flex-1">
                        {modules.map(mod => (
                            <div key={mod.id} className="group">
                                <div onClick={() => toggleModule(mod.id)}
                                    className="flex items-center justify-between p-2 text-sm font-semibold text-slate-200 bg-white/5 rounded-md cursor-pointer hover:bg-white/10 border border-transparent hover:border-slate-700 transition-all">
                                    <div className="flex items-center gap-2 overflow-hidden">
                                        <Grip className="w-3 h-3 text-slate-600 cursor-move hover:text-slate-300" />
                                        <span className="truncate text-xs">{mod.title}</span>
                                    </div>
                                    {mod.expanded ? <ChevronDown className="w-3 h-3 text-slate-400 shrink-0" /> : <ChevronRight className="w-3 h-3 text-slate-400 shrink-0" />}
                                </div>
                                {mod.expanded && (
                                    <div className="mt-1 ml-3 pl-3 border-l-2 border-slate-800 space-y-1">
                                        {mod.lessons.map((lesson, i) => (
                                            <div key={lesson.id} className={`flex items-center gap-2 p-2 rounded-md text-xs cursor-pointer transition-colors ${i === 0 ? 'bg-indigo-500/10 text-indigo-300 border border-indigo-500/20' : 'hover:bg-white/5 text-slate-400 border border-transparent hover:border-slate-800'}`}>
                                                <Grip className="w-3 h-3 text-slate-600 cursor-move" />
                                                {lessonIcon(lesson.type)}
                                                <span className="truncate">{lesson.title}</span>
                                            </div>
                                        ))}
                                        <Button variant="ghost" onClick={() => addLesson(mod.id)} className="mt-1 h-auto text-xs text-slate-500 hover:text-indigo-400 flex items-center gap-1 py-1 px-2 rounded hover:bg-white/5 transition-colors w-fit">
                                            <Plus className="w-3 h-3" /> Thêm bài học
                                        </Button>
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>
                    <div className="p-3 border-t border-slate-800">
                        <Button variant="outline" onClick={addModule} className="w-full h-auto py-2.5 border-dashed border-slate-700 rounded-lg text-slate-400 text-xs font-medium hover:border-amber-500 hover:text-amber-400 hover:bg-amber-500/5 transition-all flex items-center justify-center gap-2 bg-transparent">
                            <Plus className="w-4 h-4" /> Thêm chương mới
                        </Button>
                    </div>
                </aside>

                <main className="flex-1 overflow-y-auto bg-[#010816] p-6 md:p-8">
                    <div className="max-w-4xl mx-auto space-y-8 pb-24">
                        <div className="space-y-4">
                            <nav className="flex items-center text-xs font-medium text-slate-500">
                                <span className="hover:text-slate-300 cursor-pointer">Chương 1</span>
                                <span className="mx-2 text-slate-700">/</span>
                                <span className="text-indigo-300 bg-indigo-500/10 px-2 py-0.5 rounded uppercase tracking-wide">Bài 1.1</span>
                            </nav>
                            <div className="group relative">
                                <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1">Tiêu đề bài học</label>
                                <input className="w-full bg-transparent border-0 border-b-2 border-slate-700 text-3xl font-bold text-white focus:border-indigo-500 focus:ring-0 px-0 py-2 placeholder-slate-700 transition-colors"
                                    defaultValue="Tổng quan về ngôn ngữ lập trình Python" />
                            </div>
                        </div>

                        <div className="border-b border-slate-800">
                            <nav className="-mb-px flex gap-6">
                                {([['content', 'Nội dung', FileText], ['settings', 'Cài đặt', Save], ['preview', 'Xem trước', Globe]] as const).map(([key, label, Icon]) => (
                                    <Button variant="ghost" key={key} onClick={() => setActiveTab(key)}
                                        className={`flex items-center h-auto gap-2 pb-3 px-1 border-b-2 rounded-none text-sm font-medium transition-colors ${activeTab === key ? 'border-amber-500 text-amber-400 hover:text-amber-300' : 'border-transparent text-slate-400 hover:text-slate-200 hover:border-slate-600 bg-transparent'}`}>
                                        <Icon className="w-4 h-4" /> {label}
                                    </Button>
                                ))}
                            </nav>
                        </div>

                        {activeTab === 'content' && (
                            <div className="space-y-6">
                                <section className="bg-[#0B1120] rounded-xl border border-slate-800/60 overflow-hidden shadow-xl">
                                    <div className="p-4 border-b border-slate-800 bg-[#0F1629]">
                                        <h3 className="font-bold text-white flex items-center gap-2 text-sm">
                                            <div className="p-1 bg-indigo-500/20 rounded text-indigo-300"><BookOpen className="w-4 h-4" /></div>
                                            Nội dung bài học
                                        </h3>
                                    </div>
                                    <div className="px-2 py-2 border-b border-slate-800 flex flex-wrap gap-1 bg-[#131b2e]">
                                        <select className="bg-transparent text-slate-300 text-xs border-none focus:ring-0 cursor-pointer hover:bg-white/5 rounded px-2 py-1">
                                            {['Paragraph', 'Heading 1', 'Heading 2'].map(o => <option key={o}>{o}</option>)}
                                        </select>
                                        <div className="w-px h-5 bg-slate-700 mx-1 my-auto" />
                                        {['B', 'I', 'U'].map(f => (
                                            <Button variant="ghost" size="icon" key={f} className="h-6 w-6 text-slate-400 hover:text-white hover:bg-white/10 rounded text-xs font-bold transition-colors">{f}</Button>
                                        ))}
                                    </div>
                                    <div className="p-6 min-h-[200px] text-slate-300 prose prose-invert prose-sm max-w-none bg-[#0B1120] focus:outline-none" contentEditable>
                                        <p>Chào mừng các bạn đến với khóa học <strong className="text-white">Lập trình Python cơ bản</strong>.</p>
                                        <p>Trong bài học này, chúng ta sẽ tìm hiểu về lịch sử hình thành và các đặc điểm nổi bật của Python.</p>
                                    </div>
                                </section>

                                <section className="bg-[#0B1120] rounded-xl border border-slate-800/60 overflow-hidden shadow-xl">
                                    <div className="p-4 border-b border-slate-800 bg-[#0F1629] flex justify-between items-center">
                                        <h3 className="font-bold text-white flex items-center gap-2 text-sm">
                                            <div className="p-1 bg-green-900/30 rounded text-green-400"><Code className="w-4 h-4" /></div>
                                            Bài tập Code
                                        </h3>
                                        <div className="flex items-center gap-2">
                                            <label className="text-[10px] text-slate-500 font-semibold uppercase">Ngôn ngữ:</label>
                                            <select value={selectedLang} onChange={e => setSelectedLang(e.target.value)} className="bg-slate-900 border-slate-700 text-slate-300 text-xs rounded py-1 pl-2 pr-6 focus:ring-indigo-500 focus:border-indigo-500">
                                                {LANGUAGES.map(l => <option key={l}>{l}</option>)}
                                            </select>
                                        </div>
                                    </div>
                                    <div className="grid grid-cols-1 lg:grid-cols-2 h-60 divide-y lg:divide-y-0 lg:divide-x divide-slate-800">
                                        <div className="bg-[#1e1e1e] p-4 font-mono text-xs overflow-auto">
                                            <div className="flex justify-between mb-2 pb-2 border-b border-slate-800 text-[10px] text-slate-500 uppercase font-bold tracking-wider">
                                                <span>Starter Code</span><span>main.py</span>
                                            </div>
                                            <div className="text-slate-500 italic"># Code mẫu cho học viên bắt đầu</div>
                                            <div className="text-indigo-300 mt-1">def <span className="text-yellow-200">hello_world</span>():</div>
                                            <div className="pl-4 text-slate-400 italic">    # Viết code của bạn ở đây</div>
                                            <div className="pl-4 text-blue-400">    pass</div>
                                        </div>
                                        <div className="bg-[#1e1e1e] p-4 font-mono text-xs overflow-auto">
                                            <div className="flex justify-between mb-2 pb-2 border-b border-slate-800 text-[10px] text-slate-500 uppercase font-bold tracking-wider">
                                                <span>Unit Tests (Hidden)</span><span>tests.py</span>
                                            </div>
                                            <div className="text-slate-500 italic"># Kiểm tra kết quả</div>
                                            <div className="text-indigo-300 mt-1">def <span className="text-yellow-200">test_hello</span>():</div>
                                            <div className="pl-4 text-indigo-300">    assert <span className="text-yellow-200">hello_world</span>() == <span className="text-green-400">"Hello World"</span></div>
                                        </div>
                                    </div>
                                </section>

                                <section className="bg-[#0B1120] rounded-xl border border-slate-800/60 overflow-hidden shadow-xl">
                                    <div className="p-4 border-b border-slate-800 bg-[#0F1629] flex justify-between items-center">
                                        <h3 className="font-bold text-white flex items-center gap-2 text-sm">
                                            <div className="p-1 bg-pink-900/30 rounded text-pink-400"><CheckCircle className="w-4 h-4" /></div>
                                            Câu hỏi trắc nghiệm
                                        </h3>
                                        <Button variant="outline" className="h-auto text-xs bg-indigo-500/10 hover:bg-indigo-500/20 text-indigo-300 border-indigo-500/20 px-3 py-1.5 rounded-full font-medium transition-colors flex items-center gap-1">
                                            <Plus className="w-3 h-3" /> Thêm câu hỏi
                                        </Button>
                                    </div>
                                    <div className="p-5 bg-[#0B1120]">
                                        <div className="bg-slate-900/50 p-4 rounded-lg border border-slate-700/50 hover:border-slate-600 transition-colors group">
                                            <div className="flex justify-between mb-3">
                                                <span className="text-[10px] font-bold text-slate-400 bg-slate-800 px-2 py-1 rounded border border-slate-700">CÂU HỎI 1</span>
                                                <Button variant="ghost" size="icon" className="h-6 w-6 text-slate-500 hover:text-red-400 opacity-0 group-hover:opacity-100 transition-opacity"><Trash2 className="w-4 h-4" /></Button>
                                            </div>
                                            <input className="w-full bg-slate-800 border-slate-700 rounded-md text-white text-sm px-3 py-2 mb-4 focus:ring-indigo-500 focus:border-indigo-500" defaultValue="Ai là người tạo ra ngôn ngữ Python?" />
                                            <div className="space-y-2">
                                                {['Guido van Rossum ✓', 'Brendan Eich', 'James Gosling'].map((opt, i) => (
                                                    <div key={opt} className="flex items-center gap-3">
                                                        <input type="radio" name="q1" defaultChecked={i === 0} className="h-4 w-4 text-green-500 bg-slate-800 border-slate-600" />
                                                        <input className={`flex-1 bg-transparent border-0 border-b text-sm px-0 py-1 focus:ring-0 ${i === 0 ? 'border-green-500/50 text-green-400' : 'border-slate-700 text-slate-300 focus:border-indigo-500'}`} defaultValue={i === 0 ? 'Guido van Rossum' : opt} />
                                                    </div>
                                                ))}
                                                <Button variant="link" className="h-auto p-0 text-xs text-indigo-400 hover:text-indigo-300 flex items-center gap-1 mt-2 font-medium"><Plus className="w-3 h-3" /> Thêm đáp án</Button>
                                            </div>
                                        </div>
                                    </div>
                                </section>
                            </div>
                        )}

                        {activeTab === 'settings' && (
                            <div className="bg-[#0B1120] rounded-xl border border-slate-800 p-6">
                                <h3 className="text-white font-bold mb-4">Cài đặt khóa học</h3>
                                <p className="text-slate-400 text-sm">Các tùy chọn cài đặt khóa học sẽ hiển thị ở đây.</p>
                            </div>
                        )}

                        {activeTab === 'preview' && (
                            <div className="bg-[#0B1120] rounded-xl border border-slate-800 p-6 text-center">
                                <Globe className="w-10 h-10 text-slate-600 mx-auto mb-3" />
                                <p className="text-slate-400">Xem trước nội dung sẽ hiển thị ở đây.</p>
                            </div>
                        )}
                    </div>
                </main>
            </div>
        </div>
    );
}
