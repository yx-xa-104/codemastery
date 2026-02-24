import { ReactNode } from 'react';
import TopNavigation from './TopNavigation';

interface MainLayoutProps {
  sidebar: React.ReactNode;
  children: React.ReactNode;
  aiPanel: React.ReactNode;
}

export default function MainLayout({
  sidebar,
  children,
  aiPanel,
}: MainLayoutProps) {
  return (
    <div className="h-screen bg-navy-900 text-slate-300 font-sans overflow-hidden flex flex-col selection:bg-indigo-500/30 selection:text-indigo-200">
      {/* Fixed Top Navigation — h-16 */}
      <TopNavigation />

      {/* 3-Column Layout — fills remaining height */}
      <div className="flex flex-1 overflow-hidden">
        {/* Left Sidebar */}
        <aside className="w-72 bg-navy-800 border-r border-navy-700 flex-shrink-0 hidden md:flex flex-col overflow-hidden">
          {sidebar}
        </aside>

        {/* Center — Main Content */}
        <main className="flex-1 flex flex-col min-w-0 bg-navy-900 overflow-hidden">
          <div className="flex-1 overflow-y-auto navy-scroll px-8 pb-20">
            <div className="max-w-4xl mx-auto pt-8">
              {children}
            </div>
          </div>
        </main>

        {/* Right Panel — AI Chat */}
        <aside className="w-80 bg-navy-800 border-l border-navy-700 flex-shrink-0 hidden lg:flex flex-col overflow-hidden shadow-2xl">
          {aiPanel}
        </aside>
      </div>
    </div>
  );
}
