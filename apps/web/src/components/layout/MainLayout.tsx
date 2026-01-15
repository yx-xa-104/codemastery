import { ReactNode } from 'react';

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
    <div className="min-h-screen bg-gray-50 dark:bg-slate-900">
      <div className="grid grid-cols-[280px_1fr_320px] h-screen">
        {/* Sidebar */}
        <aside className="border-r border-gray-200 dark:border-slate-700 bg-white dark:bg-slate-800 overflow-hidden">
          {sidebar}
        </aside>

        {/* Main Content */}
        <main className="overflow-y-auto bg-white dark:bg-slate-900">
          <div className="max-w-4xl mx-auto p-8">{children}</div>
        </main>

        {/* AI Panel */}
        <aside className="border-l border-gray-200 dark:border-slate-700 bg-gray-50 dark:bg-slate-800 overflow-hidden">
          {aiPanel}
        </aside>
      </div>
    </div>
  );
}
