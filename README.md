# Conduit E2E Tests

End-to-end tests for [Conduit](https://conduit.bondaracademy.com/) using Playwright and TypeScript.

## Getting started

```bash
npm ci
npx playwright install --with-deps
npm test
```

## Scripts

| Command | Description |
|---|---|
| `npm test` | Run all tests in Chromium, Firefox and WebKit |
| `npm run test:chromium` | Run in Chromium only (also `test:firefox`, `test:webkit`) |
| `npm run report` | Open the Playwright HTML report |
| `npm run allure:report` | Generate and open the Allure report |

## Project structure

```
api/          REST client used for test preconditions and data checks
fixtures/     Custom Playwright fixtures
pages/        Page objects
tests/        Test specs and auth setup
utils/        Config, session helpers, test data, messages
```

## Test coverage

| Feature | Positive | Negative |
|---|---|---|
| Create article | Publish an article | Empty title; duplicate title |
| Edit article | Update an article created via API | Another user cannot edit |
| Delete article | Delete an article created via API | Another user cannot delete |
| Filter by tag | Only articles with the selected tag are shown | Tag without articles shows empty state |
| User settings | Update picture, username, bio and email | Username already taken |

## Framework design

- **Session reuse:** the `setup` project logs in once and saves the session to `.auth/user.json`. All browser projects reuse it.
- **Isolated users:** tests that change the user, or need a second user, register one through the API.
- **Test data:** generated in `utils/data-factory.ts` with a unique suffix per run. Articles created by tests are deleted afterwards.
- **Reports:** Playwright HTML and Allure. Traces and screenshots are kept for failed tests.
- **CI:** GitHub Actions runs all browsers on every push and pull request and uploads both reports.

## Known issues

- Saving a username that is already taken returns HTTP 500 and no error message is shown.
- The header navigation disappears after saving settings until the page is reloaded.
