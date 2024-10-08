import { defineConfig, devices } from '@playwright/test';

const browsers = () => {
  const chrome = { name: 'chromium', use: { ...devices['Desktop Chrome'] } };
  const firefox = { name: 'firefox', use: { ...devices['Desktop Firefox'] } };
  const webkit = { name: 'webkit', use: { ...devices['Desktop Safari'] } };
  switch (process.env.BROWSERS) {
    case 'chrome':
      return [chrome];
    case 'firefox':
      return [firefox];
    case 'webkit':
      return [webkit];
    default:
      return [chrome, firefox, webkit];
  }
};

const config = defineConfig({
  testDir: './tests',
  timeout: 1000 * (process.env.CI ? 120 : 30),
  expect: {
    timeout: 5000
  },
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 1 : 0,
  reporter: process.env.CI ? [['../custom-reporter.ts'], ['junit', { outputFile: 'report.xml' }], ['list']] : 'html',
  use: {
    actionTimeout: 0,
    baseURL: 'http://localhost:3002',
    trace: 'retain-on-failure',
    headless: process.env.CI ? true : false
  },
  projects: browsers()
});

export default config;
