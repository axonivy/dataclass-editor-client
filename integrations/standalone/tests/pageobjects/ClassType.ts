import { expect, type Locator } from '@playwright/test';

export class ClassType {
  readonly locator: Locator;

  constructor(locator: Locator) {
    this.locator = locator.getByRole('group');
  }

  async expectValue(classType: string) {
    await expect(this.locator.getByTestId(classType)).toHaveAttribute('data-state', 'on');
  }

  async expectToExist() {
    await expect(this.locator).toHaveCount(1);
  }

  async expectToNotExist() {
    await expect(this.locator).toHaveCount(0);
  }
}
