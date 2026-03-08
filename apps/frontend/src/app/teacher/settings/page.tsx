"use client";

import { TeacherLayout } from "@/features/teacher/components/TeacherLayout";
import { ProfileSettingsForm } from "@/shared/components/settings/ProfileSettingsForm";

export default function TeacherSettingsPage() {
  return (
    <TeacherLayout title="Cài đặt" subtitle="Quản lý tài khoản và tùy chọn giảng viên">
      <ProfileSettingsForm role="teacher" />
    </TeacherLayout>
  );
}
