import Link from "next/link";
import { Code2, Github, Twitter, Linkedin, Heart } from "lucide-react";

export function Footer() {
    const currentYear = new Date().getFullYear();

    return (
        <footer className="bg-navy-950 border-t border-navy-800 pt-16 pb-8">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-12">
                    {/* Brand */}
                    <div className="col-span-1 md:col-span-1">
                        <Link href="/" className="flex items-center gap-2 mb-4 group">
                            <div className="w-8 h-8 rounded-lg bg-indigo-600 flex items-center justify-center">
                                <Code2 className="w-5 h-5 text-white" />
                            </div>
                            <span className="text-xl font-bold text-white tracking-tight">
                                Code<span className="text-amber-500">Mastery</span>
                            </span>
                        </Link>
                        <p className="text-slate-400 text-sm leading-relaxed mb-6">
                            Nền tảng học lập trình tương tác thông đại nhất với trợ lý ảo AI, giúp bạn làm chủ công nghệ từ con số không.
                        </p>
                        <div className="flex gap-4">
                            <a href="#" className="w-10 h-10 rounded-full bg-navy-800 flex items-center justify-center text-slate-400 hover:text-white hover:bg-indigo-600 transition-colors">
                                <Github className="w-5 h-5" />
                            </a>
                            <a href="#" className="w-10 h-10 rounded-full bg-navy-800 flex items-center justify-center text-slate-400 hover:text-white hover:bg-sky-500 transition-colors">
                                <Twitter className="w-5 h-5" />
                            </a>
                            <a href="#" className="w-10 h-10 rounded-full bg-navy-800 flex items-center justify-center text-slate-400 hover:text-white hover:bg-blue-600 transition-colors">
                                <Linkedin className="w-5 h-5" />
                            </a>
                        </div>
                    </div>

                    {/* Quick Links */}
                    <div>
                        <h3 className="text-white font-bold mb-4">Khám phá</h3>
                        <ul className="space-y-3">
                            <li>
                                <Link href="/courses" className="text-slate-400 hover:text-indigo-400 text-sm transition-colors">
                                    Khóa học Offline
                                </Link>
                            </li>
                            <li>
                                <Link href="/roadmap" className="text-slate-400 hover:text-indigo-400 text-sm transition-colors">
                                    Lộ trình học tập
                                </Link>
                            </li>
                            <li>
                                <Link href="/projects" className="text-slate-400 hover:text-indigo-400 text-sm transition-colors">
                                    Dự án thực tế
                                </Link>
                            </li>
                            <li>
                                <Link href="/leaderboard" className="text-slate-400 hover:text-indigo-400 text-sm transition-colors">
                                    Bảng xếp hạng
                                </Link>
                            </li>
                        </ul>
                    </div>

                    {/* Legal */}
                    <div>
                        <h3 className="text-white font-bold mb-4">Chính sách</h3>
                        <ul className="space-y-3">
                            <li>
                                <Link href="/terms" className="text-slate-400 hover:text-indigo-400 text-sm transition-colors">
                                    Điều khoản sử dụng
                                </Link>
                            </li>
                            <li>
                                <Link href="/privacy" className="text-slate-400 hover:text-indigo-400 text-sm transition-colors">
                                    Bảo mật thông tin
                                </Link>
                            </li>
                            <li>
                                <Link href="/refund" className="text-slate-400 hover:text-indigo-400 text-sm transition-colors">
                                    Chính sách hoàn tiền
                                </Link>
                            </li>
                        </ul>
                    </div>

                    {/* Contact */}
                    <div>
                        <h3 className="text-white font-bold mb-4">Liên hệ</h3>
                        <ul className="space-y-3 text-sm text-slate-400">
                            <li className="flex items-center gap-2">
                                <span className="w-2 h-2 rounded-full bg-indigo-500"></span>
                                hello@codemastery.vn
                            </li>
                            <li className="flex items-center gap-2">
                                <span className="w-2 h-2 rounded-full bg-indigo-500"></span>
                                +84 (0) 123 456 789
                            </li>
                            <li className="flex items-start gap-2 mt-4">
                                <span className="w-2 h-2 rounded-full bg-indigo-500 mt-1.5 flex-shrink-0"></span>
                                123 Đường Công Nghệ, Q.1,<br />TP. Hồ Chí Minh
                            </li>
                        </ul>
                    </div>
                </div>

                <div className="border-t border-navy-800 pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
                    <p className="text-slate-500 text-sm">
                        &copy; {currentYear} CodeMastery. All rights reserved.
                    </p>
                    <p className="text-slate-500 text-sm flex items-center gap-1">
                        Được xây dựng với <Heart className="w-4 h-4 text-red-500 fill-red-500 mx-1" /> bởi CodeMastery Team
                    </p>
                </div>
            </div>
        </footer>
    );
}
