import { test, expect } from '@playwright/test';

const STUDENT_EMAIL = process.env.TEST_STUDENT_EMAIL || '';
const STUDENT_PASSWORD = process.env.TEST_STUDENT_PASSWORD || '';

test.describe('Learner Core Flow', () => {
    test.skip(!STUDENT_EMAIL || !STUDENT_PASSWORD, 'Student credentials missing');

    test('Student navigates, views course, and interacts with lesson', async ({ page }) => {
        // Login as student
        await page.goto('/auth/login');
        await page.fill('input[type="text"]', STUDENT_EMAIL);
        await page.fill('input[type="password"]', STUDENT_PASSWORD);
        await page.click('button:has-text("Truy cập ngay")');
        
        // Assert no error message appears to fail fast instead of waiting 30s
        await expect(
            page.locator('text="Email hoặc mật khẩu không đúng"')
        ).not.toBeVisible({ timeout: 5000 });
        
        // Ensure successful login redirects
        await expect(page).toHaveURL(/.*\/dashboard/, { timeout: 10000 });

        // Go to courses catalog
        await page.goto('/courses');

        // Click on the first available course (we assume catalog has at least 1 course)
        const firstCourseLink = page.locator('a[href^="/courses/"]').first();
        await expect(firstCourseLink).toBeVisible();
        await firstCourseLink.click();

        // Check if Enroll button exists and click it if it says 'Tham gia'
        const actionButton = page.locator('button:text-matches("Tham gia", "i")');
        if (await actionButton.isVisible()) {
             await actionButton.click();
        }

        // Navigate to the lesson studying interface
        const startLearningBtn = page.locator('a:has-text("Vào học"), a:has-text("Tiếp tục học")').first();
        if (await startLearningBtn.isVisible()) {
             await startLearningBtn.click();
             await expect(page).toHaveURL(/.*\/learn/);
        }
    });
});
