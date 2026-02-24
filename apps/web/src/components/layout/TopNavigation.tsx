'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useState } from 'react';
import { Menu, X } from 'lucide-react';

const menuItems = [
  { label: 'Danh sách khóa học', href: '/courses' },
  { label: 'Bài học', href: '/' },
  { label: 'Bài tập', href: '/exercises' },
];

export default function TopNavigation() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const pathname = usePathname();

  return (
    <nav className="h-16 bg-navy-950 border-b border-navy-700 flex items-center px-6 justify-between flex-shrink-0 z-20 shadow-md">
      {/* Left: Logo + Nav links */}
      <div className="flex items-center gap-8">
        <Link href="/" className="flex items-center gap-1 font-bold text-2xl tracking-tighter group">
          <span className="material-symbols-outlined text-indigo-400 text-3xl">code</span>
          <span className="text-white">
            Code<span className="text-indigo-400">Mastery</span>
          </span>
        </Link>

        <nav className="hidden md:flex gap-1 text-sm font-medium">
          {menuItems.map((item) => {
            const isActive = pathname === item.href || (item.href === '/' && pathname.startsWith('/lessons'));
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`px-4 py-2 rounded transition-colors ${
                  isActive
                    ? 'bg-indigo-600/20 text-indigo-300 border border-indigo-500/20'
                    : 'text-slate-400 hover:bg-indigo-600/10 hover:text-indigo-300'
                }`}
              >
                {item.label}
              </Link>
            );
          })}
        </nav>
      </div>

      {/* Right: User avatar + mobile toggle */}
      <div className="flex items-center gap-4">
        <Link
          href="/profile"
          className="w-9 h-9 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white text-xs font-bold cursor-pointer hover:ring-2 hover:ring-indigo-400 transition-all shadow-lg"
        >
          VN
        </Link>

        {/* Mobile toggle */}
        <button
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="md:hidden text-slate-400 hover:text-white transition-colors"
        >
          {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </div>

      {/* Mobile menu */}
      {mobileMenuOpen && (
        <div className="absolute top-16 left-0 right-0 bg-navy-950 border-b border-navy-700 md:hidden z-30">
          {menuItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="block px-6 py-3 text-slate-300 hover:text-indigo-300 hover:bg-navy-800 transition-colors"
              onClick={() => setMobileMenuOpen(false)}
            >
              {item.label}
            </Link>
          ))}
        </div>
      )}
    </nav>
  );
}
