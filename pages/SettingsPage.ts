import { Locator, Page } from '@playwright/test';
import { UserSettings } from '../api/types';

export class SettingsPage {
  readonly image: Locator;
  readonly username: Locator;
  readonly bio: Locator;
  readonly email: Locator;
  readonly submit: Locator;

  constructor(private readonly page: Page) {
    this.image = page.getByPlaceholder('URL of profile picture');
    this.username = page.getByPlaceholder('Username');
    this.bio = page.getByPlaceholder('Short bio about you');
    this.email = page.getByPlaceholder('Email');
    this.submit = page.getByRole('button', { name: 'Update Settings' });
  }

  async open(): Promise<void> {
    await this.page.goto('/settings');
  }

  async fill(settings: UserSettings): Promise<void> {
    if (settings.image !== undefined) await this.image.fill(settings.image);
    if (settings.username !== undefined) await this.username.fill(settings.username);
    if (settings.bio !== undefined) await this.bio.fill(settings.bio);
    if (settings.email !== undefined) await this.email.fill(settings.email);
  }

  async save() {
    const response = this.page.waitForResponse(r => r.url().endsWith('/api/user') && r.request().method() === 'PUT');
    await this.submit.click();
    return response;
  }
}
