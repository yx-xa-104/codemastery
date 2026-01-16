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
    <div className="min-h-screen bg-midnight-900">
      {/* Top Navigation */}
      <TopNavigation />

      {/* 3-Column Layout */}
      <div className="grid grid-cols-[280px_1fr_380px] h-screen pt-[73px]">
        {/* Left Sidebar - Lessons */}
        <aside className="border-r border-indigo-700/30 bg-midnight-800 overflow-hidden">
          {sidebar}
        </aside>

        {/* Main Content - Center */}
        <main className="overflow-y-auto bg-midnight-900">
          <div className="max-w-4xl mx-auto p-8">{children}</div>
        </main>

        {/* Right Panel - AI Chat */}
        <aside className="border-l border-amber-700/20 bg-midnight-800 overflow-hidden glow-border">
          {aiPanel}
        </aside>
      </div>
    </div>
  );
}
