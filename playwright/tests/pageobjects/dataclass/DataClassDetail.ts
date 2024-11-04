import { type Locator, type Page } from '@playwright/test';
import { DataClassGeneral } from './DataClassGeneral';
import { DataClassEntity } from './entity/DataClassEntity';

export class DataClassDetail {
  readonly locator: Locator;
  readonly general: DataClassGeneral;
  readonly entity: DataClassEntity;

  constructor(page: Page, parentLocator: Locator) {
    this.locator = parentLocator.locator('.dataclass-detail-content');
    this.general = new DataClassGeneral(page, this.locator);
    this.entity = new DataClassEntity(page, this.locator);
  }
}
