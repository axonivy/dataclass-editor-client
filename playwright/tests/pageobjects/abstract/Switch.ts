import type { Locator, Page } from '@playwright/test';

export class Switch {
  readonly locator: Locator;

  constructor(page: Page, options?: { name?: string; nth?: number }) {
    if (options?.name) {
      this.locator = page.getByRole('switch', { name: options.name });
    } else {
      this.locator = page.getByRole('switch').nth(options?.nth ?? 0);
    }
  }
}
