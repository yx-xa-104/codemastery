import Link from 'next/link';
import { Clock, BookOpen, ArrowRight } from 'lucide-react';
import Image from 'next/image';

interface CourseCardProps {
  title: string;
  category: string;
  level: 'Cơ bản' | 'Trung bình' | 'Nâng cao';
  duration: string;
  lessons: number;
  image: string;
  progress?: number; // Optional progress percentage
  slug: string;
}

export function CourseCard({
  title,
  category,
  level,
  duration,
  lessons,
  image,
  progress,
  slug,
}: CourseCardProps) {
  return (
    <div className="group card-glass rounded-xl overflow-hidden flex flex-col h-full relative">
      <div className="h-48 relative overflow-hidden bg-gray-900 group-hover:opacity-95 transition-opacity">
        {/* Helper image container since we might not have real Next.js images configured for external domains yet, 
            using regular img tag for now if src is external url, or just fallback */}
        <img
          src={image}
          alt={title}
          className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-500"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#111827] via-transparent to-transparent"></div>
      </div>

      <div className="p-5 flex flex-col flex-grow">
        <div className="flex justify-between items-center mb-3">
          <span className="text-xs font-bold text-indigo-400 uppercase tracking-wide">
            {category}
          </span>
          <span className="px-2.5 py-1 rounded text-xs font-medium bg-indigo-900/50 text-indigo-200 border border-indigo-700/50">
            {level}
          </span>
        </div>

        <h3 className="text-xl font-bold text-white mb-2 line-clamp-2 group-hover:text-primary-light transition-colors">
          {title}
        </h3>

        <div className="grid grid-cols-2 gap-y-2 text-sm text-gray-400 mb-5">
          <div className="flex items-center">
            <Clock className="w-4 h-4 mr-1.5 text-indigo-500" />
            {duration}
          </div>
          <div className="flex items-center">
            <BookOpen className="w-4 h-4 mr-1.5 text-indigo-500" />
            {lessons} bài học
          </div>
        </div>

        <div className="mt-auto pt-4 border-t border-gray-800">
          {progress !== undefined ? (
            <div className="mb-3">
              <div className="flex justify-between text-xs text-gray-400 mb-1.5 font-medium">
                <span>Đã học</span>
                <span className="text-indigo-400">{progress}%</span>
              </div>
              <div className="w-full bg-gray-800 rounded-full h-1.5">
                <div
                  className="bg-primary h-1.5 rounded-full relative shadow-[0_0_8px_rgba(79,70,229,0.5)]"
                  style={{ width: `${progress}%` }}
                ></div>
              </div>
              <Link
                href={`/courses/${slug}`}
                className="mt-3 block w-full text-center py-2.5 rounded-lg bg-accent-gold hover:bg-accent-gold-hover text-white font-bold transition-all shadow-glow flex items-center justify-center gap-2"
              >
                Tiếp tục học
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          ) : (
            <Link
              href={`/courses/${slug}`}
              className="block w-full text-center py-2.5 rounded-lg bg-accent-gold hover:bg-accent-gold-hover text-white font-bold transition-all shadow-glow hover:shadow-lg hover:-translate-y-0.5"
            >
              Học ngay
            </Link>
          )}
        </div>
      </div>
    </div>
  );
}
