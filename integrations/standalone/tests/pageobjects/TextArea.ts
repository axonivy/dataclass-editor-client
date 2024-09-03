import type { Locator } from '@playwright/test';
import { expect } from '@playwright/test';

export class TextArea {
  readonly locator: Locator;

  constructor(locator: Locator, options?: { label?: string; nth?: number }) {
    if (options?.label) {
      this.locator = locator.getByLabel(options.label, { exact: true });
    } else {
      this.locator = locator.getByRole('textbox').nth(options?.nth ?? 0);
    }
  }

  async expectValue(value: string) {
    await expect(this.locator).toHaveValue(value);
  }

  async expectToExist() {
    await expect(this.locator).toHaveCount(1);
  }

  async expectToNotExist() {
    await expect(this.locator).toHaveCount(0);
  }
}
