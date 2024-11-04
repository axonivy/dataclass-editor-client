import { expect, type Locator, type Page } from '@playwright/test';
import { Collapsible } from '../abstract/Collapsible';
import { TextArea } from '../abstract/TextArea';

export class FieldNameTypeComment {
  readonly collapsible: Collapsible;
  readonly name: TextArea;
  readonly type: TextArea;
  readonly comment: TextArea;

  constructor(page: Page, parentLocator: Locator) {
    this.collapsible = new Collapsible(page, parentLocator, { label: 'Name / Type / Comment' });
    this.name = new TextArea(this.collapsible.locator, { label: 'Name' });
    this.type = new TextArea(this.collapsible.locator, { label: 'Type' });
    this.comment = new TextArea(this.collapsible.locator, { label: 'Comment' });
  }

  async expectToHaveValues(name: string, type: string, comment: string) {
    await this.collapsible.open();
    await expect(this.name.locator).toHaveValue(name);
    await expect(this.type.locator).toHaveValue(type);
    await expect(this.comment.locator).toHaveValue(comment);
  }

  async fillValues(name: string, type: string, comment: string) {
    await this.collapsible.open();
    await this.name.locator.fill(name);
    await this.type.locator.fill(type);
    await this.comment.locator.fill(comment);
  }
}
