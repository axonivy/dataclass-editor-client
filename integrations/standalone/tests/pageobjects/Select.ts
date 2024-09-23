import type { Locator, Page } from '@playwright/test';
import { expect } from '@playwright/test';

export class Select {
  readonly page: Page;
  readonly locator: Locator;

  constructor(page: Page, parentLocator: Locator, options?: { label?: string; nth?: number }) {
    this.page = page;
    if (options?.label) {
      this.locator = parentLocator.getByRole('combobox', { name: options.label }).first();
    } else {
      this.locator = parentLocator.getByRole('combobox').nth(options?.nth ?? 0);
    }
  }

  async choose(value: string) {
    await this.locator.click();
    await this.page.getByRole('option', { name: value, exact: true }).first().click();
  }

  async expectToHaveValue(value: string) {
    await expect(this.locator).toHaveText(value);
  }
}
