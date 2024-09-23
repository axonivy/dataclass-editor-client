import { type Locator, type Page } from '@playwright/test';

export class AccordionItem {
  readonly locator: Locator;

  constructor(page: Page, parentLocator: Locator, options?: { label?: string; nth?: number }) {
    if (options?.label) {
      this.locator = parentLocator.locator('.ui-accordion-item').filter({
        has: page.locator('h3').getByText(options.label, { exact: true })
      });
    } else {
      this.locator = parentLocator.locator('.ui-accordion-item').nth(options?.nth ?? 0);
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
