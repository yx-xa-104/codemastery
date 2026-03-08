"use client";

import { AdminLayout } from "@/features/admin/components/AdminLayout";
import { ProfileSettingsForm } from "@/shared/components/settings/ProfileSettingsForm";

export default function AdminSettingsPage() {
  return (
    <AdminLayout title="Cài đặt" subtitle="Quản lý tài khoản và tùy chọn giảng viên">
      <ProfileSettingsForm role="admin" />
    </AdminLayout>
  );
}
