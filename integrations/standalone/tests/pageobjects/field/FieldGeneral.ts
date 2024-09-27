import type { Locator, Page } from '@playwright/test';
import { AccordionItem } from '../abstract/AccordionItem';
import { Annotations } from '../Annotations';
import { FieldNameTypeComment } from './FieldNameTypeComment';
import { FieldProperties } from './FieldProperties';

export class FieldGeneral {
  readonly accordion: AccordionItem;
  readonly nameTypeComment: FieldNameTypeComment;
  readonly properties: FieldProperties;
  readonly annotations: Annotations;

  constructor(page: Page, parentLocator: Locator) {
    this.accordion = new AccordionItem(page, parentLocator, { label: 'General' });
    this.nameTypeComment = new FieldNameTypeComment(page, this.accordion.locator);
    this.properties = new FieldProperties(page, this.accordion.locator);
    this.annotations = new Annotations(page, this.accordion.locator);
  }

  async expectToHaveValues(name: string, type: string, comment: string, persistent: boolean, annotations: Array<string>) {
    await this.accordion.open();
    await this.nameTypeComment.expectToHaveValues(name, type, comment);
    await this.properties.expectToHaveValues(persistent);
    await this.annotations.expectToHaveValues(annotations);
  }

  async fillValues(name: string, type: string, comment: string, persistent: boolean, annotations: Array<string>) {
    await this.accordion.open();
    await this.nameTypeComment.fillValues(name, type, comment);
    await this.properties.fillValues(persistent);
    await this.annotations.fillValues(annotations);
  }
}
