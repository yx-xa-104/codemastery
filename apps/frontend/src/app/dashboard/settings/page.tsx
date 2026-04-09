"use client";

import { MainLayout } from "@/shared/components/layouts/MainLayout";
import { ProfileSettingsForm } from "@/shared/components/settings/ProfileSettingsForm";

export default function DashboardSettingsPage() {
  return (
    <MainLayout>
      <div className="min-h-screen relative z-10 py-10">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mb-6">
            <h1 className="text-2xl font-bold text-white tracking-tight">Cài đặt tài khoản</h1>
            <p className="text-slate-400 text-sm mt-1">Quản lý hồ sơ và các tùy chọn của bạn</p>
          </div>
          <ProfileSettingsForm role="student" />
        </div>
      </div>
    </MainLayout>
  );
}
