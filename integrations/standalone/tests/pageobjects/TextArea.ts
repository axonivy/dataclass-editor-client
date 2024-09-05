import type { Locator } from '@playwright/test';

export class TextArea {
  readonly locator: Locator;

  constructor(parentLocator: Locator, options?: { label?: string; nth?: number }) {
    if (options?.label) {
      this.locator = parentLocator.getByRole('textbox', { name: options.label, exact: true });
    } else {
      this.locator = parentLocator.getByRole('textbox').nth(options?.nth ?? 0);
    }
  }
}
