import type { Locator, Page } from '@playwright/test';
import { AccordionItem } from '../../abstract/AccordionItem';
import { DataClassDatabaseTable } from './DataClassDatabaseTable';

export class DataClassEntity {
  readonly accordion: AccordionItem;
  readonly databaseTable: DataClassDatabaseTable;

  constructor(page: Page, parentLocator: Locator) {
    this.accordion = new AccordionItem(page, parentLocator, { label: 'Entity' });
    this.databaseTable = new DataClassDatabaseTable(page, this.accordion.locator);
  }

  async expectToHaveValues(databaseTableName: string) {
    await this.accordion.open();
    await this.databaseTable.expectToHaveValues(databaseTableName);
  }

  async fillValues(databaseTableName: string) {
    await this.accordion.open();
    await this.databaseTable.fillValues(databaseTableName);
  }
}
