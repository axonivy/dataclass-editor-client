import { expect, type Locator, type Page } from '@playwright/test';
import { DataClassDetail } from './dataclass/DataClassDetail';
import { FieldDetail } from './field/FieldDetail';

export class Detail {
  readonly locator: Locator;
  readonly title: Locator;
  readonly dataClass: DataClassDetail;
  readonly field: FieldDetail;

  constructor(page: Page) {
    this.locator = page.locator('.detail-container');
    this.title = this.locator.locator('.detail-header');
    this.dataClass = new DataClassDetail(page, this.locator);
    this.field = new FieldDetail(page, this.locator);
  }

  async expectToBeDataClass(isEntity = false) {
    await expect(this.dataClass.locator).toBeVisible();
    expect(await this.dataClass.entity.accordion.locator.isVisible()).toEqual(isEntity);
    await expect(this.field.locator).toBeHidden();
  }

  async expectToBeField(isEntity = false) {
    await expect(this.field.locator).toBeVisible();
    expect(await this.field.entity.accordion.locator.isVisible()).toEqual(isEntity);
    await expect(this.dataClass.locator).toBeHidden();
  }
}
