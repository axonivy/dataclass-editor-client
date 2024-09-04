import type { Locator } from '@playwright/test';
import { expect } from '@playwright/test';

export class TextArea {
  readonly locator: Locator;

  constructor(parentLocator: Locator, options?: { label?: string; nth?: number }) {
    if (options?.label) {
      this.locator = parentLocator.getByRole('textbox', { name: options.label, exact: true });
    } else {
      this.locator = parentLocator.getByRole('textbox').nth(options?.nth ?? 0);
    }
  }

  async expectToHaveValue(value: string) {
    await expect(this.locator).toHaveValue(value);
  }

  async expectToExist() {
    await expect(this.locator).not.toBeHidden();
  }

  async expectToBeHidden() {
    await expect(this.locator).toBeHidden();
  }

  async fill(value: string) {
    await this.locator.fill(value);
  }

  async clear() {
    await this.locator.clear();
  }
}
