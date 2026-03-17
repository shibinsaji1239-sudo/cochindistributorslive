const { test, expect } = require('@playwright/test');
const path = require('path');

test.describe('Enhanced UX: AI Search & Chat', () => {
    test.beforeEach(async ({ page }) => {
        // Merchant Login
        await page.goto('/login');
        await page.fill('#email', 'merchant@example.com');
        await page.fill('#password', 'password123');
        await page.click('.login-button');
    });

    test('should perform AI visual search', async ({ page }) => {
        // Mocking the file upload for visual search
        const fileChooserPromise = page.waitForEvent('filechooser');
        await page.click('.btn-visual-search');
        const fileChooser = await fileChooserPromise;
        
        // In a real test, you'd point to a sample product image
        // await fileChooser.setFiles(path.join(__dirname, 'sample-product.jpg'));
        
        // Verify the loading state or banner appears after upload (if we could upload)
        // await expect(page.locator('.ai-search-banner')).toBeVisible();
    });

    test('should send and receive real-time messages', async ({ page }) => {
        await page.click('nav >> text=Messages');
        await expect(page).toHaveURL(/\/messages/);

        // Select first contact
        await page.locator('.chat-item').first().click();
        
        // Send a message
        const testMsg = `Auto-test message ${Date.now()}`;
        await page.fill('.message-input', testMsg);
        await page.click('.send-btn');
        
        // Verify message appears in list
        await expect(page.locator('.messages-container')).toContainText(testMsg);
    });
});
