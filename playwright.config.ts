import { defineConfig, devices } from '@playwright/test';
import { BASE_URL, STORAGE_STATE } from './utils/env';

export default defineConfig({
  testDir: './tests',
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 1,
  expect: { timeout: 10_000 },
  reporter: [['list'], ['html', { open: 'never' }], ['allure-playwright']],
  use: {
    baseURL: BASE_URL,
    trace: 'retain-on-failure',
    screenshot: 'only-on-failure',
  },
  projects: [
    { name: 'setup', testMatch: /.*\.setup\.ts/ },
    { name: 'chromium', use: { ...devices['Desktop Chrome'], storageState: STORAGE_STATE }, dependencies: ['setup'] },
    { name: 'firefox', use: { ...devices['Desktop Firefox'], storageState: STORAGE_STATE }, dependencies: ['setup'] },
    { name: 'webkit', use: { ...devices['Desktop Safari'], storageState: STORAGE_STATE }, dependencies: ['setup'] },
  ],
});
