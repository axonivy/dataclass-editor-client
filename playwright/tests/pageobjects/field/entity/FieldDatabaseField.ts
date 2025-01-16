import { expect, type Locator, type Page } from '@playwright/test';
import { Collapsible } from '../../abstract/Collapsible';
import { TextArea } from '../../abstract/TextArea';
import { FieldDatabaseFieldProperties, type DatabaseFieldProperties } from './FieldDatabaseFieldProperties';

export class FieldDatabaseField {
  readonly collapsible: Collapsible;
  readonly name: TextArea;
  readonly length: TextArea;
  readonly properties: FieldDatabaseFieldProperties;

  constructor(page: Page, parentLocator: Locator) {
    this.collapsible = new Collapsible(page, parentLocator, { label: 'Database Field' });
    this.name = new TextArea(this.collapsible.locator, { label: 'Name' });
    this.length = new TextArea(this.collapsible.locator, { label: 'Length' });
    this.properties = new FieldDatabaseFieldProperties(this.collapsible.locator);
  }

  async expectToHaveValues(name: string, length: string, properties: DatabaseFieldProperties) {
    await this.collapsible.open();
    await expect(this.name.locator).toHaveValue(name);
    await expect(this.length.locator).toHaveValue(length);
    await this.properties.expectToBeChecked(properties);
  }

  async fillValues(name: string, length: string, properties: DatabaseFieldProperties) {
    await this.collapsible.open();
    await this.name.locator.fill(name);
    await this.length.locator.fill(length);
    await this.properties.fill(properties);
  }
}
