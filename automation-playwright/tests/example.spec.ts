import { test, expect } from '@playwright/test';

test('homepage has title and links to docs', async ({ page }) => {
  await page.goto('http://127.0.0.1:3000');
  await page.getByLabel('Name').fill('John Doe');
  await page.getByLabel('Email').fill('john@sedin.com');
  await page.getByLabel('Company').fill('Sedin');
  await page.getByRole('button', { name: 'Send Message' }).click();
  await page.click('text=Send Message');
  await expect(page.locator('text=Form submitted successfully! reCAPTCHA verification passed.')).toBeVisible({timeout: 3000});
});
