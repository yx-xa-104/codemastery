"use client";

import { useState, useEffect } from "react";
import { Star, Send, MessageSquare, Trash2, Edit3, X } from "lucide-react";
import { apiClient } from "@/shared/lib/api-client";
import { Button } from "@/shared/components/ui/button";

interface Review {
    id: string;
    user_id: string;
    course_id: string;
    rating: number;
    comment: string | null;
    created_at: string;
    profiles: {
        id: string;
        full_name: string | null;
        avatar_url: string | null;
    } | null;
}

interface CourseReviewsProps {
    courseId: string;
    isEnrolled: boolean;
}

function StarRating({
    value,
    onChange,
    readonly = false,
    size = "md",
}: {
    value: number;
    onChange?: (v: number) => void;
    readonly?: boolean;
    size?: "sm" | "md";
}) {
    const [hover, setHover] = useState(0);
    const sz = size === "sm" ? "w-4 h-4" : "w-6 h-6";

    return (
        <div className="flex gap-0.5">
            {[1, 2, 3, 4, 5].map((star) => (
                <button
                    key={star}
                    type="button"
                    disabled={readonly}
                    onClick={() => onChange?.(star)}
                    onMouseEnter={() => !readonly && setHover(star)}
                    onMouseLeave={() => !readonly && setHover(0)}
                    className={`${readonly ? "cursor-default" : "cursor-pointer"} transition-transform ${!readonly && "hover:scale-110"}`}
                >
                    <Star
                        className={`${sz} transition-colors ${
                            star <= (hover || value)
                                ? "text-amber-400 fill-amber-400"
                                : "text-slate-600"
                        }`}
                    />
                </button>
            ))}
        </div>
    );
}

function timeAgo(dateStr: string): string {
    const diff = Date.now() - new Date(dateStr).getTime();
    const mins = Math.floor(diff / 60000);
    if (mins < 1) return "vừa xong";
    if (mins < 60) return `${mins} phút trước`;
    const hours = Math.floor(mins / 60);
    if (hours < 24) return `${hours} giờ trước`;
    const days = Math.floor(hours / 24);
    if (days < 30) return `${days} ngày trước`;
    const months = Math.floor(days / 30);
    return `${months} tháng trước`;
}

