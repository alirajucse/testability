import { Locator, Page } from '@playwright/test';

export class HomePage {
  readonly activeTab: Locator;
  readonly articlePreviews: Locator;
  readonly emptyState: Locator;

  constructor(private readonly page: Page) {
    this.activeTab = page.locator('.feed-toggle .nav-link.active');
    // Loading and empty messages also use .article-preview, so keep only real articles.
    this.articlePreviews = page.locator('.article-preview').filter({ has: page.locator('h1') });
    this.emptyState = page.getByText('No articles are here... yet.');
  }

  async open(): Promise<void> {
    await this.page.goto('/');
  }

  popularTag(name: string): Locator {
    return this.page.locator('.sidebar').getByText(name, { exact: true });
  }

  previewByTitle(title: string): Locator {
    return this.articlePreviews.filter({ has: this.page.getByRole('heading', { name: title, exact: true }) });
  }

  previewTag(preview: Locator, tag: string): Locator {
    return preview.locator('.tag-list').getByText(tag, { exact: true });
  }
}
