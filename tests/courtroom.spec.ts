import { test, expect } from '@playwright/test';

test.describe('Court Room Scenario Tests', () => {
  test('Page loads and displays all sections', async ({ page }) => {
    await page.goto('/court-room');
    await expect(page.getByRole('heading', { name: 'Timer' })).toBeVisible();
    await expect(page.getByRole('heading', { name: 'Stages' })).toBeVisible();
    await expect(page.getByRole('heading', { name: 'Messages' })).toBeVisible();
  });

  test('Save button creates a new session in the database', async ({ page, request }) => {
    await page.goto('/court-room');

    await page.getByRole('button', { name: 'Start the scenario' }).click();
    await page.getByRole('button', { name: 'Save progress' }).click();

    const res = await request.get('/api/session');
    expect(res.ok()).toBeTruthy();

    const data = await res.json();
    expect(Array.isArray(data)).toBeTruthy();
    expect(data.length).toBeGreaterThan(0);
  });
});
