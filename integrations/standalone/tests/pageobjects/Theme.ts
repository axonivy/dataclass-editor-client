import { expect, type Locator, type Page } from '@playwright/test';
import { Switch } from './Switch';

export class Theme {
  readonly html: Locator;
  readonly switch: Switch;

  constructor(page: Page) {
    this.html = page.locator('html');
    this.switch = new Switch(page, { name: 'Theme' });
  }

  async expectToBeLight() {
    await expect(this.html).toHaveClass('light');
  }

  async expectToBeDark() {
    await expect(this.html).toHaveClass('dark');
  }
}
