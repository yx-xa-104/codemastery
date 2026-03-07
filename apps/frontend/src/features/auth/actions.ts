"use server";

import { createClient } from "@/shared/lib/supabase/server";
import { redirect } from "next/navigation";

export async function signInWithPassword(formData: FormData) {
  const supabase = await createClient();

  let email = formData.get("email") as string;
  const password = formData.get("password") as string;

  if (email && !email.includes("@")) {
    email = `${email.toLowerCase()}@student.codemastery.vn`;
  }

  const { data: { user }, error } = await supabase.auth.signInWithPassword({ email, password });

  if (error) {
    return { error: error.message };
  }

  // Fetch role to redirect to correct panel
  let redirectPath = '/dashboard';
  if (user) {
    const { data: profile } = await (supabase as any)
      .from('profiles')
      .select('role')
      .eq('id', user.id)
      .single();
    if (profile?.role === 'admin') redirectPath = '/admin/dashboard';
    else if (profile?.role === 'teacher') redirectPath = '/teacher/dashboard';
  }

  redirect(redirectPath);
}

export async function signUp(formData: FormData) {
  const supabase = await createClient();

  const email = formData.get("email") as string;
  const password = formData.get("password") as string;
  const fullName = formData.get("full_name") as string;
  const dateOfBirth = formData.get("date_of_birth") as string;
  const classCode = formData.get("class_code") as string;
  const studentId = formData.get("student_id") as string;

  const { error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: {
        full_name: fullName,
        date_of_birth: dateOfBirth || null,
        class_code: classCode || null,
        student_id: studentId || null,
      },
    },
  });

  if (error) {
    return { error: error.message };
  }

  return {
    success: "Đăng ký thành công! Kiểm tra email để xác nhận tài khoản.",
  };
}

export async function signOut() {
  const supabase = await createClient();
  await supabase.auth.signOut();
  redirect("/auth/login");
}

export async function signInWithGoogle() {
  const supabase = await createClient();

  const { data, error } = await supabase.auth.signInWithOAuth({
    provider: "google",
    options: {
      redirectTo: `${process.env.NEXT_PUBLIC_SUPABASE_URL ? "" : "http://localhost:3000"}/auth/callback`,
    },
  });

  if (error) {
    return { error: error.message };
  }

  if (data.url) {
    redirect(data.url);
  }
}
