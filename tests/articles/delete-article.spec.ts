import { test, expect } from '../../fixtures';
import { ArticlePage } from '../../pages/ArticlePage';

test.describe('Delete article', () => {
  test('deletes an existing article', async ({ createArticle, articlePage, homePage, api, page }) => {
    const article = await createArticle();

    await articlePage.open(article.slug);
    await expect(articlePage.title).toHaveText(article.title);
    await articlePage.deleteButton.click();

    await expect(page).toHaveURL('/');
    await expect(homePage.articlePreviews.first()).toBeVisible();
    await expect(homePage.previewByTitle(article.title)).toHaveCount(0);
    expect((await api.getArticleRaw(article.slug)).status()).toBe(404);
  });

  test('another user cannot delete the article', async ({ createArticle, newUserSession, api }) => {
    const article = await createArticle();
    const otherUser = await newUserSession();
    const otherArticlePage = new ArticlePage(otherUser.page);

    await otherArticlePage.open(article.slug);
    await expect(otherArticlePage.title).toHaveText(article.title);
    await expect(otherArticlePage.deleteButton).toHaveCount(0);

    const response = await otherUser.api.deleteArticleRaw(article.slug);
    expect(response.status()).toBe(403);
    expect((await api.getArticleRaw(article.slug)).status()).toBe(200);
  });
});
