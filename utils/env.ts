import path from 'path';

export const BASE_URL = 'https://conduit.bondaracademy.com';
export const API_URL = 'https://conduit-api.bondaracademy.com/api';

export const STORAGE_STATE = path.join(__dirname, '../.auth/user.json');
export const USER_FILE = path.join(__dirname, '../.auth/user-meta.json');
export const TOKEN_KEY = 'jwtToken';
