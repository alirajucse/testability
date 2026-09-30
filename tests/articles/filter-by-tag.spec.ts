import { test, expect } from '../../fixtures';
import { randomItem, uid } from '../../utils/data-factory';
import { Messages } from '../../utils/messages';

test.describe('Filter articles by tag', () => {
  test('shows only articles with the selected tag', async ({ api, createArticle, homePage }) => {
    const tag = randomItem(await api.tags());
    const tagged = await createArticle({ tagList: [tag] });
    const untagged = await createArticle({ tagList: [] });

    await homePage.open();
    await homePage.popularTag(tag).click();

    await expect(homePage.activeTab).toHaveText(tag);
    await expect(homePage.previewByTitle(tagged.title)).toBeVisible();
    await expect(homePage.previewByTitle(untagged.title)).toHaveCount(0);
    for (const preview of await homePage.articlePreviews.all()) {
      await expect(homePage.previewTag(preview, tag)).toBeVisible();
    }
  });

  test('shows empty state for a tag without articles', async ({ page, homePage }) => {
    const unusedTag = `tag-${uid()}`;
    await page.route('**/api/tags', route => route.fulfill({ json: { tags: [unusedTag] } }));

    await homePage.open();
    await homePage.popularTag(unusedTag).click();

    await expect(homePage.activeTab).toHaveText(unusedTag);
    await expect(homePage.emptyState).toHaveText(Messages.noArticles);
    await expect(homePage.articlePreviews).toHaveCount(0);
  });
});
