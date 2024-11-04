import { type Locator } from '@playwright/test';

export class Button {
  readonly locator: Locator;

  constructor(parentLocator: Locator, options?: { name?: string; nth?: number }) {
    if (options?.name) {
      this.locator = parentLocator.getByRole('button', { name: options.name });
    } else {
      this.locator = parentLocator.getByRole('button').nth(options?.nth ?? 0);
    }
  }
}
