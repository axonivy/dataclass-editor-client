import { type Locator, type Page } from '@playwright/test';

export class Button {
  readonly locator: Locator;

  constructor(page: Page, options?: { name?: string; nth?: number }) {
    if (options?.name) {
      this.locator = page.getByRole('button', { name: options.name });
    } else {
      this.locator = page.getByRole('button').nth(options?.nth ?? 0);
    }
  }
}
