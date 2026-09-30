import { test as setup, expect } from '@playwright/test';
import { ConduitApi } from '../api/ConduitApi';
import { buildUser } from '../utils/data-factory';
import { STORAGE_STATE } from '../utils/env';
import { saveSessionUser } from '../utils/session';
import { Header } from '../pages/components/Header';
import { LoginPage } from '../pages/LoginPage';

setup('authenticate', async ({ page, request }) => {
  const newUser = buildUser();
  const user = await new ConduitApi(request).register(newUser);

  const loginPage = new LoginPage(page);
  await loginPage.open();
  await loginPage.login(newUser);
  await expect(new Header(page).profileLink(user.username)).toBeVisible();

  await page.context().storageState({ path: STORAGE_STATE });
  saveSessionUser(user);
});
