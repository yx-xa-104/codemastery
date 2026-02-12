import { Navbar } from '@/components/navigation/Navbar';
import { Hero } from '@/components/home/Hero';
import { CourseCard } from '@/components/courses/CourseCard';
import { Footer } from '@/components/layout/Footer';
import { LayoutGrid, List } from 'lucide-react';

export default function HomePage() {
  const courses = [
    {
      title: 'Thành thạo xây dựng giao diện Website chuẩn Responsive',
      category: 'Frontend',
      level: 'Cơ bản',
      duration: '42h',
      lessons: 56,
      image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCjV5y1FKmH0_o_nvDgnzQZPVxswKS0mXOQqlU011V1SAtPUdpOisV9C8yE2JjZmm5v9G_YGBRV-0C2_6fBthbPugY69SohaaqxhZo6RinbZs2HR0CXE001hl7h5yNeFlID3Dy3fM1pN5RbBtymCFAj72gIMpO9mSLzWF8BwUBd6foegkiabSMKiqaVG8FvpYIZ9v0Tlp6bM-OJod_YJJ21V3HMYRq9Tj-tjKIv4vyrfK-eM7Dy8LoPmvldT2x__addM3GzQm816Bo',
      progress: 25,
      slug: 'html-css'
    },
    {
      title: 'JavaScript Nâng cao - ES6+ và Tư duy Lập trình',
      category: 'Web',
      level: 'Nâng cao',
      duration: '56h',
      lessons: 88,
      image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAKYuUzafF4TtOgsCTfNJwRXkTQv4RJGq6V0mJmSsiw4_E0aGWXd3HWDE5M32LUf4t_EcvfGvX6KlOUn1HmG499VONssQTAFxTAA0dmCWIBlcNGL6BCfV-Yp4dysmRmG5xLqoQBoa9bgS_kdTNY-2a2RbJwf4sgfLYItRLRydCqy_w4ifETMmuCWUSgpKewI76Q67XmEOcQMxdfnyQIHmyt0xfgbyVentpn9r4gvvv051IB4Gv0hW4AVW10cFD57t8D1tsx5fWUcVg',
      slug: 'javascript-advanced'
    },
    {
      title: 'Xây dựng Single Page Apps với ReactJS Hooks & Redux',
      category: 'Frontend',
      level: 'Trung bình',
      duration: '38h',
      lessons: 52,
      image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCI6_CpAZLR2tmHg7Svgh3zsi62Nj_c_OaDIRj97Y6bfYoscKm69n_4DSvu96OBQb6lvzLiUuoXDrURBrv_8U1fIVPmnNkfEfRyppX2xg3JW16lCPiYqKb1z1tHrcnafNplQTy2Hckce_ejFX3Ps8cJlConogHsInRb6_syHjF1mi1TkHWMOzR6ERD25cgg9BLthBc7i8Vb-hKJPtr92SusG4XcvQRXNjNVFv5rF7nfVnJMlYwYyYHmPhx_36jEPk5WnZn_xEgByTM',
      slug: 'reactjs'
    },
    {
      title: 'Lập trình Backend chuyên nghiệp với Node.js và Express',
      category: 'Backend',
      level: 'Nâng cao',
      duration: '45h',
      lessons: 62,
      image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCH7LT_-dKZvsD1BMTsIzPvtS56-9__oFrQNnVey9hqHgxjL40z8mWVufGrdzM_-IdoZQr92fTfzG_qqR6_g-K5sgYoY2kZ8sRld7x80JAtm4im_rh69XxcT-8p9W-ZYFON-4oNtS9nTEyAxQh71HlgmbSUtczJIi1Bu9OI-2r0Lg9QLRK9EbprdrKUqhh17vXzONK1HuV40frJVM5C3qtKqbkKOBqNd-GZAhfkfsfDo_mVXk4v9oiLpZq3pA14skUQKgkhx-piIBs',
      progress: 60,
      slug: 'nodejs'
    },
    {
      title: 'Python cho Khoa học Dữ liệu và Học Máy cơ bản',
      category: 'Data Science',
      level: 'Cơ bản',
      duration: '60h',
      lessons: 90,
      image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuD4vCnP5sEPFFqD8VYfZ-zVP_o_uGMUT0owfIRovn62Gm9pphFiLCAZWJOZuVoPfZJEsAK17gl-lmwyfNOKBk26YNNvVYfh9Py63JK9NawEHPPksscOB6ffby5jA3ZIKjpyGdnsO1gDTjUf02ZrEQnyY4WZxh6I6CV9iYGm5mkvg9vezu5j9kVIbEBx2zOvpYCOz-oEEUk4NbKe_oLeEpkpAZ-SWtql7-PfxYOTu6VH62elNkqu6P6IwXbTFcB_j-rZvpDLSyZG9qM',
      slug: 'python-datascience'
    },
    {
      title: 'Làm chủ SQL và Thiết kế Cơ sở dữ liệu quan hệ',
      category: 'Database',
      level: 'Trung bình',
      duration: '32h',
      lessons: 40,
      image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBJFsHv5Nbla09xvJXVZQ1PRsKI-Q0Sv3D4HOh7UovdgZE6ZwNspXPFdICJMAFZwmURoyQQHXCtAQ0VFJDj_XUqSV_9uAsg2HpN73Kj7f6Qb5RC5HxGzhIKWl9VhVFD3Y5UpMVtjNM9T4ftgto1gSImQYjCQVez5PsoBG-2bUIS27bdWlksKYJAh58ogwgIWqLYG0m_yjExYgNfmUCbI7ixim7zzwn0vimcjvihW9LM4exscTa9CjbxmF52UdIv5nbhzYAK3-rj2QM',
      slug: 'sql-mastery'
    }
  ] as const;

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <main className="flex-grow">
        <Hero />
        
        <div className="bg-[#0B1120] py-12 border-t border-indigo-900/20">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-end mb-8 border-b border-gray-800 pb-4">
              <h2 className="text-2xl font-bold text-white flex items-center">
                <span className="w-2 h-8 bg-accent-gold rounded-full mr-3"></span>
                Khóa học nổi bật
              </h2>
              <div className="flex gap-2">
                <button className="p-2 rounded-lg bg-[#1e293b] hover:bg-[#2d3b55] text-gray-400 hover:text-white transition-colors">
                  <LayoutGrid className="w-6 h-6" />
                </button>
                <button className="p-2 rounded-lg bg-transparent hover:bg-[#2d3b55] text-gray-500 hover:text-white transition-colors">
                  <List className="w-6 h-6" />
                </button>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {courses.map((course, index) => (
                <CourseCard
                  key={index}
                  {...course}
                />
              ))}
            </div>

            {/* Pagination */}
            <div className="mt-16 flex justify-center">
              <nav aria-label="Pagination" className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px">
                <a href="#" className="relative inline-flex items-center px-4 py-2 rounded-l-md border border-gray-700 bg-[#111827] text-sm font-medium text-gray-400 hover:bg-gray-800">
                  <span className="sr-only">Previous</span>
                  <svg className="h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                    <path fillRule="evenodd" d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                </a>
                <a href="#" aria-current="page" className="z-10 bg-primary border-primary text-white relative inline-flex items-center px-4 py-2 border text-sm font-medium">
                  1
                </a>
                <a href="#" className="bg-[#111827] border-gray-700 text-gray-400 hover:bg-gray-800 relative inline-flex items-center px-4 py-2 border text-sm font-medium">
                  2
                </a>
                <a href="#" className="bg-[#111827] border-gray-700 text-gray-400 hover:bg-gray-800 relative inline-flex items-center px-4 py-2 border text-sm font-medium">
                  3
                </a>
                <a href="#" className="relative inline-flex items-center px-4 py-2 rounded-r-md border border-gray-700 bg-[#111827] text-sm font-medium text-gray-400 hover:bg-gray-800">
                  <span className="sr-only">Next</span>
                  <svg className="h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                    <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
                  </svg>
                </a>
              </nav>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
