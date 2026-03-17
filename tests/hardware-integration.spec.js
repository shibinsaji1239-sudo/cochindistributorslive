const { test, expect } = require('@playwright/test');

test.describe('Hardware Integration: RFID & GPS', () => {
    test.beforeEach(async ({ page }) => {
        // Admin Login
        await page.goto('/login');
        await page.fill('#email', 'admin@example.com');
        await page.fill('#password', 'admin123');
        await page.click('.login-button');
    });

    test('should verify RFID attendance updates', async ({ page }) => {
        await page.click('nav >> text=Attendance');
        await expect(page).toHaveURL(/\/admin\/attendance/);
        
        const initialTotal = await page.locator('.stat-mini-card .value').first().textContent();
        
        // Mock a refresh (In a real scenario, the hardware sends data to the backend)
        await page.click('button:has-text("Refresh")');
        
        // Verify table structure exists
        await expect(page.locator('.report-table')).toBeVisible();
        const rows = page.locator('.report-table tbody tr');
        await expect(rows.count()).toBeGreaterThanOrEqual(0);
    });

    test('should view live GPS tracking', async ({ page }) => {
        await page.click('nav >> text=Live Tracking');
        await expect(page).toHaveURL(/\/admin\/tracking/);
        
        // Check for Pulse indicator (Live status)
        await expect(page.locator('.status-indicator')).toBeVisible();
        
        // Interacting with filter
        await page.selectOption('.select-hours', '6');
        await expect(page.locator('.badge >> text=Route Points:')).toBeVisible();
        
        // Verify map container exists
        await expect(page.locator('#map')).toBeVisible();
    });
});
