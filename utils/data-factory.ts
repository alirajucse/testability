import { ArticleInput, NewUser, UserSettings } from '../api/types';

const WORDS = [
  'automation', 'browser', 'testing', 'quality', 'release', 'feature', 'pipeline', 'coverage',
  'locator', 'fixture', 'report', 'session', 'network', 'request', 'response', 'selector',
];

export const randomItem = <T>(items: T[]): T => items[Math.floor(Math.random() * items.length)];

export const uid = () => `${Date.now().toString(36)}${Math.random().toString(36).slice(2, 6)}`;

const words = (count: number) => Array.from({ length: count }, () => randomItem(WORDS)).join(' ');

const sentence = (count: number) => {
  const text = words(count);
  return `${text[0].toUpperCase()}${text.slice(1)}.`;
};

export function buildUser(): NewUser {
  const id = uid();
  return {
    // API limit: 20 chars.
    username: `user${id}`,
    email: `user.${id}@example.com`,
    password: `Pass!${id}`,
  };
}

export function buildTags(count: number): string[] {
  return Array.from({ length: count }, () => `${randomItem(WORDS)}${uid().slice(-4)}`);
}

export function buildArticle(overrides: Partial<ArticleInput> = {}): ArticleInput {
  return {
    title: `${sentence(4).slice(0, -1)} ${uid()}`,
    description: sentence(8),
    body: `${sentence(12)} ${sentence(10)}`,
    tagList: buildTags(1 + Math.floor(Math.random() * 3)),
    ...overrides,
  };
}

export function buildSettings(): Required<UserSettings> {
  const id = uid();
  return {
    image: `https://example.com/avatar-${id}.png`,
    username: `upd${id}`,
    bio: sentence(6),
    email: `upd.${id}@example.com`,
  };
}
