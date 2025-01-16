import { expect, type Locator, type Page } from '@playwright/test';

export class Collapsible {
  readonly locator: Locator;
  readonly state: Locator;

  constructor(page: Page, parentLocator: Locator, options?: { label?: string; nth?: number }) {
    if (options?.label) {
      this.locator = parentLocator.locator('.ui-collapsible').filter({
        has: page.locator('button').getByText(options.label, { exact: true })
      });
    } else {
      this.locator = parentLocator.locator('.ui-collapsible').nth(options?.nth ?? 0);
    }
    this.state = this.locator.locator('.ui-state-dot');
  }

  async open() {
    if ((await this.locator.getAttribute('data-state')) === 'closed') {
      await this.locator.click();
    }
  }

  async close() {
    if ((await this.locator.getAttribute('data-state')) === 'open') {
      await this.locator.click();
    }
  }

  async expectToBeOpen() {
    await expect(this.locator).toHaveAttribute('data-state', 'open');
  }

  async expectToBeClosed() {
    await expect(this.locator).toHaveAttribute('data-state', 'closed');
  }

  async expectToHaveWarning() {
    await expect(this.state).toHaveAttribute('data-state', 'warning');
  }

  async expectToHaveError() {
    await expect(this.state).toHaveAttribute('data-state', 'error');
  }
}
