import { expect, type Locator, type Page } from '@playwright/test';
import { Collapsible } from '../../abstract/Collapsible';
import { TextArea } from '../../abstract/TextArea';

export type FieldDatabaseFieldProperties = { [K in keyof FieldDatabaseField['properties']]: boolean };

export class FieldDatabaseField {
  readonly collapsible: Collapsible;
  readonly name: TextArea;
  readonly length: TextArea;
  readonly properties: {
    id: Locator;
    generated: Locator;
    notNullable: Locator;
    unique: Locator;
    notUpdateable: Locator;
    notInsertable: Locator;
    Version: Locator;
  };

  constructor(page: Page, parentLocator: Locator) {
    this.collapsible = new Collapsible(page, parentLocator, { label: 'Database Field' });
    this.name = new TextArea(this.collapsible.locator, { label: 'Name' });
    this.length = new TextArea(this.collapsible.locator, { label: 'Length' });
    this.properties = {
      id: this.collapsible.locator.getByLabel('ID'),
      generated: this.collapsible.locator.getByLabel('Generated'),
      notNullable: this.collapsible.locator.getByLabel('Not nullable'),
      unique: this.collapsible.locator.getByLabel('Unique'),
      notUpdateable: this.collapsible.locator.getByLabel('Not updateable'),
      notInsertable: this.collapsible.locator.getByLabel('Not insertable'),
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
      if (properties[property]) {
        await expect(locator).toBeChecked();
      } else {
        await expect(locator).not.toBeChecked();
      }
    }
  }

  async expectPropertiesToHaveEnabledState(properties: FieldDatabaseFieldProperties) {
    for (const [property, locator] of Object.entries(this.properties) as Array<[keyof FieldDatabaseFieldProperties, Locator]>) {
      if (properties[property]) {
        await expect(locator).toBeEnabled();
      } else {
        await expect(locator).toBeDisabled();
      }
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
