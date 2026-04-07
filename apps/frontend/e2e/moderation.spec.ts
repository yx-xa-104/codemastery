import { test, expect } from '@playwright/test';

// Use environment variables for authentication
const TEACHER_EMAIL = process.env.TEST_TEACHER_EMAIL || '';
const TEACHER_PASSWORD = process.env.TEST_TEACHER_PASSWORD || '';
const ADMIN_EMAIL = process.env.TEST_ADMIN_EMAIL || '';
const ADMIN_PASSWORD = process.env.TEST_ADMIN_PASSWORD || '';

test.describe('Course Moderation Flow', () => {
  // Skip tests if credentials are not provided
  test.skip(!TEACHER_EMAIL || !TEACHER_PASSWORD || !ADMIN_EMAIL || !ADMIN_PASSWORD, 'Test credentials missing in env');

  test('Teacher creates course and Admin approves it', async ({ browser }) => {
    // ─── 1. Teacher Action: Create and Submit Course ────────────────────────────
    const teacherContext = await browser.newContext();
    const teacherPage = await teacherContext.newPage();
    
    // Login as teacher
    await teacherPage.goto('/auth/login');
    await teacherPage.fill('input[type="text"]', TEACHER_EMAIL);
    await teacherPage.fill('input[type="password"]', TEACHER_PASSWORD);
    await teacherPage.click('button:has-text("Truy cập ngay")');
    
    await expect(
        teacherPage.locator('text="Email hoặc mật khẩu không đúng"')
    ).not.toBeVisible({ timeout: 5000 });
    
    await expect(teacherPage).toHaveURL(/.*\/dashboard/, { timeout: 10000 });

    // Go to teacher dashboard
    await teacherPage.goto('/teacher/courses/create');
    
    // Fill course creation form
    const courseTitle = `Course Automation ${Date.now()}`;
    await teacherPage.fill('input[placeholder="Tiêu đề khóa học..."]', courseTitle);
    
    // Open settings tab to fill required information
    await teacherPage.click('button:has-text("Cài đặt khóa học")');
    await teacherPage.fill('textarea', 'This is an automated test course content.');
    
    // Select "Danh mục" (first dropdown) and "Cấp độ" (second dropdown)
    await teacherPage.locator('select').nth(0).selectOption({ index: 1 });
    await teacherPage.locator('select').nth(1).selectOption({ label: 'Trung cấp' });
    
    // ─── Creating Module and Lesson explicitly ───────────────────────────────
    // Since we cleared the default dummy lessons, we have to click `+ Thêm chương` then `+ Thêm bài học`
    await teacherPage.click('button[title="Thêm chương"]');
    await teacherPage.click('button:has-text("Thêm bài học")');

    // Click on the newly created lesson to open the lesson editor
    // Because we changed the UI to a span, standard clicking works flawlessly
    await teacherPage.click('button:has-text("Bài học mới")');
    
    // Fill the actual textarea used for the lesson editor
    await teacherPage.fill('textarea[placeholder*="Nhập nội dung bài học"]', 'Nội dung bài học tự động...');
    
    // We should wait a brief moment to ensure validation state updates before clicking submit
    await teacherPage.waitForTimeout(500);
    
    // Submit for review
    await teacherPage.click('button:has-text("Gửi kiểm duyệt")');

    // Mất chút thời gian để backend lưu trữ tất cả bài học và module
    // Verify success toast or redirect (tăng timeout lên 15s để xử lý compile trễ của Next.js)
    await expect(teacherPage.locator('text=Đã gửi duyệt!')).toBeVisible({ timeout: 15000 });
    await teacherPage.waitForURL('**/teacher/courses', { timeout: 15000 });

    await teacherContext.close();

    // ─── 2. Admin Action: Approve Course ───────────────────────────────────────
    const adminContext = await browser.newContext();
    const adminPage = await adminContext.newPage();

    // Login as admin
    await adminPage.goto('/auth/login');
    await adminPage.fill('input[type="text"]', ADMIN_EMAIL);
    await adminPage.fill('input[type="password"]', ADMIN_PASSWORD);
    await adminPage.click('button:has-text("Truy cập ngay")');
    
    await expect(
        adminPage.locator('text="Email hoặc mật khẩu không đúng"')
    ).not.toBeVisible({ timeout: 5000 });
    
    await expect(adminPage).toHaveURL(/.*\/dashboard/, { timeout: 10000 });

    // Go to admin dashboard
    await adminPage.goto('/admin/courses');

    // Search for the newly created course
    await adminPage.fill('input[placeholder="Tìm khóa học..."]', courseTitle);

    // Click Approve button on the row matching the course
    const courseRow = adminPage.locator(`tr:has-text("${courseTitle}")`);
    await courseRow.locator('button[title="Duyệt"]').click();

    // Verify course is now published
    await expect(courseRow.locator('text=Đã duyệt')).toBeVisible();

    await adminContext.close();
  });
});
