const { test, expect } = require('@playwright/test');

test.describe('Finance & Rewards: Wallet & Salary', () => {
    test.beforeEach(async ({ page }) => {
        // Merchant Login
        await page.goto('/login');
        await page.fill('#email', 'merchant@example.com');
        await page.fill('#password', 'password123');
        await page.click('.login-button');
    });

    test('should manage wallet and initiate recharge', async ({ page }) => {
        await page.click('.wallet-pill');
        await expect(page.locator('.wallet-modal')).toBeVisible();
        
        const balance = await page.locator('.balance-amount .amount').textContent();
        console.log(`Current Balance: ${balance}`);

        // Set amount and click add
        await page.click('button:has-text("₹500")');
        await expect(page.locator('input#amount')).toHaveValue('500');
        
        // Note: We don't trigger payNow in automation to avoid Razorpay popup blockers/security
        await expect(page.locator('.add-money-btn')).toBeEnabled();
    });

    test('should permit admin to review and pay salary', async ({ page }) => {
        // Switch to Admin
        await page.goto('/login');
        await page.fill('#email', 'admin@example.com');
        await page.fill('#password', 'admin123');
        await page.click('.login-button');

        await page.click('nav >> text=Staff');
        await expect(page).toHaveURL(/\/admin\/staff/);

        // Open menu for first staff member
        const firstStaffMenu = page.locator('.menu-trigger').first();
        await firstStaffMenu.click();
        
        // Open Salary Modal
        await page.click('.menu-item.salary');
        await expect(page.locator('.salary-modal')).toBeVisible();
        
        // Verify calculation details
        await expect(page.locator('.salary-row.total-row')).toContainText('Net Salary');
    });
});
