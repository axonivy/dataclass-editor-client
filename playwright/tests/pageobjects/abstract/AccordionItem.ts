import { expect, type Locator, type Page } from '@playwright/test';
import { Button } from './Button';

export class AccordionItem {
  readonly page: Page;
  readonly locator: Locator;
  readonly trigger: Button;
  readonly state: Locator;

  constructor(page: Page, parent: Locator, options?: { label?: string; nth?: number }) {
    this.page = page;
    if (options?.label) {
      this.locator = parent.locator('.ui-accordion-item').filter({
        has: this.page.locator('h3').getByText(options.label, { exact: true })
      });
    } else {
      this.locator = parent.locator('.ui-accordion-item').nth(options?.nth ?? 0);
    }
    this.trigger = new Button(this.locator);
    this.state = this.trigger.locator.locator('.ui-state-dot');
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

  async expectToHaveWarning() {
    await expect(this.state).toHaveAttribute('data-state', 'warning');
  }

  async expectToHaveError() {
    await expect(this.state).toHaveAttribute('data-state', 'error');
  }
}
