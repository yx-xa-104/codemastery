import { MainLayout } from "@/components/layouts/MainLayout";
import { Hero } from "@/components/features/home/Hero";
import { CourseCard } from "@/components/features/courses/CourseCard";
import { Sparkles } from "lucide-react";
import { createClient } from "@/lib/supabase/server";

export default async function HomePage() {
  const supabase = await createClient();

  const { data: courses } = await supabase
    .from('courses')
    .select('id, title, slug, short_description, thumbnail_url, level, duration_hours, total_lessons, is_hot, categories(name)')
    .eq('status', 'published')
    .order('created_at', { ascending: false })
    .limit(6);

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
            {(courses ?? []).map((course) => (
              <CourseCard
                key={course.id}
                title={course.title}
                category={(course.categories as unknown as { name: string })?.name ?? 'Khác'}
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
