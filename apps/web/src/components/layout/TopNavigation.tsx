'use client';

import Link from 'next/link';
import { useState } from 'react';
import { Menu, X } from 'lucide-react';

export default function TopNavigation() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const menuItems = [
    { label: 'Tutorials', href: '/courses' },
    { label: 'Exercises', href: '/exercises' },
    { label: 'Certificates', href: '/certificates' },
  ];

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 glass-indigo border-b border-indigo-700/30">
      <div className="max-w-[1920px] mx-auto px-6 py-4">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2 group">
            <div className="text-2xl font-bold bg-gradient-to-r from-white via-indigo-300 to-indigo-500 bg-clip-text text-transparent">
              CodeMastery
            </div>
          </Link>

          {/* Desktop Menu */}
          <div className="hidden md:flex items-center gap-8">
            {menuItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="text-white font-medium hover:text-amber-500 transition-all duration-300 relative group"
              >
                {item.label}
                <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-gradient-amber group-hover:w-full transition-all duration-300"></span>
              </Link>
            ))}
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden text-white hover:text-amber-500 transition-colors"
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="md:hidden mt-4 pb-4 border-t border-indigo-700/30 pt-4">
            {menuItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="block py-3 text-white hover:text-amber-500 hover:bg-indigo-900/30 px-4 rounded-lg transition-all duration-300"
                onClick={() => setMobileMenuOpen(false)}
              >
                {item.label}
              </Link>
            ))}
          </div>
        )}
      </div>
    </nav>
  );
}
