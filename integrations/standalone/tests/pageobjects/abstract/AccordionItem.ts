import { expect, type Locator, type Page } from '@playwright/test';
import { Button } from './Button';

export class AccordionItem {
  readonly page: Page;
  readonly locator: Locator;
  readonly trigger: Button;

  constructor(page: Page, parentLocator: Locator, options?: { label?: string; nth?: number }) {
    this.page = page;
    if (options?.label) {
      this.locator = parentLocator.locator('.ui-accordion-item').filter({
        has: this.page.locator('h3').getByText(options.label, { exact: true })
      });
    } else {
      this.locator = parentLocator.locator('.ui-accordion-item').nth(options?.nth ?? 0);
    }
    this.trigger = new Button(this.locator);
  }

  async open() {
    if ((await this.locator.getAttribute('data-state')) === 'closed') {
      await this.trigger.locator.click();
    }
  }

  async close() {
    if ((await this.locator.getAttribute('data-state')) === 'open') {
      await this.trigger.locator.click();
    }
  }

  async reopen() {
    await this.close();
    await this.open();
  }

  async expectToBeOpen() {
    await expect(this.locator).toHaveAttribute('data-state', 'open');
  }

  async expectToBeClosed() {
    await expect(this.locator).toHaveAttribute('data-state', 'closed');
  }
}
