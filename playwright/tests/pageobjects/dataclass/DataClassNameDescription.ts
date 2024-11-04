import { expect, type Locator, type Page } from '@playwright/test';
import { Collapsible } from '../abstract/Collapsible';
import { TextArea } from '../abstract/TextArea';

export class DataClassNameDescription {
  readonly collapsible: Collapsible;
  readonly name: TextArea;
  readonly description: TextArea;

  constructor(page: Page, parentLocator: Locator) {
    this.collapsible = new Collapsible(page, parentLocator, { label: 'Name / Description' });
    this.name = new TextArea(this.collapsible.locator, { label: 'Name' });
    this.description = new TextArea(this.collapsible.locator, { label: 'Description' });
  }

  async expectToHaveValues(name: string, description: string) {
    await this.collapsible.open();
    await expect(this.name.locator).toHaveValue(name);
    await expect(this.description.locator).toHaveValue(description);
  }

  async fillValues(description: string) {
    await this.collapsible.open();
    await this.description.locator.fill(description);
  }
}
