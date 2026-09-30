export interface User {
  email: string;
  username: string;
  bio: string | null;
  image: string;
  token: string;
}

export interface Credentials {
  email: string;
  password: string;
}

export interface NewUser extends Credentials {
  username: string;
}

export interface ArticleInput {
  title: string;
  description: string;
  body: string;
  tagList: string[];
}

export interface Article extends ArticleInput {
  slug: string;
  author: { username: string };
}

export interface UserSettings {
  image?: string;
  username?: string;
  bio?: string;
  email?: string;
}
