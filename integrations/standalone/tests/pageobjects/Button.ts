import type { Locator, Page } from '@playwright/test';

export class Button {
  private readonly locator: Locator;

  constructor(page: Page, options?: { name?: string; nth?: number }) {
    if (options?.name) {
      this.locator = page.getByRole('button', { name: options.name });
    } else {
      this.locator = page.getByRole('button').nth(options?.nth ?? 0);
    }
  }

  async click() {
    await this.locator.click();
  }
}
