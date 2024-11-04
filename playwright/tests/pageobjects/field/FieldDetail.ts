import type { Locator, Page } from '@playwright/test';
import { FieldGeneral } from './FieldGeneral';
import { FieldEntity } from './entity/FieldEntity';

export class FieldDetail {
  readonly locator: Locator;
  readonly general: FieldGeneral;
  readonly entity: FieldEntity;

  constructor(page: Page, parentLocator: Locator) {
    this.locator = parentLocator.locator('.field-detail-content');
    this.general = new FieldGeneral(page, this.locator);
    this.entity = new FieldEntity(page, this.locator);
  }
}
