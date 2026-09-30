import { APIRequestContext, APIResponse, expect } from '@playwright/test';
import { API_URL } from '../utils/env';
import { Article, ArticleInput, NewUser, User } from './types';

export class ConduitApi {
  constructor(
    private readonly request: APIRequestContext,
    private readonly token?: string,
  ) {}

  private headers(): Record<string, string> {
    return this.token ? { Authorization: `Token ${this.token}` } : {};
  }

  async register(user: NewUser): Promise<User> {
    const res = await this.request.post(`${API_URL}/users`, { data: { user } });
    await expectOk(res);
    return (await res.json()).user;
  }

  async currentUser(): Promise<User> {
    const res = await this.request.get(`${API_URL}/user`, { headers: this.headers() });
    await expectOk(res);
    return (await res.json()).user;
  }

  async createArticle(article: ArticleInput): Promise<Article> {
    const res = await this.request.post(`${API_URL}/articles`, { headers: this.headers(), data: { article } });
    await expectOk(res);
    return (await res.json()).article;
  }

  async getArticle(slug: string): Promise<Article> {
    const res = await this.getArticleRaw(slug);
    await expectOk(res);
    return (await res.json()).article;
  }

  getArticleRaw(slug: string): Promise<APIResponse> {
    return this.request.get(`${API_URL}/articles/${slug}`, { headers: this.headers() });
  }

  updateArticleRaw(slug: string, article: Partial<ArticleInput>): Promise<APIResponse> {
    return this.request.put(`${API_URL}/articles/${slug}`, { headers: this.headers(), data: { article } });
  }

  deleteArticleRaw(slug: string): Promise<APIResponse> {
    return this.request.delete(`${API_URL}/articles/${slug}`, { headers: this.headers() });
  }

  async tags(): Promise<string[]> {
    const res = await this.request.get(`${API_URL}/tags`);
    await expectOk(res);
    return (await res.json()).tags;
  }
}

async function expectOk(res: APIResponse) {
  expect(res.ok(), `${res.url()} failed: ${res.status()} ${await res.text()}`).toBeTruthy();
}
