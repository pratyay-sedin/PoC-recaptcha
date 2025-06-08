import { defineConfig } from '@playwright/test';

import * as dotenv from 'dotenv';

dotenv.config();

const SITE_URL = process.env.SITE_URL || 'https://amused-mallard-typically.ngrok-free.app';

export default defineConfig({
  use: {
    headless: false,
    viewport: { width: 1280, height: 720 },
    baseURL: SITE_URL,
  },
});
