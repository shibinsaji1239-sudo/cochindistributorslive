const { test, expect } = require('@playwright/test');

test.describe('Staff Attendance & Delivery Flow', () => {
    test('should record attendance and update delivery status', async ({ page }) => {
        // 1. Staff Login
        await page.goto('/login');
        await page.fill('#email', 'staff@example.com');
        await page.fill('#password', 'staff123');
        await page.click('.login-button');

        // 2. Verify Staff Dashboard
        await expect(page).toHaveURL(/\/staff/, { timeout: 10000 });
        await expect(page.locator('text=Staff Portal')).toBeVisible();

        // 3. Mock RFID Attendance (Visual check of dashboard status)
        // Since RFID is hardware-driven, we verify the UI shows "Present" or "On Duty"
        await expect(page.locator('.attendance-status')).toContainText(/On Duty|Present/i);

        // 4. Manage Deliveries
        await page.click('text=Assigned Tasks');
        const firstTask = page.locator('.task-card').first();
        await expect(firstTask).toBeVisible();

        // 5. Update Status
        await firstTask.locator('select').selectOption('Delivered');
        await firstTask.locator('button:has-text("Update")').click();

        await expect(page.locator('text=Status updated successfully')).toBeVisible();
    });
});
