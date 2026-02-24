import { MainLayout } from "@/components/layouts/MainLayout";
import { Hero } from "@/components/features/home/Hero";
import { CourseCard } from "@/components/features/courses/CourseCard";
import { Sparkles } from "lucide-react";

export default function HomePage() {
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
            {courses.map((course, index) => (
              <CourseCard key={index} {...course} />
            ))}
          </div>

        </div>
      </section>
    </MainLayout>
  );
}
