import { defineConfig } from '@playwright/test';
import defaultConfig from '../../playwright.base';

export default defineConfig(defaultConfig, {
  testDir: './',
  webServer: {
    command: 'npm run dev',
    url: 'http://localhost:3002',
    reuseExistingServer: process.env.CI ? false : true
  }
});
