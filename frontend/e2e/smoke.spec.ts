import { test, expect } from '@playwright/test';

test('home page loads and shows header', async ({ page }) => {
  await page.goto('/');
  await expect(page.getByRole('banner')).toBeVisible();
});





