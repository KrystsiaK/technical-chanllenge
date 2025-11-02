import { test, expect, Page } from '@playwright/test';

const usersPage1 = {
    page: 1,
    per_page: 6,
    total: 12,
    total_pages: 2,
    data: [
        {
            id: 1,
            email: "george.bluth@reqres.in",
            first_name: "George",
            last_name: "Bluth",
            avatar: "https://reqres.in/img/faces/1-image.jpg"
        },
        {
            id: 2,
            email: "janet.weaver@reqres.in",
            first_name: "Janet",
            last_name: "Weaver",
            avatar: "https://reqres.in/img/faces/2-image.jpg"
        },
        {
            id: 3,
            email: "emma.wong@reqres.in",
            first_name: "Emma",
            last_name: "Wong",
            avatar: "https://reqres.in/img/faces/3-image.jpg"
        }
    ]
};

const user2 = {
    data: {
        id: 2,
        email: "janet.weaver@reqres.in",
        first_name: "Janet",
        last_name: "Weaver",
        avatar: "https://reqres.in/img/faces/2-image.jpg"
    }
};


const login = async (page: Page) => {
    await page.goto('/auth');
    await page.locator('input[name="email"]').fill('valid@example.com');
    await page.locator('input[name="password"]').fill('StrongPass1!');
    await page.locator('button[type="submit"]').click();
    await expect(page).toHaveURL(/\/main$/);
}

