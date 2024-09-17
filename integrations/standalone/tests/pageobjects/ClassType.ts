import { expect, type Locator } from '@playwright/test';

export class ClassType {
  readonly locator: Locator;

  constructor(locator: Locator) {
    this.locator = locator.getByRole('group');
  }

  button(classType: string) {
    return this.locator.getByRole('radio', { name: classType, exact: true });
  }

  async expectToHaveValue(classType: string) {
    await expect(this.button(classType)).toHaveAttribute('data-state', 'on');
  }
}
