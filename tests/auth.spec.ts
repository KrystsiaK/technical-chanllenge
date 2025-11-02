import { test, expect } from '@playwright/test';

test.beforeEach(async ({ page }) => {
    await page.route('https://reqres.in/api/login', async (route) => {
        const body = await route.request().postDataJSON();
        if (body.email && body.password) {
            await route.fulfill({
                status: 200,
                contentType: 'application/json',
                body: JSON.stringify({ token: 'mock-token-123' }),
            });
        } else {
            await route.fulfill({
                status: 400,
                contentType: 'application/json',
                body: JSON.stringify({ error: 'Missing email or password' }),
            });
        }
    });

    await page.route('https://reqres.in/api/register', async (route) => {
        const body = await route.request().postDataJSON();
        if (body.email && body.password) {
            await route.fulfill({
                status: 200,
                contentType: 'application/json',
                body: JSON.stringify({ id: 1, token: 'mock-signup-token' }),
            });
        } else {
            await route.fulfill({
                status: 400,
                contentType: 'application/json',
                body: JSON.stringify({ error: 'Missing fields' }),
            });
        }
    });
});

test.describe('Authentication flow', () => {
    test('User can sign in successfully with a strong password', async ({ page }) => {
        await page.goto('/auth');

        const emailInput = page.locator('input[name="email"]');
        const passwordInput = page.locator('input[name="password"]');

        await emailInput.fill('valid@example.com');
        await emailInput.blur();

        await passwordInput.fill('StrongPass1!');
        await passwordInput.blur();

        const submitButton = page.locator('button[type="submit"]');
        await submitButton.click();

        await expect(page).toHaveURL(/\/main$/);
        await expect(page.getByRole('button', { name: /Go to Dashboard/i })).toBeVisible();
    });

    test('User sees password validation messages for weak passwords', async ({ page }) => {
        await page.goto('/auth');

        await page.fill('input[name="email"]', 'user@example.com');
        await page.fill('input[name="password"]', 'weak'); // не проходит по всем правилам
        await page.click('button:has-text("Sign In")');

        await expect(page).toHaveURL(/\/auth$/);
        await expect(page.getByText(/Password must be at least 8 characters/i)).toBeVisible();
        await expect(page.getByText(/Password must contain at least one number/i)).toBeVisible();
        await expect(page.getByText(/Password must contain at least one special character/i)).toBeVisible();
    });

    test('User can register successfully with valid data', async ({ page }) => {
        await page.goto('/auth');

        await page.getByRole('tab', { name: /Sign Up/i }).click();

        await page.locator('input[name="username"]').fill('John Doe');
        await page.locator('input[name="email"]').fill('newuser@example.com');
        await page.locator('input[name="password"]').fill('StrongPass1!');
        await page.locator('input[name="confirmPassword"]').fill('StrongPass1!');

        await page.locator('button[type="submit"]').click();

        await expect(page).toHaveURL(/\/main$/);
        await expect(page.getByRole('button', { name: /Go to Dashboard/i })).toBeVisible();
    });

    test('User sees validation error for short username', async ({ page }) => {
        await page.goto('/auth');

        await page.getByRole('tab', { name: /Sign Up/i }).click();

        await page.locator('input[name="username"]').fill('ab');
        await page.locator('input[name="username"]').blur();

        await expect(page.getByText(/First name must be at least 3 characters/i)).toBeVisible();
    });

    test('User sees validation error when passwords do not match', async ({ page }) => {
        await page.goto('/auth');

        await page.getByRole('tab', { name: /Sign Up/i }).click();

        await page.locator('input[name="username"]').fill('John Doe');
        await page.locator('input[name="email"]').fill('user@example.com');
        await page.locator('input[name="password"]').fill('StrongPass1!');
        await page.locator('input[name="confirmPassword"]').fill('DifferentPass1!');
        await page.locator('input[name="confirmPassword"]').blur();

        await expect(page.getByText(/Passwords do not match/i)).toBeVisible();
    });

    test('User sees password validation messages for weak password on registration', async ({ page }) => {
        await page.goto('/auth');

        await page.getByRole('tab', { name: /Sign Up/i }).click();

        await page.locator('input[name="username"]').fill('John Doe');
        await page.locator('input[name="email"]').fill('user@example.com');
        await page.locator('input[name="password"]').fill('weak');
        await page.locator('input[name="password"]').blur();

        await expect(page.getByText(/Password must be at least 8 characters/i)).toBeVisible();
        await expect(page.getByText(/Password must contain at least one number/i)).toBeVisible();
        await expect(page.getByText(/Password must contain at least one special character/i)).toBeVisible();
    });

    test('User sees validation error for empty required fields on registration', async ({ page }) => {
        await page.goto('/auth');

        await page.getByRole('tab', { name: /Sign Up/i }).click();

        await page.locator('input[name="username"]').focus();
        await page.locator('input[name="username"]').blur();

        await page.locator('input[name="email"]').focus();
        await page.locator('input[name="email"]').blur();

        const submitButton = page.locator('button[type="submit"]');
        await expect(submitButton).toBeDisabled();
    });

    test('Authenticated user is redirected from /auth to /main', async ({ page }) => {
        await page.goto('/auth');

        await page.locator('input[name="email"]').fill('valid@example.com');
        await page.locator('input[name="password"]').fill('StrongPass1!');
        await page.locator('button[type="submit"]').click();

        await expect(page).toHaveURL(/\/main$/);

        await page.goto('/auth');

        await expect(page).toHaveURL(/\/main$/);
    });

    test('User can logout and is redirected to /auth', async ({ page }) => {
        await page.goto('/auth');

        await page.locator('input[name="email"]').fill('valid@example.com');
        await page.locator('input[name="password"]').fill('StrongPass1!');
        await page.locator('button[type="submit"]').click();

        await expect(page).toHaveURL(/\/main$/);

        await page.getByRole('button', { name: /Logout/i }).click();

        await expect(page).toHaveURL(/\/auth$/);
    });

    test('Header shows Login link and no Dashboard link for unauthenticated user', async ({ page }) => {
        await page.goto('/main');

        await expect(page.getByRole('link', { name: /Login/i })).toBeVisible();

        await expect(page.getByRole('button', { name: /Logout/i })).not.toBeVisible();

        const dashboardLink = page.locator('nav a:has-text("Dashboard")');
        await expect(dashboardLink).not.toBeVisible();
    });

    test('Header shows Logout button and Dashboard link for authenticated user', async ({ page }) => {
        await page.goto('/auth');

        await page.locator('input[name="email"]').fill('valid@example.com');
        await page.locator('input[name="password"]').fill('StrongPass1!');
        await page.locator('button[type="submit"]').click();

        await expect(page).toHaveURL(/\/main$/);

        await expect(page.getByRole('button', { name: /Logout/i })).toBeVisible();

        await expect(page.getByRole('link', { name: /Dashboard/i })).toBeVisible();

        await expect(page.getByRole('link', { name: /^Login$/i })).not.toBeVisible();

        await expect(page.getByText(/Hi,/i)).toBeVisible();
    });

    test('Authenticated user can access Dashboard page', async ({ page }) => {
        await page.goto('/auth');

        await page.locator('input[name="email"]').fill('valid@example.com');
        await page.locator('input[name="password"]').fill('StrongPass1!');
        await page.locator('button[type="submit"]').click();

        await expect(page).toHaveURL(/\/main$/);

        await page.getByRole('link', { name: /Dashboard/i }).click();

        await expect(page).toHaveURL(/\/dashboard$/);
        await expect(page.getByRole('heading', { name: /User Management/i })).toBeVisible();
    });

    test('Unauthenticated user is redirected from Dashboard to /auth', async ({ page }) => {
        await page.goto('/dashboard');

        await expect(page).toHaveURL(/\/auth$/);
    });
    test('Dashboard link visibility depends on auth state', async ({ page }) => {
        await page.goto('/main', { waitUntil: 'networkidle' });

        await page.waitForSelector('nav', { state: 'visible' });
        await expect(page.locator('a[href="/dashboard"]')).toHaveCount(0);

        await page.goto('/auth');
        await page.locator('input[name="email"]').fill('valid@example.com');
        await page.locator('input[name="password"]').fill('StrongPass1!');
        await page.locator('button[type="submit"]').click();
        await expect(page).toHaveURL(/\/main$/);

        await page.waitForLoadState('networkidle');
        await expect(page.locator('a[href="/dashboard"]')).toBeVisible();
    });

});