import { expect, type Locator } from '@playwright/test';
import { Message } from './Message';

export class TextArea {
  readonly parent: Locator;
  readonly locator: Locator;

  constructor(parent: Locator, options?: { label?: string; nth?: number }) {
    this.parent = parent;
    if (options?.label) {
      this.locator = parent.getByRole('textbox', { name: options.label, exact: true });
    } else {
      this.locator = parent.getByRole('textbox').nth(options?.nth ?? 0);
    }
  }

  async expectToHavePlaceholder(palceholder: string) {
    await expect(this.locator).toHaveAttribute('placeholder', palceholder);
  }

  async message() {
    const describedBy = await this.locator.getAttribute('aria-describedby');
    if (!describedBy) {
      throw new Error('aria-describedby attribute is missing');
    }
    return new Message(this.parent, describedBy);
  }
}
