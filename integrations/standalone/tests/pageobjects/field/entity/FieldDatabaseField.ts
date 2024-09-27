import { expect, type Locator, type Page } from '@playwright/test';
import { Collapsible } from '../../abstract/Collapsible';
import { TextArea } from '../../abstract/TextArea';

export type FieldDatabaseFieldProperties = { [K in keyof FieldDatabaseField['properties']]: boolean };

export class FieldDatabaseField {
  readonly collapsible: Collapsible;
  readonly name: TextArea;
  readonly length: TextArea;
  readonly properties: {
    ID: Locator;
    Generated: Locator;
    'Not nullable': Locator;
    Unique: Locator;
    'Not updateable': Locator;
    'Not insertable': Locator;
    Version: Locator;
  };

  constructor(page: Page, parentLocator: Locator) {
    this.collapsible = new Collapsible(page, parentLocator, { label: 'Database Field' });
    this.name = new TextArea(this.collapsible.locator, { label: 'Name' });
    this.length = new TextArea(this.collapsible.locator, { label: 'Length' });
    this.properties = {
      ID: this.collapsible.locator.getByLabel('ID'),
      Generated: this.collapsible.locator.getByLabel('Generated'),
      'Not nullable': this.collapsible.locator.getByLabel('Not nullable'),
      Unique: this.collapsible.locator.getByLabel('Unique'),
      'Not updateable': this.collapsible.locator.getByLabel('Not updateable'),
      'Not insertable': this.collapsible.locator.getByLabel('Not insertable'),
      Version: this.collapsible.locator.getByLabel('Version')
    };
  }

  async expectToHaveValues(name: string, length: string, properties: FieldDatabaseFieldProperties) {
    await this.collapsible.open();
    await expect(this.name.locator).toHaveValue(name);
    await expect(this.length.locator).toHaveValue(length);
    await this.expectPropertiesToHaveCheckedState(properties);
  }

  async expectPropertiesToHaveCheckedState(properties: FieldDatabaseFieldProperties) {
    for (const [property, locator] of Object.entries(this.properties) as Array<[keyof FieldDatabaseFieldProperties, Locator]>) {
      expect(await locator.isChecked()).toEqual(properties[property]);
    }
  }

  async expectPropertiesToHaveEnabledState(properties: FieldDatabaseFieldProperties) {
    for (const [property, locator] of Object.entries(this.properties) as Array<[keyof FieldDatabaseFieldProperties, Locator]>) {
      expect(await locator.isEnabled()).toEqual(properties[property]);
    }
  }

  async fillValues(name: string, length: string, properties: FieldDatabaseFieldProperties) {
    await this.collapsible.open();
    await this.name.locator.fill(name);
    await this.length.locator.fill(length);
    await this.fillProperties(properties);
  }

  async fillProperties(properties: FieldDatabaseFieldProperties) {
    for (const [property, locator] of Object.entries(this.properties) as Array<[keyof FieldDatabaseFieldProperties, Locator]>) {
      if (properties[property] !== (await locator.isChecked())) {
        await locator.click();
      }
    }
  }
}
