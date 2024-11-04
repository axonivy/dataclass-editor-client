import { expect, type Locator, type Page } from '@playwright/test';
import { Collapsible } from '../abstract/Collapsible';
import { Select } from '../abstract/Select';

export class DataClassClassType {
  readonly collapsible: Collapsible;
  readonly select: Select;

  constructor(page: Page, parentLocator: Locator) {
    this.collapsible = new Collapsible(page, parentLocator, { label: 'Class type' });
    this.select = new Select(page, this.collapsible.locator);
  }

  async expectToHaveValues(classType: string) {
    await this.collapsible.open();
    await expect(this.select.locator).toHaveText(classType);
  }

  async fillValues(classType: string) {
    await this.collapsible.open();
    await this.select.choose(classType);
  }
}
