import { MainLayout } from "@/components/layouts/MainLayout";
import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";

export default async function DashboardPage() {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) redirect('/auth/login');

    const displayName = user.user_metadata?.full_name || user.email?.split('@')[0] || 'User';

    return (
        <MainLayout>
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
                <div className="text-center">
                    <h1 className="text-3xl font-bold text-white mb-4">
                        Xin chào, <span className="text-indigo-400">{displayName}</span>! 👋
                    </h1>
                    <p className="text-slate-400 text-lg mb-8">
                        Dashboard đang được xây dựng. Sẽ sớm có thống kê học tập, khóa học đã đăng ký, và hoạt động gần đây.
                    </p>
                    <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-amber-500/10 border border-amber-500/20 text-amber-300 text-sm font-medium">
                        🚧 Coming in Phase 5
                    </div>
                </div>
            </div>
        </MainLayout>
    );
}
