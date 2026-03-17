const { test, expect } = require('@playwright/test');

test.describe('Admin Management Flow', () => {
    test('should manage inventory and view reports', async ({ page }) => {
        // 1. Admin Login
        await page.goto('/login');
        await page.fill('#email', 'admin@example.com');
        await page.fill('#password', 'admin123');
        await page.click('.login-button');

        // 2. Verify Admin Dashboard
        await expect(page).toHaveURL(/\/admin/);
        await expect(page.locator('text=Admin Dashboard')).toBeVisible();

        // 3. Add Product
        await page.click('text=Add Product');
        await expect(page).toHaveURL(/\/admin\/add-product/);

        await page.fill('input[name="name"]', 'Test Product');
        await page.fill('textarea[name="description"]', 'Automation testing product');
        await page.fill('input[name="price"]', '100');
        await page.fill('input[name="quantity"]', '50');
        await page.click('button:has-text("Save Product")');

        // 4. Verify Product List
        await expect(page).toHaveURL(/\/admin/);
        await expect(page.locator('.product-table')).toContainText('Test Product');

        // 5. View Sales Analytics
        await page.click('text=Analytics');
        await expect(page.locator('canvas')).toBeVisible(); // Chart.js canvas
    });
});
