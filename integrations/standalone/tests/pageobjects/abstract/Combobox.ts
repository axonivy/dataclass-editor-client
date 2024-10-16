import { expect, type Locator } from '@playwright/test';

export class Combobox {
  readonly locator: Locator;

  constructor(parentLocator: Locator, options?: { label?: string; nth?: number }) {
    if (options?.label) {
      this.locator = parentLocator.getByRole('combobox', { name: options.label, exact: true });
    } else {
      this.locator = parentLocator.getByRole('combobox').nth(options?.nth ?? 0);
    }
  }

  async fill(value: string) {
    await this.locator.fill(value);
    await this.locator.blur();
  }

  async clear() {
    await this.locator.fill('');
    await this.locator.blur();
  }

  async expectToHavePlaceholder(palceholder: string) {
    await expect(this.locator).toHaveAttribute('placeholder', palceholder);
  }
}
