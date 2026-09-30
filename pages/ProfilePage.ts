import { Locator, Page } from '@playwright/test';

export class ProfilePage {
  readonly username: Locator;
  readonly bio: Locator;
  readonly avatar: Locator;

  constructor(page: Page) {
    const info = page.locator('.user-info');
    this.username = info.getByRole('heading', { level: 4 });
    this.bio = info.locator('p').first();
    this.avatar = info.locator('img.user-img');
  }
}
