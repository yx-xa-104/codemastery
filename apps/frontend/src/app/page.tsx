import { MainLayout } from "@/shared/components/layouts/MainLayout";
import { Hero } from "@/features/home/components/Hero";
import { CourseCard } from "@/features/courses/components/CourseCard";
import { Sparkles, ArrowRight } from "lucide-react";
import Link from "next/link";
import { Button } from "@/shared/components/ui/button";

export default async function HomePage() {
  let courses = [];
  try {
    const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001";
    const res = await fetch(`${API_URL}/api/courses?status=published`, { next: { revalidate: 60 } });
    if (res.ok) {
      courses = await res.json();
      courses = courses.slice(0, 6);
    }
  } catch (err) {
    console.error("Failed to fetch courses for homepage", err);
  }

  return (
    <MainLayout>
      <Hero />

      <section className="relative py-24 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">

          <div className="flex flex-col md:flex-row justify-between items-end mb-16 gap-6">
            <div>
              <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-xs font-bold uppercase tracking-wider text-indigo-400 mb-6 shadow-[0_0_15px_rgba(79,70,229,0.15)]">
                <Sparkles className="w-4 h-4 text-amber-400" /> Bắt đầu hành trình
              </div>
              <h2 className="text-4xl md:text-5xl font-extrabold text-white tracking-tight">
                Lộ trình của các <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-400 to-indigo-400">Chuyên gia</span>
              </h2>
              <p className="mt-4 text-lg text-slate-400 max-w-2xl font-light">
                Chọn khoá học phù hợp với cấp độ của bạn. CodeMastery cung cấp những dự án thực tế nhất giúp bạn tự tin ứng tuyển.
              </p>
            </div>
            <Link href="/courses">
                <Button className="hidden md:flex bg-[#0B1120]/50 hover:bg-indigo-600/20 text-indigo-300 font-bold py-2.5 px-6 rounded-xl border border-indigo-500/30 transition-all backdrop-blur-xl group">
                    Xem tất cả <ArrowRight className="ml-2 w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </Button>
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {(courses ?? []).map((course: any) => (
              <CourseCard
                key={course.id}
                title={course.title}
                category={course.category?.name ?? 'Khác'}
                level={course.level}
                duration={`${course.duration_hours ?? 0}h`}
                lessons={course.total_lessons ?? 0}
                image={course.thumbnail_url ?? ''}
                slug={course.slug}
                isHot={course.is_hot}
              />
            ))}
          </div>
          
          <div className="mt-10 flex justify-center md:hidden">
            <Link href="/courses">
                <Button className="bg-[#0B1120]/50 hover:bg-indigo-600/20 text-indigo-300 font-bold py-2.5 px-8 rounded-xl border border-indigo-500/30 transition-all backdrop-blur-xl">
                    Xem tất cả khoá học
                </Button>
            </Link>
          </div>

        </div>
      </section>
    </MainLayout>
  );
}
