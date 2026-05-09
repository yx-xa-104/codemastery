"use client";

import { useState, useEffect } from "react";
import { Bell, Loader2, X, Clock } from "lucide-react";
import { useWebPush } from "@/shared/hooks/useWebPush";
import { useAuthStore } from "@/shared/stores/useAuthStore";
import { Button } from "@/shared/components/ui/button";

export function PushNotificationPopup() {
    const { user } = useAuthStore();
    const { isSupported, isSubscribed, isSubscribing, permission, subscribe } = useWebPush();
    const [shouldShow, setShouldShow] = useState(false);
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
    }, []);

    useEffect(() => {
        if (!mounted || !user || !isSupported) return;

        // Nếu đã đăng ký hoặc bị chặn quyền thì không hiện
        if (isSubscribed || permission === "denied") {
            setShouldShow(false);
            return;
        }

        const today = new Date().toISOString().split("T")[0];
        const lastShown = localStorage.getItem("push_popup_last_shown");

        // Delay một chút để check isSubscribed từ service worker (tránh chớp tắt màn hình)
        const timer = setTimeout(() => {
            if (lastShown !== today) {
                setShouldShow(true);
            }
        }, 1500);

        return () => clearTimeout(timer);
    }, [mounted, user, isSupported, isSubscribed, permission]);

    const handleDismiss = () => {
        const today = new Date().toISOString().split("T")[0];
        localStorage.setItem("push_popup_last_shown", today);
        setShouldShow(false);
    };

    const handleSubscribe = async () => {
        const success = await subscribe();
        if (success) {
            setShouldShow(false); // Ẩn luôn popup nếu thành công
        }
    };

    if (!shouldShow) return null;

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-in fade-in duration-200">
            <div className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-md shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200 relative">
                
                {/* Nút đóng (X) ở góc phải */}
                <button 
                    onClick={handleDismiss}
                    className="absolute top-4 right-4 p-1 text-slate-400 hover:text-white bg-slate-800/50 hover:bg-slate-800 rounded-full transition-colors z-10"
                >
                    <X className="w-5 h-5" />
                </button>

                <div className="p-6">
                    <div className="w-16 h-16 bg-indigo-500/10 text-indigo-400 rounded-full flex items-center justify-center mx-auto mb-4 border border-indigo-500/20">
                        <Bell className="w-8 h-8" />
                    </div>
                    
                    <h3 className="text-xl font-bold text-white text-center mb-2">
                        Bật nhắc nhở học tập
                    </h3>
                    
                    <p className="text-slate-400 text-center text-sm mb-6 leading-relaxed">
                        Hơn <span className="text-indigo-400 font-semibold">80%</span> học viên giữ được chuỗi học tập đều đặn nhờ vào hệ thống nhắc nhở hằng ngày. Bạn có muốn bật tính năng này để không bỏ lỡ bài học nào không?
                    </p>

                    <div className="flex flex-col gap-3">
                        <Button
                            onClick={handleSubscribe}
                            disabled={isSubscribing}
                            className="w-full bg-indigo-600 hover:bg-indigo-500 text-white font-semibold py-2.5 rounded-xl transition-colors flex items-center justify-center gap-2"
                        >
                            {isSubscribing ? (
                                <Loader2 className="w-5 h-5 animate-spin" />
                            ) : (
                                <Bell className="w-5 h-5" />
                            )}
                            {isSubscribing ? "Đang xử lý..." : "Bật ngay"}
                        </Button>
                        
                        <Button
                            variant="ghost"
                            onClick={handleDismiss}
                            disabled={isSubscribing}
                            className="w-full text-slate-400 hover:text-white hover:bg-white/5 py-2.5 rounded-xl transition-colors font-medium flex items-center justify-center gap-2"
                        >
                            <Clock className="w-4 h-4" />
                            Để sau (Nhắc lại vào ngày mai)
                        </Button>
                    </div>
                </div>
            </div>
        </div>
    );
}
