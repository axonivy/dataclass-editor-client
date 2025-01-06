import { expect, type Locator, type Page } from '@playwright/test';
import { Collapsible } from '../abstract/Collapsible';
import { Message } from '../abstract/Message';

export class FieldProperties {
  readonly collapsible: Collapsible;
  readonly persistent: Locator;
  readonly message: Message;

  constructor(page: Page, parentLocator: Locator) {
    this.collapsible = new Collapsible(page, parentLocator, { label: 'Properties' });
    this.persistent = this.collapsible.locator.getByLabel('Persistent');
    this.message = new Message(this.collapsible.locator);
  }

  async expectToHaveValues(persistent: boolean) {
    await this.collapsible.open();
    if (persistent) {
      await expect(this.persistent).toBeChecked();
    } else {
      await expect(this.persistent).not.toBeChecked();
    }
  }

  async fillValues(persistent: boolean) {
    await this.collapsible.open();
    if (persistent !== (await this.persistent.isChecked())) {
      await this.persistent.click();
    }
  }
}
