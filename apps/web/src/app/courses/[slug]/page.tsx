"use client";

import { MainLayout } from "@/components/layouts/MainLayout";
import { BookOpen, CheckCircle2, Clock, PlayCircle, Star, Users, ArrowRight, Code2, ShieldCheck, Trophy, BadgeCheck } from "lucide-react";
import Link from "next/link";
import { motion } from "framer-motion";
import { use } from "react";

export default function CourseDetailPage({ params }: { params: Promise<{ slug: string }> }) {
    const { slug } = use(params);

    // Mock data based on the provided screenshot design
    const course = {
        title: 'JavaScript Nâng cao - ES6+, Async & Tư duy Functional',
        description: 'Nắm vững toàn bộ các concept cốt lõi của JavaScript hiện đại. Từ closures, prototypes đến thiết kế kiến trúc ứng dụng với functional programming và asynchronous patterns.',
        category: 'Web',
        level: 'Nâng cao',
        duration: '56h',
        lessons: 88,
        students: 12450,
        rating: 4.9,
        reviews: "2.4k",
        image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAKYuUzafF4TtOgsCTfNJwRXkTQv4RJGq6V0mJmSsiw4_E0aGWXd3HWDE5M32LUf4t_EcvfGvX6KlOUn1HmG499VONssQTAFxTAA0dmCWIBlcNGL6BCfV-Yp4dysmRmG5xLqoQBoa9bgS_kdTNY-2a2RbJwf4sgfLYItRLRydCqy_w4ifETMmuCWUSgpKewI76Q67XmEOcQMxdfnyQIHmyt0xfgbyVentpn9r4gvvv051IB4Gv0hW4AVW10cFD57t8D1tsx5fWUcVg',
        features: [
            'Hiểu sâu về Execution Context và Closure',
            'Làm chủ Asynchronous JavaScript (Promises, async/await)',
            'Design Patterns thực chiến trong JS',
            'Tư duy Functional Programming (Map, Filter, Reduce)',
            'Tối ưu hiệu năng ứng dụng Web',
            'Review code 1-1 cùng AI Tutor'
        ],
        modules: [
            {
                title: "Căn bản về JavaScript",
                lessons: [
                    { title: "Giới thiệu JavaScript", duration: "10:00", type: "video", slug: "intro" },
                    { title: "Biến và Kiểu dữ liệu", duration: "15:00", type: "interactive", slug: "variables" },
                    { title: "Vòng lặp For", duration: "20:00", type: "interactive", slug: "for-loop" },
                ]
            },
            {
                title: "ES6+ Features",
                lessons: [
                    { title: "Arrow Functions", duration: "12:00", type: "interactive", slug: "arrow-functions" },
                    { title: "Destructuring & Spread", duration: "18:00", type: "interactive", slug: "destructuring" },
                    { title: "Classes & Modules", duration: "25:00", type: "interactive", slug: "classes" },
                ]
            }
        ]
    };

    return (
        <MainLayout>
            <div className="relative">
                {/* Ambient gradient - full width matching topbar */}
                <div className="fixed top-0 left-0 right-0 h-[500px] bg-gradient-to-b from-indigo-900/15 to-transparent pointer-events-none z-0"></div>

                {/* Course Header Banner */}
                <section className="relative pt-12 pb-16 lg:pt-20 lg:pb-24 overflow-hidden border-b border-white/5 z-10">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

                        <Link href="/courses" className="inline-flex items-center text-indigo-400 hover:text-indigo-300 font-medium text-sm mb-6 transition-colors group">
                            <span className="text-slate-500 mr-2 group-hover:text-indigo-400">&larr;</span> Khóa học <span className="mx-2 text-slate-600">/</span> {course.category}
                        </Link>

                        <div className="max-w-4xl">
                            <div className="flex flex-wrap items-center gap-2 mb-6">
                                <span className="px-3 py-1 rounded-full bg-indigo-500/10 text-indigo-300 text-xs font-semibold border border-indigo-500/20">
                                    {course.category}
                                </span>
                                <span className="px-3 py-1 rounded-full bg-amber-500/10 text-amber-300 text-xs font-semibold border border-amber-500/20">
                                    {course.level}
                                </span>
                            </div>

                            <motion.h1
                                initial={{ opacity: 0, y: 15 }}
                                animate={{ opacity: 1, y: 0 }}
                                className="text-4xl md:text-5xl lg:text-5xl font-extrabold text-white tracking-tight mb-5 leading-[1.2]"
                            >
                                {course.title}
                            </motion.h1>

                            <p className="text-base lg:text-lg text-slate-400 mb-8 max-w-3xl leading-relaxed">
                                {course.description}
                            </p>

                            <div className="flex flex-wrap items-center gap-y-4 gap-x-8 text-sm text-slate-400 font-medium">
                                <div className="flex items-center gap-2">
                                    <Star className="w-5 h-5 text-amber-500 fill-amber-500" />
                                    <span className="text-white font-bold">{course.rating}</span>
                                    <span>({course.reviews} đánh giá)</span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <Users className="w-5 h-5 text-slate-400" />
                                    <span className="text-white font-bold">{course.students.toLocaleString()}</span>
                                    <span>học viên</span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <Clock className="w-5 h-5 text-indigo-400" />
                                    <span className="text-white font-bold">{course.duration}</span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <BookOpen className="w-5 h-5 text-emerald-400" />
                                    <span className="text-white font-bold">{course.lessons}</span>
                                    <span>bài học</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Main Content & Registration Sidebar */}
                <section className="py-12 lg:py-16 relative z-10 w-full overflow-hidden">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                        <div className="flex flex-col lg:flex-row gap-12 items-stretch relative">

                            {/* Left Content Column */}
                            <div className="w-full lg:w-[60%] space-y-12">

                                {/* What you will learn */}
                                <div className="p-8 rounded-3xl bg-navy-900/50 border border-slate-800/80 shadow-sm relative overflow-hidden">
                                    <div className="absolute top-0 right-0 p-8 opacity-5">
                                        <Code2 className="w-32 h-32" />
                                    </div>
                                    <h2 className="text-xl font-bold text-white mb-6 flex items-center gap-3 relative z-10">
                                        <BadgeCheck className="w-6 h-6 text-indigo-400" />
                                        Bạn sẽ học được gì?
                                    </h2>
                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 relative z-10">
                                        {course.features.map((feature, idx) => (
                                            <div key={idx} className="flex items-start gap-3">
                                                <div className="w-5 h-5 rounded-full bg-green-500/20 flex items-center justify-center flex-shrink-0 mt-0.5">
                                                    <CheckCircle2 className="w-4 h-4 text-green-500" />
                                                </div>
                                                <span className="text-slate-300 text-sm leading-relaxed">{feature}</span>
                                            </div>
                                        ))}
                                    </div>
                                </div>

                                {/* Course Syllabus */}
                                <div>
                                    <h2 className="text-xl font-bold text-white mb-6">Nội dung khóa học</h2>
                                    <div className="space-y-4">
                                        {course.modules.map((module, idx) => (
                                            <div key={idx} className="rounded-2xl overflow-hidden border border-slate-800/80 bg-navy-900/30">
                                                <div className="p-5 flex justify-between items-center bg-navy-900 border-b border-slate-800/80">
                                                    <h3 className="text-base font-bold text-slate-200">
                                                        <span className="text-indigo-400 font-semibold mr-2">Chương {idx + 1}:</span>
                                                        {module.title}
                                                    </h3>
                                                    <span className="text-xs font-medium text-slate-500 px-3 py-1 bg-navy-950 rounded-full">{module.lessons.length} bài học</span>
                                                </div>
                                                <div className="flex flex-col">
                                                    {module.lessons.map((lesson, lessonIdx) => (
                                                        <Link
                                                            key={lessonIdx}
                                                            href={`/lessons/${slug}/${lesson.slug}`}
                                                            className={`flex items-center justify-between p-4 transition-all group hover:bg-white/5 cursor-pointer ${lessonIdx !== module.lessons.length - 1 ? "border-b border-slate-800/50" : ""}`}
                                                        >
                                                            <div className="flex items-center gap-3 w-full pr-4">
                                                                <div className="w-8 h-8 rounded-full bg-navy-950 border border-slate-800 flex items-center justify-center flex-shrink-0 group-hover:bg-indigo-600/20 group-hover:border-indigo-500/30 transition-colors">
                                                                    {lesson.type === 'video' ? (
                                                                        <PlayCircle className="w-4 h-4 text-slate-400 group-hover:text-indigo-400 transition-colors" />
                                                                    ) : (
                                                                        <Code2 className="w-4 h-4 text-slate-400 group-hover:text-amber-400 transition-colors" />
                                                                    )}
                                                                </div>
                                                                <span className="text-slate-300 text-sm font-medium group-hover:text-white transition-colors truncate">
                                                                    {lessonIdx + 1}. {lesson.title}
                                                                </span>
                                                            </div>
                                                            <div className="flex items-center gap-4 flex-shrink-0">
                                                                <span className="text-xs text-slate-500 font-mono tracking-wide">{lesson.duration}</span>
                                                                <ArrowRight className="w-4 h-4 text-slate-600 opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 group-hover:text-indigo-400 transition-all duration-300" />
                                                            </div>
                                                        </Link>
                                                    ))}
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </div>

                            {/* Right Sticky Sidebar (Enrollment Card) */}
                            <div className="w-full lg:w-[40%] lg:sticky lg:top-24 mt-8 lg:mt-0 relative">
                                <div className="p-[1px] rounded-3xl bg-gradient-to-b from-indigo-500/30 to-slate-800/30 shadow-[0_0_40px_rgba(79,70,229,0.1)]">
                                    <div className="bg-navy-900 rounded-[23px] overflow-hidden flex flex-col h-full">

                                        {/* Thumbnail with overlay play */}
                                        <div className="relative h-[220px] w-full group cursor-pointer overflow-hidden bg-navy-950">
                                            <img src={course.image} alt={course.title} className="w-full h-full object-cover opacity-80 transition-transform duration-700 group-hover:scale-105 group-hover:opacity-100" />
                                            <div className="absolute inset-0 bg-navy-950/40 group-hover:bg-navy-950/20 transition-colors flex items-center justify-center">
                                                <div className="w-16 h-16 rounded-full bg-white/10 backdrop-blur-md border border-white/20 flex flex-col items-center justify-center group-hover:bg-indigo-600 group-hover:border-indigo-500 shadow-xl transition-all duration-300 group-hover:scale-110">
                                                    <PlayCircle className="w-8 h-8 text-white ml-1" />
                                                </div>
                                            </div>
                                        </div>

                                        {/* Enrollment Details */}
                                        <div className="p-6 md:p-8 flex flex-col gap-6">
                                            <div className="text-center">
                                                <div className="text-2xl font-bold text-white mb-1">Miễn phí trải nghiệm</div>
                                                <p className="text-sm text-slate-400">Đăng ký để học trước 1 chương</p>
                                            </div>

                                            <Link
                                                href={`/lessons/${slug}/${course.modules[0].lessons[0].slug}`}
                                                className="w-full py-3.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-semibold text-center transition-all shadow-glow-indigo flex items-center justify-center gap-2 group relative overflow-hidden"
                                            >
                                                <span className="relative z-10 flex items-center gap-2">
                                                    Vào học ngay
                                                    <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                                                </span>
                                            </Link>

                                            <div className="space-y-0 text-sm">
                                                <div className="flex justify-between items-center py-3 border-b border-slate-800/80">
                                                    <span className="text-slate-400 flex items-center gap-2"><ShieldCheck className="w-4 h-4" /> Cam kết</span>
                                                    <span className="font-medium text-slate-200">Hoàn tiền 100% 14 ngày</span>
                                                </div>
                                                <div className="flex justify-between items-center py-3 border-b border-slate-800/80">
                                                    <span className="text-slate-400 flex items-center gap-2"><Clock className="w-4 h-4" /> Truy cập</span>
                                                    <span className="font-medium text-slate-200">Trọn đời</span>
                                                </div>
                                                <div className="flex justify-between items-center py-3 border-b border-slate-800/80">
                                                    <span className="text-slate-400 flex items-center gap-2"><Trophy className="w-4 h-4" /> Chứng chỉ</span>
                                                    <span className="font-medium text-slate-200">Có, khi hoàn thành</span>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>

                        </div>
                    </div>
                </section>
            </div>
        </MainLayout>
    );
}
