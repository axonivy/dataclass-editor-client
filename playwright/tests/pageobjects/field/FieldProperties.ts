import { expect, type Locator, type Page } from '@playwright/test';
import { Collapsible } from '../abstract/Collapsible';

export class FieldProperties {
  readonly collapsible: Collapsible;
  readonly persistent: Locator;

  constructor(page: Page, parentLocator: Locator) {
    this.collapsible = new Collapsible(page, parentLocator, { label: 'Properties' });
    this.persistent = this.collapsible.locator.getByLabel('Persistent');
  }

  async expectToHaveValues(persistent: boolean) {
    await this.collapsible.open();
    expect(await this.persistent.isChecked()).toEqual(persistent);
  }

  async fillValues(persistent: boolean) {
    await this.collapsible.open();
    if (persistent !== (await this.persistent.isChecked())) {
      await this.persistent.click();
    }
  }
}
