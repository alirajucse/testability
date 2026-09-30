import { expect, Locator, Page } from '@playwright/test';
import { ArticleInput } from '../api/types';

export class EditorPage {
  readonly title: Locator;
  readonly description: Locator;
  readonly body: Locator;
  readonly tagInput: Locator;
  readonly tags: Locator;
  readonly publishButton: Locator;
  readonly errorMessages: Locator;

  constructor(private readonly page: Page) {
    this.title = page.getByPlaceholder('Article Title');
    this.description = page.getByPlaceholder("What's this article about?");
    this.body = page.getByPlaceholder('Write your article (in markdown)');
    this.tagInput = page.getByPlaceholder('Enter tags');
    this.tags = page.locator('.tag-list .tag-pill');
    this.publishButton = page.getByRole('button', { name: 'Publish Article' });
    this.errorMessages = page.locator('.error-messages li');
  }

  async open(): Promise<void> {
    await this.page.goto('/editor');
  }

  async addTags(tags: string[]): Promise<void> {
    for (const tag of tags) {
      await this.tagInput.fill(tag);
      await this.tagInput.press('Enter');
      // Tag chips render async; wait before typing the next tag.
      await expect(this.tags.filter({ hasText: tag })).toBeVisible();
    }
  }

  async fill(article: Partial<ArticleInput>): Promise<void> {
    if (article.title !== undefined) await this.title.fill(article.title);
    if (article.description !== undefined) await this.description.fill(article.description);
    if (article.body !== undefined) await this.body.fill(article.body);
    if (article.tagList) await this.addTags(article.tagList);
  }

  async publish() {
    const response = this.page.waitForResponse(
      r => r.url().includes('/api/articles') && ['POST', 'PUT'].includes(r.request().method()),
    );
    await this.publishButton.click();
    return response;
  }
}
