import { ReactNode } from "react";
import { Navbar } from "./Navbar";
import { Footer } from "./Footer";
import { GlobalAiChat } from "@/features/ai/components/GlobalAiChat";
import { CommandPalette } from "@/shared/components/ui/CommandPalette";

interface MainLayoutProps {
    children: ReactNode;
    showFooter?: boolean;
    /** Hide the global AI chat FAB (e.g. on the dedicated /ai/chat page) */
    hideAiChat?: boolean;
}

export function MainLayout({ children, showFooter = true, hideAiChat = false }: MainLayoutProps) {
    return (
        <div className="flex flex-col min-h-screen bg-navy-950 font-sans text-slate-200 relative overflow-x-hidden">
            {/* Global Abstract Background */}
            <div className="fixed inset-0 pointer-events-none bg-[size:24px_24px] bg-[linear-gradient(to_right,#8080801a_1px,transparent_1px),linear-gradient(to_bottom,#8080801a_1px,transparent_1px)] z-0" />
            <div className="fixed top-[-10%] left-[-10%] w-[40%] h-[40%] bg-indigo-600/5 rounded-full blur-[120px] pointer-events-none z-0" />
            <div className="fixed bottom-[-10%] right-[-10%] w-[30%] h-[30%] bg-amber-500/5 rounded-full blur-[120px] pointer-events-none z-0" />

            <Navbar />
            <main className="grow pt-16 relative z-10 flex flex-col">
                {children}
            </main>
            {showFooter && <div className="relative z-10"><Footer /></div>}
            {!hideAiChat && <GlobalAiChat />}
            <CommandPalette />
        </div>
    );
}