test.beforeEach(async ({ page }) => {
    await page.route('https://reqres.in/api/login', async (route) => {
        const request = route.request();
        const postData = request.postDataJSON();

        if (postData && postData.email && postData.password) {
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

    await page.route('**/api/users?page=*', async (route) => {
        await route.fulfill({
            status: 200,
            contentType: 'application/json',
            body: JSON.stringify(usersPage1),
        });
    });

    await page.route('**/api/users', async (route) => {
        if (route.request().method() === 'POST') {
            const postData = route.request().postDataJSON();
            await route.fulfill({
                status: 201,
                contentType: 'application/json',
                body: JSON.stringify({
                    ...postData,
                    id: Math.floor(Math.random() * 1000),
                    createdAt: new Date().toISOString(),
                }),
            });
        }
    });

    await page.route('**/api/users/*', async (route) => {
        const method = route.request().method();

        if (method === 'PATCH') {
            const patchData = route.request().postDataJSON();
            await route.fulfill({
                status: 200,
                contentType: 'application/json',
                body: JSON.stringify({
                    ...patchData,
                    updatedAt: new Date().toISOString(),
                }),
            });
        } else if (method === 'DELETE') {
            await route.fulfill({
                status: 204,
                body: '',
            });
        } else if (method === 'GET') {
            await route.fulfill({
                status: 200,
                contentType: 'application/json',
                body: JSON.stringify(user2),
            });
        }
    });

    await login(page);

    await page.getByRole('link', { name: /Dashboard/i }).click();
    await expect(page).toHaveURL(/\/dashboard$/);
});

test.describe('User Management Dashboard', () => {

    test('Dashboard page loads and displays user table', async ({ page }) => {
        await expect(page.getByRole('heading', { name: /User Management/i })).toBeVisible();

        await expect(page.getByRole('button', { name: /Add User/i })).toBeVisible();
        await page.waitForSelector('table', { state: 'visible' });

        await expect(page.locator('th:has-text("Avatar")')).toBeVisible();
        await expect(page.locator('th:has-text("Name")')).toBeVisible();
        await expect(page.locator('th:has-text("Email")')).toBeVisible();
    });

    test('User can open Add User modal', async ({ page }) => {
        await page.getByRole('button', { name: /Add User/i }).click();

        await expect(page.getByRole('dialog')).toBeVisible();
        await expect(page.getByText(/Add New User/i)).toBeVisible();

        await expect(page.locator('input[name="first_name"]')).toBeVisible();
        await expect(page.locator('input[name="last_name"]')).toBeVisible();
        await expect(page.locator('input[name="email"]')).toBeVisible();

        await expect(page.getByRole('button', { name: /Cancel/i })).toBeVisible();
        await expect(page.getByRole('button', { name: /Create/i })).toBeVisible();
    });

    test('User can create a new user successfully', async ({ page }) => {
        await page.getByRole('button', { name: /Add User/i }).click();

        await page.locator('input[name="first_name"]').fill('John');
        await page.locator('input[name="last_name"]').fill('Doe');
        await page.locator('input[name="email"]').fill('john.doe@example.com');

        await page.getByRole('button', { name: /^Create$/i }).click();

        await page.waitForTimeout(500);
        await expect(page.getByRole('dialog')).not.toBeVisible();
    });

    test('Validation: Cannot create user with empty fields', async ({ page }) => {
        await page.getByRole('button', { name: /Add User/i }).click();

        const createButton = page.getByRole('button', { name: /^Create$/i });

        await expect(createButton).toBeDisabled();
    });

    test('Validation: Shows error for invalid email', async ({ page }) => {
        await page.getByRole('button', { name: /Add User/i }).click();

        await page.locator('input[name="first_name"]').fill('John');
        await page.locator('input[name="last_name"]').fill('Doe');
        await page.locator('input[name="email"]').fill('invalid-email');
        await page.locator('input[name="email"]').blur();

        await expect(page.getByText(/Invalid email format/i)).toBeVisible();
    });

    test('Validation: First name must be at least 2 characters', async ({ page }) => {
        await page.getByRole('button', { name: /Add User/i }).click();

        await page.locator('input[name="first_name"]').fill('J');
        await page.locator('input[name="first_name"]').blur();

        await expect(page.getByText(/First name must be at least 2 characters/i)).toBeVisible();
    });

    test('Validation: Last name must be at least 2 characters', async ({ page }) => {
        await page.getByRole('button', { name: /Add User/i }).click();

        await page.locator('input[name="last_name"]').fill('D');
        await page.locator('input[name="last_name"]').blur();

        await expect(page.getByText(/Last name must be at least 2 characters/i)).toBeVisible();
    });

    test('User can cancel user creation', async ({ page }) => {
        await page.getByRole('button', { name: /Add User/i }).click();

        await expect(page.getByRole('dialog')).toBeVisible();

        await page.locator('input[name="first_name"]').fill('John');
        await page.locator('input[name="first_name"]').blur();

        await page.getByRole('button', { name: /Cancel/i }).click();

        await page.waitForSelector('[data-slot="dialog-overlay"]', { state: 'hidden' });
        await expect(page.getByRole('dialog')).toHaveCount(0);
    });

    test('User can open edit modal by clicking on table row', async ({ page }) => {
        await page.waitForSelector('table tbody tr');

        const firstRow = page.locator('table tbody tr').first();
        await firstRow.click();

        await expect(page.getByRole('dialog')).toBeVisible();
        await expect(page.getByText(/Edit User/i)).toBeVisible();

        const firstNameInput = page.locator('input[name="first_name"]');
        await expect(firstNameInput).not.toHaveValue('');

        await expect(page.getByRole('button', { name: /^Save$/i })).toBeVisible();
    });

    test('User can edit existing user', async ({ page }) => {
        await page.waitForSelector('table tbody tr');
        await page.locator('table tbody tr').first().click();

        const firstNameInput = page.locator('input[name="first_name"]');
        await firstNameInput.clear();
        await firstNameInput.fill('Jane');

        const lastNameInput = page.locator('input[name="last_name"]');
        await lastNameInput.clear();
        await lastNameInput.fill('Smith');

        await page.getByRole('button', { name: /^Save$/i }).click();

        await page.waitForTimeout(500);

        await expect(page.getByRole('dialog')).not.toBeVisible();
    });

    test('User can initiate delete confirmation dialog', async ({ page }) => {
        await page.waitForSelector('table tbody tr');

        const deleteButton = page.locator('table tbody tr').first().locator('button[class*="destructive"]');
        await deleteButton.click();

        await expect(page.getByRole('alertdialog')).toBeVisible();
        await expect(page.getByText(/Are you sure you want to delete this user/i)).toBeVisible();

        await expect(page.getByRole('button', { name: /Cancel/i })).toBeVisible();
        await expect(page.getByRole('button', { name: /Delete/i })).toBeVisible();
    });

    test('User can cancel deletion', async ({ page }) => {
        await page.waitForSelector('table tbody tr');

        const deleteButton = page.locator('table tbody tr').first().locator('button[class*="destructive"]');
        await deleteButton.click();

        await page.getByRole('button', { name: /^Cancel$/i }).click();

        await page.waitForTimeout(300);

        await expect(page.getByRole('alertdialog')).not.toBeVisible();
    });

    test('User can confirm and delete user', async ({ page }) => {
        await page.waitForSelector('table tbody tr');

        const deleteButton = page.locator('table tbody tr').first().locator('button[class*="destructive"]');
        await deleteButton.click();

        await page.getByRole('button', { name: /^Delete$/i }).click();

        await page.waitForTimeout(1000);

        await expect(page.getByRole('alertdialog')).not.toBeVisible();
    });

    test('Pagination: Pagination controls are visible', async ({ page }) => {
        await expect(page.getByText(/Page \d+ of \d+/i)).toBeVisible();

        const paginationButtons = page.locator('div:has-text("Page") button');
        expect(await paginationButtons.count()).toBeGreaterThanOrEqual(2);
    });

    test('Empty state message structure exists', async ({ page }) => {
        const rowCount = await page.locator('table tbody tr').count();
        expect(rowCount).toBeGreaterThan(0);

        if (rowCount > 0) {
            const cells = page.locator('table tbody td');
            expect(await cells.count()).toBeGreaterThan(0);
        }
    });
});