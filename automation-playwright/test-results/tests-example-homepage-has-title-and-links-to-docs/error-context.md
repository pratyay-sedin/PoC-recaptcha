# Test info

- Name: homepage has title and links to docs
- Location: /Users/pratyayg/Sedin-repository/PoC-recaptcha/automation-playwright/tests/example.spec.ts:3:5

# Error details

```
Error: Timed out 3000ms waiting for expect(locator).toBeVisible()

Locator: locator('text=Form submitted successfully! reCAPTCHA verification passed.')
Expected: visible
Received: <element(s) not found>
Call log:
  - expect.toBeVisible with timeout 3000ms
  - waiting for locator('text=Form submitted successfully! reCAPTCHA verification passed.')

    at /Users/pratyayg/Sedin-repository/PoC-recaptcha/automation-playwright/tests/example.spec.ts:10:98
```

# Page snapshot

```yaml
- heading "Enquiry Form" [level=2]
- text: "Form submission failed: Failed to fetch Name:"
- textbox "Name:": John Doe
- text: "Email:"
- textbox "Email:": john@sedin.com
- text: "Company:"
- textbox "Company:": Sedin
- button "Send Message"
- text: ß
- alert
- button "Open Next.js Dev Tools":
  - img
- button "Open issues overlay": 1 Issue
- button "Collapse issues badge":
  - img
- iframe
```

# Test source

```ts
   1 | import { test, expect } from '@playwright/test';
   2 |
   3 | test('homepage has title and links to docs', async ({ page }) => {
   4 |   await page.goto('http://127.0.0.1:3000');
   5 |   await page.getByLabel('Name').fill('John Doe');
   6 |   await page.getByLabel('Email').fill('john@sedin.com');
   7 |   await page.getByLabel('Company').fill('Sedin');
   8 |   await page.getByRole('button', { name: 'Send Message' }).click();
   9 |   await page.click('text=Send Message');
> 10 |   await expect(page.locator('text=Form submitted successfully! reCAPTCHA verification passed.')).toBeVisible({timeout: 3000});
     |                                                                                                  ^ Error: Timed out 3000ms waiting for expect(locator).toBeVisible()
  11 | });
  12 |
```