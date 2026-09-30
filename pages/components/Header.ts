import { Locator, Page } from '@playwright/test';

export class Header {
  constructor(private readonly page: Page) {}

  profileLink(username: string): Locator {
    return this.page.getByRole('navigation').first().getByRole('link', { name: username, exact: true });
  }
}
