import Link from "next/link";
import { BookOpen, Compass, Trophy, Github, Mail } from "lucide-react";

const footerLinks = [
    {
        title: "Học tập",
        links: [
            { name: "Khóa học", href: "/courses", icon: BookOpen },
            { name: "Lộ trình", href: "/roadmap", icon: Compass },
            { name: "Xếp hạng", href: "/leaderboard", icon: Trophy },
        ],
    },
    {
        title: "Hỗ trợ",
        links: [
            { name: "Liên hệ", href: "/contact" },
            { name: "Điều khoản", href: "/terms" },
            { name: "Bảo mật", href: "/privacy" },
        ],
    },
];

export function Footer() {
    return (
        <footer className="relative z-10 border-t border-slate-800/60 bg-navy-950/80 backdrop-blur-sm">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
                    {/* Brand */}
                    <div className="sm:col-span-2 lg:col-span-2">
                        <Link href="/" className="flex items-center gap-2.5 group mb-4">
                            <div className="w-9 h-9 rounded-xl bg-linear-to-br from-indigo-500 to-indigo-700 flex items-center justify-center shadow-glow-indigo transition-transform group-hover:scale-105">
                                <span className="text-white font-bold text-lg">✦</span>
                            </div>
                            <span className="text-lg font-bold text-white tracking-tight font-heading">
                                Code<span className="text-amber-500">Mastery</span>
                            </span>
                        </Link>
                        <p className="text-sm text-slate-400 max-w-sm leading-relaxed">
                            Nền tảng học lập trình trực tuyến với AI hỗ trợ. Nâng cao kỹ năng coding của bạn mỗi ngày.
                        </p>
                        <div className="flex items-center gap-3 mt-4">
                            <a
                                href="https://github.com"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="p-2 rounded-lg text-slate-500 hover:text-white hover:bg-white/5 transition-colors"
                            >
                                <Github className="w-5 h-5" />
                            </a>
                            <a
                                href="mailto:contact@codemastery.dev"
                                className="p-2 rounded-lg text-slate-500 hover:text-white hover:bg-white/5 transition-colors"
                            >
                                <Mail className="w-5 h-5" />
                            </a>
                        </div>
                    </div>

                    {/* Link columns */}
                    {footerLinks.map((group) => (
                        <div key={group.title}>
                            <h3 className="text-sm font-semibold text-white mb-3">{group.title}</h3>
                            <ul className="space-y-2">
                                {group.links.map((link) => (
                                    <li key={link.name}>
                                        <Link
                                            href={link.href}
                                            className="text-sm text-slate-400 hover:text-white transition-colors"
                                        >
                                            {link.name}
                                        </Link>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    ))}
                </div>

                {/* Bottom bar */}
                <div className="mt-10 pt-6 border-t border-slate-800/60 flex flex-col sm:flex-row justify-between items-center gap-4">
                    <p className="text-xs text-slate-500">
                        © {new Date().getFullYear()} CodeMastery. All rights reserved.
                    </p>
                </div>
            </div>
        </footer>
    );
}
