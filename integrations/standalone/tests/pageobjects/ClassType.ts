import { expect, type Locator } from '@playwright/test';

export class ClassType {
  readonly locator: Locator;

  constructor(locator: Locator) {
    this.locator = locator.getByRole('group');
  }

  async expectToHaveValue(classType: string) {
    await expect(this.locator.getByRole('radio', { name: classType, exact: true })).toHaveAttribute('data-state', 'on');
  }

  async expectToExist() {
    await expect(this.locator).toHaveCount(1);
  }

  async expectToBeHidden() {
    await expect(this.locator).toBeHidden();
  }
}
