import { ReactNode } from 'react';

interface MainLayoutProps {
  children: ReactNode;
  sidebar?: ReactNode;
  aiPanel?: ReactNode;
  showAiPanel?: boolean;
}

export default function MainLayout({
  children,
  sidebar,
  aiPanel,
  showAiPanel = true,
}: MainLayoutProps) {
  return (
    <div className="flex h-screen overflow-hidden bg-gray-50 dark:bg-gray-900">
      {/* Left Sidebar - Navigation */}
      {sidebar && (
        <aside className="hidden lg:flex lg:flex-shrink-0">
          <div className="flex flex-col w-64 border-r border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-950">
            {sidebar}
          </div>
        </aside>
      )}

      {/* Main Content Area */}
      <main className="flex-1 overflow-y-auto focus:outline-none">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {children}
        </div>
      </main>

      {/* Right Panel - AI Assistant */}
      {showAiPanel && aiPanel && (
        <aside className="hidden xl:flex xl:flex-shrink-0">
          <div className="flex flex-col w-80 border-l border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-950">
            {aiPanel}
          </div>
        </aside>
      )}
    </div>
  );
}
