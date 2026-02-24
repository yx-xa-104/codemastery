"use client";

import { useState } from "react";
import { Bot, X } from "lucide-react";
import { AiChat } from "./AiChat";

interface AiChatDrawerProps {
    onToggle?: (isOpen: boolean) => void;
}

export function AiChatDrawer({ onToggle }: AiChatDrawerProps) {
    const [isOpen, setIsOpen] = useState(false);

    const toggle = (open: boolean) => {
        setIsOpen(open);
        onToggle?.(open);
    };

    return (
        <>
            {/* FAB Button - only visible when drawer is closed */}
            {!isOpen && (
                <button
                    onClick={() => toggle(true)}
                    className="fixed bottom-6 right-6 z-50 w-14 h-14 rounded-full bg-indigo-600 hover:bg-indigo-500 text-white shadow-xl shadow-indigo-600/30 flex items-center justify-center transition-all hover:scale-110 active:scale-95"
                    title="Hỏi AI Tutor"
                >
                    <Bot className="w-6 h-6" />
                    <span className="absolute top-0 right-0 w-3.5 h-3.5 bg-green-500 rounded-full border-2 border-navy-950"></span>
                </button>
            )}

            {/* Desktop: inline push panel | Mobile: full screen overlay */}
            {isOpen && (
                <>
                    {/* Desktop: inline panel that pushes content */}
                    <div className="hidden lg:flex w-[380px] h-full flex-shrink-0 border-l border-slate-800 bg-navy-950 flex-col">
                        <div className="flex items-center justify-between px-4 py-3 border-b border-slate-800 bg-navy-900 flex-shrink-0">
                            <div className="flex items-center gap-3">
                                <div className="w-9 h-9 rounded-full bg-indigo-600 flex items-center justify-center relative">
                                    <Bot className="w-5 h-5 text-white" />
                                    <div className="absolute -top-0.5 -right-0.5 w-3 h-3 bg-green-500 rounded-full border-2 border-navy-900"></div>
                                </div>
                                <div>
                                    <h3 className="font-bold text-white text-sm">AI Tutor</h3>
                                    <p className="text-xs text-slate-400">Trực tuyến</p>
                                </div>
                            </div>
                            <button
                                onClick={() => toggle(false)}
                                className="p-2 text-slate-400 hover:text-white hover:bg-white/10 rounded-lg transition-colors"
                            >
                                <X className="w-5 h-5" />
                            </button>
                        </div>
                        <div className="flex-1 overflow-hidden">
                            <AiChat embedded />
                        </div>
                    </div>

                    {/* Mobile: full screen panel */}
                    <div className="lg:hidden fixed inset-0 z-50 bg-navy-950 flex flex-col">
                        <div className="flex items-center justify-between px-4 py-3 border-b border-slate-800 bg-navy-900 flex-shrink-0">
                            <div className="flex items-center gap-3">
                                <div className="w-9 h-9 rounded-full bg-indigo-600 flex items-center justify-center relative">
                                    <Bot className="w-5 h-5 text-white" />
                                    <div className="absolute -top-0.5 -right-0.5 w-3 h-3 bg-green-500 rounded-full border-2 border-navy-900"></div>
                                </div>
                                <div>
                                    <h3 className="font-bold text-white text-sm">AI Tutor</h3>
                                    <p className="text-xs text-slate-400">Trực tuyến</p>
                                </div>
                            </div>
                            <button
                                onClick={() => toggle(false)}
                                className="p-2 text-slate-400 hover:text-white hover:bg-white/10 rounded-lg transition-colors"
                            >
                                <X className="w-5 h-5" />
                            </button>
                        </div>
                        <div className="flex-1 overflow-hidden">
                            <AiChat embedded />
                        </div>
                    </div>
                </>
            )}
        </>
    );
}
