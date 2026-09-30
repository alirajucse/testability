import { test, expect } from '../../fixtures';
import { buildSettings } from '../../utils/data-factory';
import { Header } from '../../pages/components/Header';
import { ProfilePage } from '../../pages/ProfilePage';
import { SettingsPage } from '../../pages/SettingsPage';

test.describe('Update user settings', () => {
  test('updates profile picture, username, bio and email', async ({ newUserSession }) => {
    const { page, api } = await newUserSession();
    const settingsPage = new SettingsPage(page);
    const profilePage = new ProfilePage(page);
    const settings = buildSettings();

    await settingsPage.open();
    await settingsPage.fill(settings);
    const response = await settingsPage.save();
    expect(response.status()).toBe(200);

    await test.step('profile page shows the new settings', async () => {
      await expect(page).toHaveURL(`/profile/${settings.username}`);
      await expect(profilePage.username).toHaveText(settings.username);
      await expect(profilePage.bio).toHaveText(settings.bio);
      await expect(profilePage.avatar).toHaveAttribute('src', settings.image);
    });

    await test.step('settings are saved', async () => {
      expect(await api.currentUser()).toMatchObject({ ...settings });
      // Header only shows the new username after a reload.
      await page.reload();
      await expect(new Header(page).profileLink(settings.username)).toBeVisible();
    });
  });

  test('does not save a username that is already taken', async ({ newUserSession }) => {
    const otherUser = await newUserSession();
    const { user, page, api } = await newUserSession();
    const settingsPage = new SettingsPage(page);

    await settingsPage.open();
    await settingsPage.fill({ username: otherUser.user.username });
    const response = await settingsPage.save();

    expect(response.ok()).toBeFalsy();
    await expect(page).toHaveURL('/settings');
    expect((await api.currentUser()).username).toBe(user.username);
  });
});
