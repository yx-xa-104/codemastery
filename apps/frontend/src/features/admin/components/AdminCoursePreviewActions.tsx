"use client";

import { useState } from "react";
import { CheckCircle2, XCircle, Loader2 } from "lucide-react";
import { Button } from "@/shared/components/ui/button";
import { apiClient } from "@/shared/lib/api-client";
import { useRouter } from "next/navigation";

export function AdminCoursePreviewActions({ courseId, currentStatus }: { courseId: string; currentStatus: string }) {
    const [loading, setLoading] = useState(false);
    const router = useRouter();

    const handleApprove = async () => {
        if (!confirm("Bạn có chắc chắn muốn duyệt khóa học này?")) return;
        setLoading(true);
        try {
            await apiClient.patch(`/api/admin/courses/${courseId}/approve`, {});
            alert("Đã duyệt khóa học thành công!");
            router.push("/admin/courses");
        } catch (error: any) {
            alert(`Lỗi duyệt khóa học: ${error.message}`);
        }
        setLoading(false);
    };

    const handleReject = async () => {
        const reason = prompt("Lý do từ chối (Gửi cho giảng viên):");
        if (!reason) return;
        setLoading(true);
        try {
            await apiClient.patch(`/api/admin/courses/${courseId}/reject`, { reason });
            alert("Đã từ chối khóa học!");
            router.push("/admin/courses");
        } catch (error: any) {
            alert(`Lỗi từ chối: ${error.message}`);
        }
        setLoading(false);
    };

    if (currentStatus !== "published") {
        return (
            <div className="fixed bottom-0 left-0 right-0 bg-slate-900 border-t border-slate-700 p-4 z-50 flex items-center justify-between shadow-2xl">
                <div className="max-w-7xl mx-auto w-full flex items-center justify-between px-4 sm:px-6 lg:px-8">
                    <div>
                        <h3 className="text-white font-bold text-lg">Chế độ xem trước (Admin)</h3>
                        <p className="text-sm text-slate-400">Khóa học này đang ở trạng thái: <span className="text-amber-400 font-mono">{currentStatus}</span></p>
                    </div>
                    <div className="flex items-center gap-3">
                        <Button 
                            variant="outline" 
                            className="bg-red-500/10 text-red-400 border-red-500/50 hover:bg-red-500/20"
                            onClick={handleReject}
                            disabled={loading}
                        >
                            <XCircle className="w-5 h-5 mr-2" />
                            Từ chối
                        </Button>
                        <Button 
                            className="bg-green-600 hover:bg-green-500 text-white"
                            onClick={handleApprove}
                            disabled={loading}
                        >
                            {loading ? <Loader2 className="w-5 h-5 mr-2 animate-spin" /> : <CheckCircle2 className="w-5 h-5 mr-2" />}
                            Phê duyệt ngay
                        </Button>
                    </div>
                </div>
            </div>
        );
    }

    return null;
}
