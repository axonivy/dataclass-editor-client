import { expect, type Locator } from '@playwright/test';
import { Message } from '../../abstract/Message';

export type DatabaseFieldProperties = { [K in keyof FieldDatabaseFieldProperties['checkboxes']]: boolean };

export class FieldDatabaseFieldProperties {
  readonly locator: Locator;
  readonly checkboxes: {
    id: Locator;
    generated: Locator;
    notNullable: Locator;
    unique: Locator;
    notUpdateable: Locator;
    notInsertable: Locator;
    version: Locator;
  };
  readonly message: Message;

  constructor(parent: Locator) {
    this.locator = parent.getByTestId('database-field-properties');
    this.checkboxes = {
      id: this.locator.getByLabel('ID'),
      generated: this.locator.getByLabel('Generated'),
      notNullable: this.locator.getByLabel('Not nullable'),
      unique: this.locator.getByLabel('Unique'),
      notUpdateable: this.locator.getByLabel('Not updateable'),
      notInsertable: this.locator.getByLabel('Not insertable'),
      version: this.locator.getByLabel('Version')
    };
    this.message = new Message(this.locator);
  }

  async expectToBeChecked(properties: DatabaseFieldProperties) {
    for (const [property, locator] of Object.entries(this.checkboxes) as Array<[keyof DatabaseFieldProperties, Locator]>) {
      if (properties[property]) {
        await expect(locator).toBeChecked();
      } else {
        await expect(locator).not.toBeChecked();
      }
    }
  }

  async expectToBeEnabled(properties: DatabaseFieldProperties) {
    for (const [property, locator] of Object.entries(this.checkboxes) as Array<[keyof DatabaseFieldProperties, Locator]>) {
      if (properties[property]) {
        await expect(locator).toBeEnabled();
      } else {
        await expect(locator).toBeDisabled();
      }
    }
  }

  async fill(properties: DatabaseFieldProperties) {
    for (const [property, locator] of Object.entries(this.checkboxes) as Array<[keyof DatabaseFieldProperties, Locator]>) {
      if (properties[property] !== (await locator.isChecked())) {
        await locator.click();
      }
    }
  }
}
