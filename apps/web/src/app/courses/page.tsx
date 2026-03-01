"use client";

import { MainLayout } from "@/components/layouts/MainLayout";
import { CourseCard } from "@/components/features/courses/CourseCard";
import { Search, Filter, Sparkles, Code2 } from "lucide-react";
import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { createClient } from "@/lib/supabase/client";
import type { Tables } from "@/lib/supabase/database.types";

type CourseWithCategory = Tables<'courses'> & {
    categories: { name: string } | null;
};

export default function CoursesPage() {
    const [activeFilter, setActiveFilter] = useState("Tất cả");
    const [searchQuery, setSearchQuery] = useState("");
    const [courses, setCourses] = useState<CourseWithCategory[]>([]);
    const [categories, setCategories] = useState<Tables<'categories'>[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const supabase = createClient();

        async function fetchData() {
            setLoading(true);

            // Fetch categories
            const { data: cats } = await supabase
                .from('categories')
                .select('*')
                .order('sort_order');

            if (cats) setCategories(cats);

            // Fetch courses with category name
            const { data: coursesData } = await supabase
                .from('courses')
                .select('*, categories(name)')
                .eq('status', 'published')
                .order('created_at', { ascending: false });

            if (coursesData) setCourses(coursesData as CourseWithCategory[]);
            setLoading(false);
        }

        fetchData();
    }, []);

    // Filter by category and search
    const filteredCourses = courses.filter(c => {
        const matchesCategory = activeFilter === "Tất cả"
            || c.categories?.name === activeFilter;
        const matchesSearch = searchQuery === ""
            || c.title.toLowerCase().includes(searchQuery.toLowerCase())
            || c.short_description?.toLowerCase().includes(searchQuery.toLowerCase());
        return matchesCategory && matchesSearch;
    });

    const categoryNames = ["Tất cả", ...categories.map(c => c.name)];

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
                        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass border border-amber-500/30 font-medium text-sm text-amber-300 mb-6 shadow-glow">
                            <Sparkles className="w-4 h-4" />
                            <span>Hơn {courses.length}+ khóa học chất lượng cao</span>
                        </div>
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
                        className="mt-12 glass rounded-2xl p-4 border border-white/10 shadow-2xl flex flex-col md:flex-row gap-4 max-w-4xl mx-auto"
                    >
                        <div className="relative grow">
                            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                <Search className="h-5 w-5 text-slate-500" />
                            </div>
                            <input
                                type="text"
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                placeholder="Tìm kiếm khóa học (ví dụ: React, Node.js...)"
                                className="block w-full pl-11 pr-4 py-3 bg-navy-950/50 border border-slate-700 rounded-xl text-slate-200 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500 transition-all"
                            />
                        </div>

                        <button className="flex items-center justify-center gap-2 px-6 py-3 bg-navy-800 hover:bg-navy-700 border border-slate-700 rounded-xl text-white font-medium transition-all md:w-auto w-full group">
                            <Filter className="w-5 h-5 group-hover:text-amber-400 transition-colors" />
                            Bộ lọc
                        </button>
                    </motion.div>

                    {/* Categories Tab */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.2 }}
                        className="mt-8 flex flex-wrap justify-center gap-2 max-w-4xl mx-auto"
                    >
                        {categoryNames.map((cat) => (
                            <button
                                key={cat}
                                onClick={() => setActiveFilter(cat)}
                                className={`px-5 py-2 rounded-full text-sm font-medium transition-all ${activeFilter === cat
                                        ? "bg-indigo-600 text-white shadow-glow-indigo border border-indigo-500"
                                        : "glass text-slate-400 hover:text-white hover:bg-white/10 border border-slate-700/50"
                                    }`}
                            >
                                {cat}
                            </button>
                        ))}
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
