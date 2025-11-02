import { defineConfig, devices } from '@playwright/test';

export default defineConfig({
    testDir: './tests',
    timeout: 30_000,
    fullyParallel: true,
    workers: process.env.CI ? 1 : undefined,
    retries: process.env.CI ? 2 : 0,
    reporter: process.env.CI
        ? [['html', { open: 'never' }], ['list'], ['github']]
        : [['html', { open: 'never' }], ['list']],
    use: {
        baseURL: process.env.PLAYWRIGHT_BASE_URL || 'http://localhost:3000',
        trace: 'retain-on-failure',
        screenshot: 'only-on-failure',
        video: 'retain-on-failure',
        navigationTimeout: 10_000,
        actionTimeout: 10_000,
    },
    projects: [
        {
            name: 'chromium',
            use: { ...devices['Desktop Chrome'] },
        },
        {
            name: 'firefox',
            use: { ...devices['Desktop Firefox'] },
        },
    ],
    webServer: {
        command: 'pnpm dev',
        url: 'http://localhost:3000',
        reuseExistingServer: !process.env.CI,
        timeout: 120_000,
        stdout: 'ignore',
        stderr: 'pipe',
    },
});