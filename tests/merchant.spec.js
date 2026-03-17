const { test, expect } = require('@playwright/test');

test.describe('Merchant User Flow', () => {
    test('should login and browse products', async ({ page }) => {
        // 1. Navigate to Login
        await page.goto('/login');
        await expect(page).toHaveTitle(/Cochin Distributors/i);

        // 2. Perform Login
        await page.fill('#email', 'merchant@example.com');
        await page.fill('#password', 'password123');
        await page.click('.login-button');

        // 3. Verify Dashboard Redirection
        await expect(page).toHaveURL(/\/user/);
        await expect(page.locator('text=Welcome')).toBeVisible();

        // 4. Browse Products
        await page.click('nav >> text=Products');
        await expect(page).toHaveURL(/\/products/);

        // 5. Add to Cart (Assuming a 'Add to Cart' button exists in ProductList)
        const firstProduct = page.locator('.product-card').first();
        await firstProduct.scrollIntoViewIfNeeded();
        await firstProduct.locator('button:has-text("Add to Cart")').click();

        // 6. Verify Cart Update
        await page.click('nav >> .cart-icon');
        await expect(page).toHaveURL(/\/cart/);
        await expect(page.locator('.cart-item')).toHaveCount(1);
    });
});
