import { expect, type Locator, type Page } from '@playwright/test';

export class InscriptionTab {
  protected readonly page: Page;
  readonly locator: Locator;
  readonly trigger: Locator;
  readonly state: Locator;

  constructor(page: Page, parent: Locator, options?: { label?: string; nth?: number }) {
    this.page = page;
    this.locator = page.locator('.ui-inscription-tabs');
    if (options?.label) {
      this.trigger = page.getByRole('tab', { name: options.label });
    } else {
      this.trigger = page.getByRole('tab').nth(options?.nth ?? 0);
    }
    this.state = this.trigger.locator('.ui-state-dot');
  }

  async toggle() {
    await expect(this.trigger).toBeVisible();
    if ((await this.trigger.getAttribute('aria-selected')) !== 'true') {
      await this.trigger.click();
    }
    await this.expectToBeOpen();
  }

  async expectToBeOpen() {
    await expect(this.trigger).toHaveAttribute('aria-selected', 'true');
  }

  async expectToBeClosed() {
    await expect(this.trigger).toHaveAttribute('aria-selected', 'false');
  }

  async expectToHaveWarning() {
    await expect(this.state).toHaveAttribute('data-state', 'warning');
  }

  async expectToHaveError() {
    await expect(this.state).toHaveAttribute('data-state', 'error');
  }
}
