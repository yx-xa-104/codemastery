import { ReactNode } from "react";
import { Navbar } from "./Navbar";
import { Footer } from "./Footer";

interface MainLayoutProps {
    children: ReactNode;
    showFooter?: boolean;
}

export function MainLayout({ children, showFooter = true }: MainLayoutProps) {
    return (
        <div className="flex flex-col min-h-screen bg-navy-950 dark:bg-navy-950 font-sans">
            <Navbar />
            <main className="flex-grow pt-16 relative z-10 flex flex-col">
                {children}
            </main>
            {showFooter && <Footer />}
        </div>
    );
}
