import { test, expect } from '../../fixtures';
import { buildArticle } from '../../utils/data-factory';
import { ArticlePage } from '../../pages/ArticlePage';

test.describe('Edit article', () => {
  test('updates an existing article', async ({ createArticle, articlePage, editorPage, api, trackArticle, page }) => {
    const original = await createArticle();
    const changes = buildArticle();

    await articlePage.open(original.slug);
    await articlePage.editButton.click();

    await test.step('editor is pre-filled with the article', async () => {
      await expect(editorPage.title).toHaveValue(original.title);
      await expect(editorPage.description).toHaveValue(original.description);
      await expect(editorPage.body).toHaveValue(original.body);
      await expect(editorPage.tags).toHaveText(original.tagList);
    });

    await editorPage.fill({ title: changes.title, description: changes.description, body: changes.body });
    const response = await editorPage.publish();
    expect(response.status()).toBe(200);
    const { slug } = (await response.json()).article;
    trackArticle(slug);

    await test.step('article page shows the updated content', async () => {
      await expect(page).toHaveURL(`/article/${slug}`);
      await expect(articlePage.title).toHaveText(changes.title);
      await expect(articlePage.body).toHaveText(changes.body);
    });

    await test.step('changes are saved', async () => {
      expect(await api.getArticle(slug)).toMatchObject({
        title: changes.title,
        description: changes.description,
        body: changes.body,
      });
    });
  });

  test('another user cannot edit the article', async ({ createArticle, newUserSession, api }) => {
    const article = await createArticle();
    const otherUser = await newUserSession();
    const otherArticlePage = new ArticlePage(otherUser.page);

    await otherArticlePage.open(article.slug);
    await expect(otherArticlePage.title).toHaveText(article.title);
    await expect(otherArticlePage.editButton).toHaveCount(0);

    const response = await otherUser.api.updateArticleRaw(article.slug, { title: buildArticle().title });
    expect(response.status()).toBe(403);
    expect((await api.getArticle(article.slug)).title).toBe(article.title);
  });
});
