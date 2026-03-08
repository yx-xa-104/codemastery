"use client";

import { useState, useEffect, useTransition } from "react";
import { apiClient } from "@/shared/lib/api-client";
import { Loader2, BookOpen, LogIn, LogOut, PlayCircle, Pin, PinOff } from "lucide-react";
import Link from "next/link";

interface EnrollButtonProps {
    courseId: string;
    courseSlug: string;
    firstLessonSlug?: string;
}

export function EnrollButton({ courseId, courseSlug, firstLessonSlug }: EnrollButtonProps) {
    const [enrollmentId, setEnrollmentId] = useState<string | null>(null);
    const [isPinned, setIsPinned] = useState(false);
    const [loading, setLoading] = useState(true);
    const [isPending, startTransition] = useTransition();

    useEffect(() => {
        checkStatus();
    }, [courseId]);

    const checkStatus = async () => {
        try {
            const data = await apiClient.get<{ enrollmentId: string | null }>(`/api/enrollments/courses/${courseId}/status`);
            setEnrollmentId(data.enrollmentId);
        } catch {
            setEnrollmentId(null);
        }

        // Always check pin status regardless of enrollment
        try {
            const pinned = await apiClient.get<any[]>(`/api/enrollments/pinned`);
            setIsPinned(pinned.some((p: any) => p.course_id === courseId));
        } catch { /* ignore */ }

        setLoading(false);
    };

    const handleEnroll = () => {
        startTransition(async () => {
            try {
                await apiClient.post(`/api/enrollments/${courseId}`, {});
                await checkStatus();
            } catch (err) {
                console.error("Enroll failed", err);
            }
        });
    };

    const handleUnenroll = () => {
        startTransition(async () => {
            try {
                await apiClient.delete(`/api/enrollments/${courseId}`);
                setEnrollmentId(null);
            } catch (err) {
                console.error("Unenroll failed", err);
            }
        });
    };

    const handleTogglePin = () => {
        startTransition(async () => {
            try {
                if (isPinned) {
                    await apiClient.delete(`/api/enrollments/pin/${courseId}`);
                    setIsPinned(false);
                } else {
                    await apiClient.post(`/api/enrollments/pin/${courseId}`, {});
                    setIsPinned(true);
                }
            } catch (err) {
                console.error("Pin toggle failed", err);
            }
        });
    };

    const pinButton = (
        <button
            onClick={handleTogglePin}
            disabled={isPending}
            className={`flex-1 py-2.5 rounded-xl text-sm font-medium flex items-center justify-center gap-2 transition-all border ${
                isPinned
                    ? "bg-amber-500/10 text-amber-400 border-amber-500/30 hover:bg-amber-500/20"
                    : "bg-slate-800/50 text-slate-400 border-slate-700 hover:border-slate-500 hover:text-white"
            }`}
        >
            {isPinned ? <PinOff className="w-4 h-4" /> : <Pin className="w-4 h-4" />}
            {isPinned ? "Bỏ ghim" : "Ghim"}
        </button>
    );

    if (loading) {
        return (
            <div className="w-full py-3.5 rounded-xl bg-slate-800/50 flex items-center justify-center">
                <Loader2 className="w-5 h-5 text-slate-400 animate-spin" />
            </div>
        );
    }

    // Already enrolled
    if (enrollmentId) {
        return (
            <div className="flex flex-col gap-3">
                <Link
                    href={firstLessonSlug ? `/lessons/${courseSlug}/${firstLessonSlug}` : `/courses/${courseSlug}`}
                    className="w-full py-3.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-semibold text-center transition-all shadow-glow-indigo flex items-center justify-center gap-2 group"
                >
                    <PlayCircle className="w-5 h-5" />
                    Tiếp tục học
                </Link>
                <div className="flex gap-2">
                    {pinButton}
                    <button
                        onClick={handleUnenroll}
                        disabled={isPending}
                        className="flex-1 py-2.5 rounded-xl bg-red-500/10 text-red-400 border border-red-500/30 text-sm font-medium flex items-center justify-center gap-2 hover:bg-red-500/20 transition-all"
                    >
                        {isPending ? <Loader2 className="w-4 h-4 animate-spin" /> : <LogOut className="w-4 h-4" />}
                        Hủy ghi danh
                    </button>
                </div>
            </div>
        );
    }

    // Not enrolled
    return (
        <div className="flex flex-col gap-3">
            <button
                onClick={handleEnroll}
                disabled={isPending}
                className="w-full py-3.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-semibold text-center transition-all shadow-glow-indigo flex items-center justify-center gap-2 group disabled:opacity-60"
            >
                {isPending ? (
                    <Loader2 className="w-5 h-5 animate-spin" />
                ) : (
                    <LogIn className="w-5 h-5" />
                )}
                Ghi danh khóa học
            </button>
            {pinButton}
        </div>
    );
}
