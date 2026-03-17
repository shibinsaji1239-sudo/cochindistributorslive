const { defineConfig, devices } = require('@playwright/test');

module.exports = defineConfig({
    testDir: './tests',
    timeout: 60000,
    expect: {
        timeout: 10000,
    },
    fullyParallel: false,
    forbidOnly: !!process.env.CI,
    retries: process.env.CI ? 2 : 1,
    workers: 2,
    reporter: 'html',
    use: {
        baseURL: 'http://localhost:8080',
        trace: 'on',
        screenshot: 'on',
    },
    projects: [
        {
            name: 'chromium',
            use: { ...devices['Desktop Chrome'] },
        }
    ],
    // Optional: Run local dev server before starting the tests
    // webServer: {
    //   command: 'npm run serve',
    //   url: 'http://localhost:8080',
    //   reuseExistingServer: !process.env.CI,
    //   timeout: 120 * 1000,
    // },
});
