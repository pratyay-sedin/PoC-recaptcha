import { test, expect } from '@playwright/test';

test.use({ headless: false });

test('homepage has title and links to docs', async ({ page }) => {
  await page.goto('https://eager-sensibly-raven.ngrok-free.app/');
  await page.getByLabel('Name').fill('John Doe');
  await page.getByLabel('Email').fill('john@sedin.com');
  await page.getByLabel('Company').fill('Sedin');
  await page.getByRole('button', { name: 'Send Message' }).click();
  await page.click('text=Send Message');

  await page.waitForLoadState('networkidle');
  const locator = page.locator(
    'text=Form submitted successfully! reCAPTCHA verification passed.'
  );
  const count = await locator.count();
  if(count === 0) {
    throw new Error('Sucess message not found!')
  }
});