export function CourseReviews({ courseId, isEnrolled }: CourseReviewsProps) {
    const [reviews, setReviews] = useState<Review[]>([]);
    const [loading, setLoading] = useState(true);
    const [rating, setRating] = useState(0);
    const [comment, setComment] = useState("");
    const [submitting, setSubmitting] = useState(false);
    const [editingId, setEditingId] = useState<string | null>(null);
    const [editRating, setEditRating] = useState(0);
    const [editComment, setEditComment] = useState("");
    const [myUserId, setMyUserId] = useState<string | null>(null);

    useEffect(() => {
        fetchReviews();
        fetchUserId();
    }, [courseId]);

    async function fetchUserId() {
        try {
            const { createClient } = await import("@/shared/lib/supabase/client");
            const supabase = createClient();
            const { data: { user } } = await supabase.auth.getUser();
            setMyUserId(user?.id ?? null);
        } catch { /* not logged in */ }
    }

    async function fetchReviews() {
        setLoading(true);
        try {
            const data = await apiClient.get<Review[]>(`/api/courses/${courseId}/reviews`);
            setReviews(data);
        } catch (err) {
            console.error("Failed to fetch reviews:", err);
        } finally {
            setLoading(false);
        }
    }

    const myReview = reviews.find((r) => r.user_id === myUserId);
    const canReview = isEnrolled && !myReview;

    async function handleSubmit(e: React.FormEvent) {
        e.preventDefault();
        if (rating === 0) return;
        setSubmitting(true);
        try {
            await apiClient.post(`/api/courses/${courseId}/reviews`, {
                rating,
                comment: comment.trim() || undefined,
            });
            setRating(0);
            setComment("");
            await fetchReviews();
        } catch (err) {
            console.error("Failed to submit review:", err);
        } finally {
            setSubmitting(false);
        }
    }

    async function handleUpdate(id: string) {
        if (editRating === 0) return;
        setSubmitting(true);
        try {
            await apiClient.patch(`/api/courses/reviews/${id}`, {
                rating: editRating,
                comment: editComment.trim() || undefined,
            });
            setEditingId(null);
            await fetchReviews();
        } catch (err) {
            console.error("Failed to update review:", err);
        } finally {
            setSubmitting(false);
        }
    }

    async function handleDelete(id: string) {
        if (!confirm("Bạn có chắc muốn xóa đánh giá này?")) return;
        try {
            await apiClient.delete(`/api/courses/reviews/${id}`);
            await fetchReviews();
        } catch (err) {
            console.error("Failed to delete review:", err);
        }
    }

    function startEdit(review: Review) {
        setEditingId(review.id);
        setEditRating(review.rating);
        setEditComment(review.comment ?? "");
    }

    // Stats
    const avgRating = reviews.length
        ? (reviews.reduce((s, r) => s + r.rating, 0) / reviews.length).toFixed(1)
        : "0.0";
    const ratingDist = [5, 4, 3, 2, 1].map((star) => ({
        star,
        count: reviews.filter((r) => r.rating === star).length,
        percent: reviews.length
            ? Math.round((reviews.filter((r) => r.rating === star).length / reviews.length) * 100)
            : 0,
    }));

    return (
        <div className="space-y-8">
            {/* Header & Stats */}
            <div className="flex flex-col md:flex-row gap-8">
                {/* Average */}
                <div className="flex flex-col items-center justify-center p-6 bg-navy-900/50 rounded-2xl border border-slate-800/80 min-w-[180px]">
                    <span className="text-5xl font-bold text-white">{avgRating}</span>
                    <StarRating value={Math.round(Number(avgRating))} readonly size="md" />
                    <span className="text-sm text-slate-400 mt-2">{reviews.length} đánh giá</span>
                </div>

                {/* Distribution */}
                <div className="flex-1 space-y-2">
                    {ratingDist.map(({ star, count, percent }) => (
                        <div key={star} className="flex items-center gap-3">
                            <span className="text-sm text-slate-400 w-6 text-right">{star}</span>
                            <Star className="w-3.5 h-3.5 text-amber-400 fill-amber-400" />
                            <div className="flex-1 h-2 bg-navy-950 rounded-full overflow-hidden">
                                <div
                                    className="h-full bg-amber-500 rounded-full transition-all"
                                    style={{ width: `${percent}%` }}
                                />
                            </div>
                            <span className="text-xs text-slate-500 w-8">{count}</span>
                        </div>
                    ))}
                </div>
            </div>

            {/* Write Review Form */}
            {canReview && (
                <form onSubmit={handleSubmit} className="p-6 bg-navy-900/50 rounded-2xl border border-slate-800/80 space-y-4">
                    <h3 className="text-white font-bold flex items-center gap-2">
                        <MessageSquare className="w-5 h-5 text-indigo-400" />
                        Viết đánh giá
                    </h3>
                    <div className="flex items-center gap-3">
                        <span className="text-sm text-slate-400">Đánh giá:</span>
                        <StarRating value={rating} onChange={setRating} />
                        {rating > 0 && (
                            <span className="text-xs text-amber-400 font-medium">
                                {["", "Rất tệ", "Tệ", "Bình thường", "Tốt", "Xuất sắc"][rating]}
                            </span>
                        )}
                    </div>
                    <textarea
                        value={comment}
                        onChange={(e) => setComment(e.target.value)}
                        placeholder="Chia sẻ trải nghiệm học tập của bạn... (tùy chọn)"
                        rows={3}
                        className="w-full bg-navy-950/50 border border-slate-700 rounded-xl px-4 py-3 text-sm text-slate-200 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500 transition-all resize-none"
                    />
                    <div className="flex justify-end">
                        <Button
                            type="submit"
                            disabled={rating === 0 || submitting}
                            className="bg-indigo-600 hover:bg-indigo-500 text-white px-6 py-2 rounded-lg text-sm font-bold flex items-center gap-2 disabled:opacity-50"
                        >
                            <Send className="w-4 h-4" />
                            {submitting ? "Đang gửi..." : "Gửi đánh giá"}
                        </Button>
                    </div>
                </form>
            )}

            {/* Review List */}
            <div className="space-y-4">
                {loading ? (
                    <div className="space-y-4">
                        {[1, 2, 3].map((i) => (
                            <div key={i} className="h-28 bg-navy-900/30 rounded-xl animate-pulse" />
                        ))}
                    </div>
                ) : reviews.length === 0 ? (
                    <div className="text-center py-12">
                        <MessageSquare className="w-12 h-12 text-slate-700 mx-auto mb-3" />
                        <p className="text-slate-400">Chưa có đánh giá nào.</p>
                        {isEnrolled && (
                            <p className="text-sm text-slate-500 mt-1">Hãy là người đầu tiên đánh giá khóa học này!</p>
                        )}
                    </div>
                ) : (
                    reviews.map((review) => (
                        <div
                            key={review.id}
                            className="p-5 bg-navy-900/30 rounded-xl border border-slate-800/50 hover:border-slate-700/50 transition-colors"
                        >
                            {editingId === review.id ? (
                                /* Edit Mode */
                                <div className="space-y-3">
                                    <div className="flex items-center gap-3">
                                        <StarRating value={editRating} onChange={setEditRating} size="sm" />
                                    </div>
                                    <textarea
                                        value={editComment}
                                        onChange={(e) => setEditComment(e.target.value)}
                                        rows={2}
                                        className="w-full bg-navy-950/50 border border-slate-700 rounded-lg px-3 py-2 text-sm text-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 resize-none"
                                    />
                                    <div className="flex gap-2 justify-end">
                                        <Button
                                            type="button"
                                            variant="ghost"
                                            onClick={() => setEditingId(null)}
                                            className="text-slate-400 text-xs px-3 py-1 h-auto"
                                        >
                                            <X className="w-3.5 h-3.5 mr-1" /> Hủy
                                        </Button>
                                        <Button
                                            type="button"
                                            disabled={submitting}
                                            onClick={() => handleUpdate(review.id)}
                                            className="bg-indigo-600 hover:bg-indigo-500 text-white text-xs px-3 py-1 h-auto font-bold"
                                        >
                                            Cập nhật
                                        </Button>
                                    </div>
                                </div>
                            ) : (
                                /* View Mode */
                                <>
                                    <div className="flex items-start justify-between gap-3">
                                        <div className="flex items-center gap-3">
                                            {review.profiles?.avatar_url ? (
                                                <img
                                                    src={review.profiles.avatar_url}
                                                    alt=""
                                                    className="size-9 rounded-full object-cover border border-slate-700"
                                                />
                                            ) : (
                                                <div className="size-9 rounded-full bg-indigo-500/20 border border-indigo-500/30 flex items-center justify-center text-indigo-300 font-bold text-sm">
                                                    {(review.profiles?.full_name ?? "?")[0].toUpperCase()}
                                                </div>
                                            )}
                                            <div>
                                                <p className="text-white font-semibold text-sm">
                                                    {review.profiles?.full_name ?? "Ẩn danh"}
                                                </p>
                                                <div className="flex items-center gap-2 mt-0.5">
                                                    <StarRating value={review.rating} readonly size="sm" />
                                                    <span className="text-xs text-slate-500">{timeAgo(review.created_at)}</span>
                                                </div>
                                            </div>
                                        </div>

                                        {myUserId === review.user_id && (
                                            <div className="flex gap-1 shrink-0">
                                                <button
                                                    onClick={() => startEdit(review)}
                                                    className="p-1.5 text-slate-500 hover:text-indigo-400 hover:bg-white/5 rounded-md transition-colors"
                                                    title="Sửa"
                                                >
                                                    <Edit3 className="w-3.5 h-3.5" />
                                                </button>
                                                <button
                                                    onClick={() => handleDelete(review.id)}
                                                    className="p-1.5 text-slate-500 hover:text-red-400 hover:bg-white/5 rounded-md transition-colors"
                                                    title="Xóa"
                                                >
                                                    <Trash2 className="w-3.5 h-3.5" />
                                                </button>
                                            </div>
                                        )}
                                    </div>

                                    {review.comment && (
                                        <p className="text-slate-300 text-sm mt-3 leading-relaxed">{review.comment}</p>
                                    )}
                                </>
                            )}
                        </div>
                    ))
                )}
            </div>
        </div>
    );
}
