import { type Locator, type Page } from '@playwright/test';

export class Collapsible {
  readonly locator: Locator;

  constructor(page: Page, parentLocator: Locator, options?: { label?: string; nth?: number }) {
    if (options?.label) {
      this.locator = parentLocator.locator('.ui-collapsible').filter({
        has: page.locator('button').getByText(options.label, { exact: true })
      });
    } else {
      this.locator = parentLocator.locator('.ui-collapsible').nth(options?.nth ?? 0);
    }
  }

  async isOpen() {
    return (await this.locator.getAttribute('data-state')) === 'open';
  }

  async open() {
    if (!(await this.isOpen())) {
      await this.locator.click();
    }
  }
}
