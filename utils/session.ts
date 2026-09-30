import fs from 'fs';
import { User } from '../api/types';
import { BASE_URL, TOKEN_KEY, USER_FILE } from './env';

export function storageStateFor(token: string) {
  return {
    cookies: [],
    origins: [{ origin: BASE_URL, localStorage: [{ name: TOKEN_KEY, value: token }] }],
  };
}

export function saveSessionUser(user: User): void {
  fs.writeFileSync(USER_FILE, JSON.stringify(user, null, 2));
}

export function loadSessionUser(): User {
  return JSON.parse(fs.readFileSync(USER_FILE, 'utf-8'));
}
