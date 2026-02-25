"use client";

import { MainLayout } from "@/components/layouts/MainLayout";
import { CourseCard } from "@/components/features/courses/CourseCard";
import { Search, Filter, Sparkles, BookOpen, Clock, Code2 } from "lucide-react";
import { useState } from "react";
import { motion } from "framer-motion";

export default function CoursesPage() {
    const [activeFilter, setActiveFilter] = useState("Tất cả");

    const categories = ["Tất cả", "Frontend", "Backend", "Web", "AI / Data", "Database"];

    const courses = [
        {
            title: 'Thành thạo xây dựng giao diện Website chuẩn Responsive 2026',
            category: 'Frontend',
            level: 'Cơ bản',
            duration: '42h',
            lessons: 56,
            image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCjV5y1FKmH0_o_nvDgnzQZPVxswKS0mXOQqlU011V1SAtPUdpOisV9C8yE2JjZmm5v9G_YGBRV-0C2_6fBthbPugY69SohaaqxhZo6RinbZs2HR0CXE001hl7h5yNeFlID3Dy3fM1pN5RbBtymCFAj72gIMpO9mSLzWF8BwUBd6foegkiabSMKiqaVG8FvpYIZ9v0Tlp6bM-OJod_YJJ21V3HMYRq9Tj-tjKIv4vyrfK-eM7Dy8LoPmvldT2x__addM3GzQm816Bo',
            progress: 25,
            slug: 'html-css'
        },
        {
            title: 'JavaScript Nâng cao - ES6+, Async & Tư duy Functional',
            category: 'Web',
            level: 'Nâng cao',
            duration: '56h',
            lessons: 88,
            image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAKYuUzafF4TtOgsCTfNJwRXkTQv4RJGq6V0mJmSsiw4_E0aGWXd3HWDE5M32LUf4t_EcvfGvX6KlOUn1HmG499VONssQTAFxTAA0dmCWIBlcNGL6BCfV-Yp4dysmRmG5xLqoQBoa9bgS_kdTNY-2a2RbJwf4sgfLYItRLRydCqy_w4ifETMmuCWUSgpKewI76Q67XmEOcQMxdfnyQIHmyt0xfgbyVentpn9r4gvvv051IB4Gv0hW4AVW10cFD57t8D1tsx5fWUcVg',
            slug: 'javascript-advanced'
        },
        {
            title: 'Xây dựng Modern Web Apps với React 19 & Next.js 15',
            category: 'Frontend',
            level: 'Trung bình',
            duration: '38h',
            lessons: 52,
            image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCI6_CpAZLR2tmHg7Svgh3zsi62Nj_c_OaDIRj97Y6bfYoscKm69n_4DSvu96OBQb6lvzLiUuoXDrURBrv_8U1fIVPmnNkfEfRyppX2xg3JW16lCPiYqKb1z1tHrcnafNplQTy2Hckce_ejFX3Ps8cJlConogHsInRb6_syHjF1mi1TkHWMOzR6ERD25cgg9BLthBc7i8Vb-hKJPtr92SusG4XcvQRXNjNVFv5rF7nfVnJMlYwYyYHmPhx_36jEPk5WnZn_xEgByTM',
            slug: 'reactjs'
        },
        {
            title: 'Lập trình Backend chuyên nghiệp với Node.js Microservices',
            category: 'Backend',
            level: 'Nâng cao',
            duration: '45h',
            lessons: 62,
            image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCH7LT_-dKZvsD1BMTsIzPvtS56-9__oFrQNnVey9hqHgxjL40z8mWVufGrdzM_-IdoZQr92fTfzG_qqR6_g-K5sgYoY2kZ8sRld7x80JAtm4im_rh69XxcT-8p9W-ZYFON-4oNtS9nTEyAxQh71HlgmbSUtczJIi1Bu9OI-2r0Lg9QLRK9EbprdrKUqhh17vXzONK1HuV40frJVM5C3qtKqbkKOBqNd-GZAhfkfsfDo_mVXk4v9oiLpZq3pA14skUQKgkhx-piIBs',
            progress: 0,
            slug: 'nodejs'
        },
        {
            title: 'Khoa học Dữ liệu, Deep Learning & Xử lý AI Model',
            category: 'AI / Data',
            level: 'Cơ bản',
            duration: '60h',
            lessons: 90,
            image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuD4vCnP5sEPFFqD8VYfZ-zVP_o_uGMUT0owfIRovn62Gm9pphFiLCAZWJOZuVoPfZJEsAK17gl-lmwyfNOKBk26YNNvVYfh9Py63JK9NawEHPPksscOB6ffby5jA3ZIKjpyGdnsO1gDTjUf02ZrEQnyY4WZxh6I6CV9iYGm5mkvg9vezu5j9kVIbEBx2zOvpYCOz-oEEUk4NbKe_oLeEpkpAZ-SWtql7-PfxYOTu6VH62elNkqu6P6IwXbTFcB_j-rZvpDLSyZG9qM',
            slug: 'python-datascience'
        },
        {
            title: 'Làm chủ Database Tuning & System Design Architecture',
            category: 'Database',
            level: 'Trung bình',
            duration: '32h',
            lessons: 40,
            image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBJFsHv5Nbla09xvJXVZQ1PRsKI-Q0Sv3D4HOh7UovdgZE6ZwNspXPFdICJMAFZwmURoyQQHXCtAQ0VFJDj_XUqSV_9uAsg2HpN73Kj7f6Qb5RC5HxGzhIKWl9VhVFD3Y5UpMVtjNM9T4ftgto1gSImQYjCQVez5PsoBG-2bUIS27bdWlksKYJAh58ogwgIWqLYG0m_yjExYgNfmUCbI7ixim7zzwn0vimcjvihW9LM4exscTa9CjbxmF52UdIv5nbhzYAK3-rj2QM',
            slug: 'sql-mastery'
        }
    ] as const;

    const filteredCourses = activeFilter === "Tất cả"
        ? courses
        : courses.filter(c => c.category === activeFilter);

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
                            <span>Hơn 50+ khóa học chất lượng cao</span>
                        </div>
                        <h1 className="text-4xl md:text-5xl font-bold text-white tracking-tight mb-6">
                            Khám phá <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-amber-400">Khóa Học</span>
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
                        <div className="relative flex-grow">
                            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                <Search className="h-5 w-5 text-slate-500" />
                            </div>
                            <input
                                type="text"
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
                        {categories.map((cat) => (
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
                    <motion.div
                        layout
                        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
                    >
                        {filteredCourses.map((course, index) => (
                            <motion.div
                                key={course.slug}
                                layout
                                initial={{ opacity: 0, scale: 0.9 }}
                                animate={{ opacity: 1, scale: 1 }}
                                exit={{ opacity: 0, scale: 0.9 }}
                                transition={{ duration: 0.3 }}
                            >
                                <CourseCard {...course} />
                            </motion.div>
                        ))}
                    </motion.div>

                    {filteredCourses.length === 0 && (
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
