import { test as base, expect, Page } from '@playwright/test';
import { ConduitApi } from '../api/ConduitApi';
import { Article, ArticleInput, User } from '../api/types';
import { buildArticle, buildUser } from '../utils/data-factory';
import { loadSessionUser, storageStateFor } from '../utils/session';
import { ArticlePage } from '../pages/ArticlePage';
import { EditorPage } from '../pages/EditorPage';
import { HomePage } from '../pages/HomePage';

type UserSession = { user: User; page: Page; api: ConduitApi };

type Fixtures = {
  homePage: HomePage;
  editorPage: EditorPage;
  articlePage: ArticlePage;
  api: ConduitApi;
  trackArticle: (slug: string) => void;
  createArticle: (overrides?: Partial<ArticleInput>) => Promise<Article>;
  newUserSession: () => Promise<UserSession>;
};

export const test = base.extend<Fixtures, { sessionUser: User }>({
  sessionUser: [async ({}, use) => use(loadSessionUser()), { scope: 'worker' }],

  api: async ({ request, sessionUser }, use) => {
    await use(new ConduitApi(request, sessionUser.token));
  },

  trackArticle: async ({ api }, use) => {
    const slugs: string[] = [];
    await use(slug => slugs.push(slug));
    for (const slug of slugs) await api.deleteArticleRaw(slug);
  },

  createArticle: async ({ api, trackArticle }, use) => {
    await use(async overrides => {
      const article = await api.createArticle(buildArticle(overrides));
      trackArticle(article.slug);
      return article;
    });
  },

  newUserSession: async ({ browser, request }, use, testInfo) => {
    const contexts: Awaited<ReturnType<typeof browser.newContext>>[] = [];
    await use(async () => {
      const user = await new ConduitApi(request).register(buildUser());
      const context = await browser.newContext({
        baseURL: testInfo.project.use.baseURL,
        storageState: storageStateFor(user.token),
      });
      contexts.push(context);
      return { user, page: await context.newPage(), api: new ConduitApi(request, user.token) };
    });
    for (const context of contexts) await context.close();
  },

  homePage: async ({ page }, use) => use(new HomePage(page)),
  editorPage: async ({ page }, use) => use(new EditorPage(page)),
  articlePage: async ({ page }, use) => use(new ArticlePage(page)),
});

export { expect };
