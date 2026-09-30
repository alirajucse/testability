import { Locator, Page } from '@playwright/test';

export class ArticlePage {
  readonly title: Locator;
  readonly body: Locator;
  readonly tags: Locator;
  readonly author: Locator;
  readonly editButton: Locator;
  readonly deleteButton: Locator;

  constructor(private readonly page: Page) {
    // Article meta is rendered twice (banner and footer).
    const banner = page.locator('.banner');
    this.title = banner.getByRole('heading', { level: 1 });
    this.author = banner.locator('.author');
    this.editButton = banner.getByRole('link', { name: 'Edit Article' });
    this.deleteButton = banner.getByRole('button', { name: 'Delete Article' });
    this.body = page.locator('.article-content p').first();
    this.tags = page.locator('.article-content .tag-list li');
  }

  async open(slug: string): Promise<void> {
    await this.page.goto(`/article/${slug}`);
  }
}
