import type { Locator, Page } from '@playwright/test';
import { InscriptionTab } from '../../abstract/InscriptionTab';
import { DataClassDatabaseTable } from './DataClassDatabaseTable';

export class DataClassEntity {
  readonly inscriptionTab: InscriptionTab;
  readonly databaseTable: DataClassDatabaseTable;

  constructor(page: Page, parentLocator: Locator) {
    this.inscriptionTab = new InscriptionTab(page, parentLocator, { label: 'Entity' });
    this.databaseTable = new DataClassDatabaseTable(page, this.inscriptionTab.locator);
  }

  async expectToHaveValues(databaseTableName: string) {
    await this.inscriptionTab.toggle();
    await this.databaseTable.expectToHaveValues(databaseTableName);
  }

  async fillValues(databaseTableName: string) {
    await this.inscriptionTab.toggle();
    await this.databaseTable.fillValues(databaseTableName);
  }
}
