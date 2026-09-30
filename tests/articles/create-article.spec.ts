import { test, expect } from '../../fixtures';
import { buildArticle } from '../../utils/data-factory';
import { Messages } from '../../utils/messages';

test.describe('Create article', () => {
  test.beforeEach(async ({ editorPage }) => {
    await editorPage.open();
  });

  test('publishes a new article', async ({ editorPage, articlePage, homePage, api, sessionUser, trackArticle, page }) => {
    const article = buildArticle();

    await editorPage.fill(article);
    const response = await editorPage.publish();
    expect(response.status()).toBe(201);
    const { slug } = (await response.json()).article;
    trackArticle(slug);

    await test.step('article page shows the published content', async () => {
      await expect(page).toHaveURL(`/article/${slug}`);
      await expect(articlePage.title).toHaveText(article.title);
      await expect(articlePage.body).toHaveText(article.body);
      await expect(articlePage.tags).toHaveText(article.tagList);
      await expect(articlePage.author).toHaveText(sessionUser.username);
      await expect(articlePage.editButton).toBeVisible();
      await expect(articlePage.deleteButton).toBeVisible();
    });

    await test.step('article is saved', async () => {
      expect(await api.getArticle(slug)).toMatchObject({ ...article });
    });

    await test.step('article appears in the global feed', async () => {
      await homePage.open();
      await expect(homePage.previewByTitle(article.title)).toContainText(article.description);
    });
  });

  test('shows an error when title is empty', async ({ editorPage, page }) => {
    await editorPage.fill(buildArticle({ title: '' }));
    const response = await editorPage.publish();

    expect(response.ok()).toBeFalsy();
    await expect(editorPage.errorMessages).toHaveText([Messages.titleBlank]);
    await expect(page).toHaveURL('/editor');
  });

  test('shows an error when title already exists', async ({ editorPage, createArticle, page }) => {
    const existing = await createArticle();
    await editorPage.fill(buildArticle({ title: existing.title }));
    const response = await editorPage.publish();

    expect(response.ok()).toBeFalsy();
    await expect(editorPage.errorMessages).toHaveText([Messages.titleNotUnique]);
    await expect(page).toHaveURL('/editor');
  });
});
