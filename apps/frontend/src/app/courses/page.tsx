"use client";

import { MainLayout } from "@/shared/components/layouts/MainLayout";
import { CourseCard } from "@/features/courses/components/CourseCard";
import { Search, Code2 } from "lucide-react";
import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { apiClient } from "@/shared/lib/api-client";
import { Button } from "@/shared/components/ui/button";

type Category = { name: string; sort_order: number };
type CourseWithCategory = {
    id: string;
    title: string;
    slug: string;
    short_description: string | null;
    thumbnail_url: string | null;
    level: 'beginner' | 'intermediate' | 'advanced';
    duration_hours: number | null;
    total_lessons: number | null;
    is_hot: boolean;
    categories: { name: string } | null;
};

const levelKeyMap: Record<string, string> = {
    "Cơ bản": "beginner",
    "Trung bình": "intermediate",
    "Nâng cao": "advanced",
};

export default function CoursesPage() {
    const [activeFilter, setActiveFilter] = useState("Tất cả");
    const [activeLevel, setActiveLevel] = useState("Tất cả");
    const [searchQuery, setSearchQuery] = useState("");
    const [courses, setCourses] = useState<CourseWithCategory[]>([]);
    const [categories, setCategories] = useState<Category[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function fetchData() {
            setLoading(true);
            try {
                // Fetch categories
                const cats = await apiClient.get<Category[]>('/api/courses/categories');
                setCategories(cats);

                // Fetch courses
                const coursesData = await apiClient.get<CourseWithCategory[]>('/api/courses?status=published');
                setCourses(coursesData);
            } catch (error) {
                console.error('Failed to fetch courses data:', error);
            } finally {
                setLoading(false);
            }
        }

        fetchData();
    }, []);

    // Filter by category, level, and search
    const filteredCourses = courses.filter(c => {
        const matchesCategory = activeFilter === "Tất cả"
            || c.categories?.name === activeFilter;
        const matchesLevel = activeLevel === "Tất cả"
            || c.level === levelKeyMap[activeLevel];
        const matchesSearch = searchQuery === ""
            || c.title.toLowerCase().includes(searchQuery.toLowerCase())
            || c.short_description?.toLowerCase().includes(searchQuery.toLowerCase());
        return matchesCategory && matchesLevel && matchesSearch;
    });

    const categoryNames = ["Tất cả", ...categories.map(c => c.name)];
    const levelNames = ["Tất cả", "Cơ bản", "Trung bình", "Nâng cao"];

    const levelButtonStyles: Record<string, { active: string; inactive: string }> = {
        "Tất cả": { active: "bg-indigo-600 hover:bg-indigo-500 text-white shadow-[#4f46e5_0_0_15px_-3px] border-indigo-500", inactive: "bg-white/5 backdrop-blur-md text-slate-400 hover:text-white hover:bg-white/10 border-slate-700/50" },
        "Cơ bản": { active: "bg-emerald-600 hover:bg-emerald-500 text-white shadow-[#059669_0_0_15px_-3px] border-emerald-500", inactive: "bg-white/5 backdrop-blur-md text-emerald-400/70 hover:text-emerald-300 hover:bg-emerald-500/10 border-emerald-500/20" },
        "Trung bình": { active: "bg-amber-600 hover:bg-amber-500 text-white shadow-[#d97706_0_0_15px_-3px] border-amber-500", inactive: "bg-white/5 backdrop-blur-md text-amber-400/70 hover:text-amber-300 hover:bg-amber-500/10 border-amber-500/20" },
        "Nâng cao": { active: "bg-rose-600 hover:bg-rose-500 text-white shadow-[#e11d48_0_0_15px_-3px] border-rose-500", inactive: "bg-white/5 backdrop-blur-md text-rose-400/70 hover:text-rose-300 hover:bg-rose-500/10 border-rose-500/20" },
    };

    return (
        <MainLayout>
            <div className="relative pt-12 pb-24">
                {/* Page Header */}
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-16 relative z-10">
                    <motion.div
                        initial={{ opacity: 0, y: -20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="text-center max-w-3xl mx-auto"
                    >

                        <h1 className="text-4xl md:text-5xl font-bold text-white tracking-tight mb-6">
                            Khám phá <span className="text-transparent bg-clip-text bg-linear-to-r from-indigo-400 to-amber-400">Khóa Học</span>
                        </h1>
                        <p className="text-lg text-slate-400">
                            Cập nhật những công nghệ mới nhất. Học qua các dự án thực tế với sự đồng hành của AI Tutor.
                        </p>
                    </motion.div>

                    {/* Search & Filter Bar */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.1 }}
                        className="mt-12 glass rounded-2xl p-4 border border-white/10 shadow-2xl max-w-4xl mx-auto"
                    >
                        <div className="relative">
                            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                <Search className="h-5 w-5 text-slate-500" />
                            </div>
                            <input
                                type="text"
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                placeholder="Tìm kiếm khóa học (ví dụ: React, Node.js...)"
                                className="block w-full pl-12 pr-4 py-3 bg-navy-950/50 border border-slate-700 rounded-xl text-slate-200 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500 transition-all"
                            />
                        </div>
                    </motion.div>

                    {/* Filter Groups */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.2 }}
                        className="mt-8 max-w-4xl mx-auto space-y-4"
                    >
                        {/* Category Filter */}
                        <div className="flex flex-wrap items-center gap-2">
                            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider mr-1 min-w-[60px]">Danh mục</span>
                            <select
                                value={activeFilter}
                                onChange={(e) => setActiveFilter(e.target.value)}
                                className="px-4 py-1.5 h-auto rounded-full text-xs font-medium bg-white/5 backdrop-blur-md text-slate-300 border border-slate-700/50 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500 transition-all cursor-pointer appearance-none pr-8 bg-[url('data:image/svg+xml;charset=UTF-8,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20width%3D%2212%22%20height%3D%2212%22%20viewBox%3D%220%200%2024%2024%22%20fill%3D%22none%22%20stroke%3D%22%2394a3b8%22%20stroke-width%3D%222%22%3E%3Cpolyline%20points%3D%226%209%2012%2015%2018%209%22%3E%3C%2Fpolyline%3E%3C%2Fsvg%3E')] bg-[position:right_10px_center] bg-no-repeat"
                            >
                                {categoryNames.map((cat) => (
                                    <option key={cat} value={cat} className="bg-navy-900 text-slate-200">
                                        {cat}
                                    </option>
                                ))}
                            </select>
                        </div>

                        {/* Level Filter */}
                        <div className="flex flex-wrap items-center gap-2">
                            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider mr-1 min-w-[60px]">Mức độ</span>
                            {levelNames.map((lvl) => (
                                <Button
                                    key={lvl}
                                    variant={activeLevel === lvl ? "default" : "outline"}
                                    onClick={() => setActiveLevel(lvl)}
                                    className={`px-4 py-1.5 h-auto rounded-full text-xs font-medium transition-all ${activeLevel === lvl
                                        ? levelButtonStyles[lvl].active
                                        : levelButtonStyles[lvl].inactive
                                        }`}
                                >
                                    {lvl}
                                </Button>
                            ))}
                        </div>
                    </motion.div>
                </div>

                {/* Course Grid */}
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
                    {loading ? (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                            {[...Array(6)].map((_, i) => (
                                <div key={i} className="rounded-2xl bg-navy-900/50 border border-white/5 h-96 animate-pulse" />
                            ))}
                        </div>
                    ) : (
                        <motion.div
                            layout
                            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
                        >
                            {filteredCourses.map((course) => (
                                <motion.div
                                    key={course.id}
                                    layout
                                    initial={{ opacity: 0, scale: 0.9 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    exit={{ opacity: 0, scale: 0.9 }}
                                    transition={{ duration: 0.3 }}
                                >
                                    <CourseCard
                                        title={course.title}
                                        category={course.categories?.name ?? 'Khác'}
                                        level={course.level}
                                        duration={`${course.duration_hours ?? 0}h`}
                                        lessons={course.total_lessons ?? 0}
                                        image={course.thumbnail_url ?? ''}
                                        slug={course.slug}
                                        isHot={course.is_hot}
                                    />
                                </motion.div>
                            ))}
                        </motion.div>
                    )}

                    {!loading && filteredCourses.length === 0 && (
                        <div className="text-center py-20">
                            <Code2 className="w-16 h-16 text-slate-700 mx-auto mb-4" />
                            <h3 className="text-xl font-bold text-white mb-2">Không tìm thấy khóa học</h3>
                            <p className="text-slate-400">Vui lòng thử lại với từ khóa hoặc danh mục khác.</p>
                        </div>
                    )}
                </div>
            </div>
        </MainLayout>
    );
}
