import { expect, type Locator, type Page } from '@playwright/test';
import { Switch } from './Switch';

export class Theme {
  readonly html: Locator;
  readonly switch: Switch;

  constructor(page: Page) {
    this.html = page.locator('html');
    this.switch = new Switch(page, { name: 'Theme' });
  }

  async toggle() {
    await this.switch.click();
  }

  async expectLight() {
    await expect(this.html).toHaveClass('light');
  }

  async expectDark() {
    await expect(this.html).toHaveClass('dark');
  }
}