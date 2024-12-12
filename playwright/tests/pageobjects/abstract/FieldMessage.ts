import { expect, type Locator } from '@playwright/test';

export class FieldMessage {
  readonly locator: Locator;

  constructor(parentLocator: Locator, options: { label: string }) {
    this.locator = parentLocator.getByLabel(options.label, { exact: true }).locator('.ui-message');
  }

  async expectToHaveErrorMessage(message: string) {
    await expect(this.locator).toHaveText(message);
    await expect(this.locator).toHaveAttribute('data-state', 'error');
  }

  async expectToHaveWarningMessage(message: string) {
    await expect(this.locator).toHaveText(message);
    await expect(this.locator).toHaveAttribute('data-state', 'warning');
  }
}
