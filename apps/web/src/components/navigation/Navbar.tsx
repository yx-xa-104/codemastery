"use client";

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';
import { useState } from 'react';

export function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const pathname = usePathname();

  const navLinks = [
    { name: 'Hướng dẫn', href: '/guides' },
    { name: 'Bài tập', href: '/practice' },
    { name: 'Lộ trình', href: '/roadmap' },
    { name: 'Danh sách khóa học', href: '/courses' },
  ];

  return (
    <nav className="sticky top-0 z-40 w-full bg-[#010816]/95 backdrop-blur-md border-b border-indigo-900/30">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <Link href="/" className="flex-shrink-0 flex items-center group">
              <span className="text-2xl font-bold tracking-tighter text-white group-hover:text-primary-light transition-colors">
                Code<span className="text-primary">Mastery</span>
              </span>
            </Link>
            <div className="hidden sm:ml-10 sm:flex sm:space-x-8">
              {navLinks.map((link) => (
                <Link
                  key={link.name}
                  href={link.href}
                  className={cn(
                    'nav-link inline-flex items-center px-1 pt-1 text-sm font-medium border-transparent transition-colors',
                    pathname === link.href 
                      ? 'active-link text-white' 
                      : 'text-gray-300 hover:text-primary-light'
                  )}
                >
                  {link.name}
                </Link>
              ))}
            </div>
          </div>
          <div className="flex items-center space-x-4">
            <Link href="/profile" className="w-9 h-9 rounded-full bg-gradient-to-br from-primary to-indigo-700 flex items-center justify-center text-white font-bold ring-2 ring-indigo-400/30 shadow-lg hidden sm:flex">
              H
            </Link>
            <div className="-mr-2 flex items-center sm:hidden">
              <button
                onClick={() => setIsOpen(!isOpen)}
                className="inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-white hover:bg-indigo-900/50 focus:outline-none"
              >
                <span className="material-symbols-outlined">
                  {isOpen ? 'close' : 'menu'}
                </span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      {isOpen && (
        <div className="sm:hidden bg-[#010816] border-b border-indigo-900/30">
          <div className="pt-2 pb-3 space-y-1">
            {navLinks.map((link) => (
              <Link
                key={link.name}
                href={link.href}
                className={cn(
                  'block pl-3 pr-4 py-2 border-l-4 text-base font-medium',
                  pathname === link.href
                    ? 'bg-indigo-900/20 border-primary text-primary-light'
                    : 'border-transparent text-gray-300 hover:bg-gray-800 hover:border-gray-500 hover:text-white'
                )}
                onClick={() => setIsOpen(false)}
              >
                {link.name}
              </Link>
            ))}
          </div>
        </div>
      )}
    </nav>
  );
}
