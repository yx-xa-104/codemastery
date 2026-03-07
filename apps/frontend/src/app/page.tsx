import { MainLayout } from "@/shared/components/layouts/MainLayout";
import { Hero } from "@/features/home/components/Hero";
import { CourseCard } from "@/features/courses/components/CourseCard";
import { Sparkles } from "lucide-react";

export default async function HomePage() {
  let courses = [];
  try {
    const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001";
    const res = await fetch(`${API_URL}/api/courses?status=published`, { next: { revalidate: 60 } });
    if (res.ok) {
      courses = await res.json();
      // Giới hạn 6 khóa học mới nhất
      courses = courses.slice(0, 6);
    }
  } catch (err) {
    console.error("Failed to fetch courses for homepage", err);
  }

  return (
    <MainLayout>
      <Hero />

      <section className="bg-navy-950 py-24 relative border-t border-white/5">
        <div className="absolute inset-0 bg-gradient-to-b from-navy-900/40 to-transparent pointer-events-none"></div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">

          <div className="flex flex-col md:flex-row justify-between items-end mb-12 gap-6">
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-xs font-semibold text-indigo-300 mb-4">
                <Sparkles className="w-4 h-4" /> Tuyển chọn tốt nhất
              </div>
              <h2 className="text-3xl md:text-4xl font-bold text-white tracking-tight">
                Lộ trình của các <span className="text-amber-500">Chuyên gia</span>
              </h2>
            </div>
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

        </div>
      </section>
    </MainLayout>
  );
}
