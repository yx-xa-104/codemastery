import { ReactNode } from "react";
import { Navbar } from "./Navbar";
import { Footer } from "./Footer";
import { GlobalAiChat } from "@/modules/ai/components/GlobalAiChat";

interface MainLayoutProps {
    children: ReactNode;
    showFooter?: boolean;
    /** Hide the global AI chat FAB (e.g. on the dedicated /ai/chat page) */
    hideAiChat?: boolean;
}

export function MainLayout({ children, showFooter = true, hideAiChat = false }: MainLayoutProps) {
    return (
        <div className="flex flex-col min-h-screen bg-navy-950 dark:bg-navy-950 font-sans">
            <Navbar />
            <main className="flex-grow pt-16 relative z-10 flex flex-col">
                {children}
            </main>
            {showFooter && <Footer />}
            {!hideAiChat && <GlobalAiChat />}
        </div>
    );
}
