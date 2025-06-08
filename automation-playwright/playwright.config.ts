import { defineConfig } from '@playwright/test';

import * as dotenv from 'dotenv';

dotenv.config();

const LOCAL_SITE_URL = 'http://localhost:3000'
const SITE_URL = process.env.SITE_URL || LOCAL_SITE_URL;

export default defineConfig({
  use: {
    headless: false,
    viewport: { width: 1280, height: 720 },
    baseURL: SITE_URL,
  },
});
