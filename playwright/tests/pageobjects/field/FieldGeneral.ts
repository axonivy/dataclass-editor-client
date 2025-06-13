import type { Locator, Page } from '@playwright/test';
import { InscriptionTab } from '../abstract/InscriptionTab';
import { Annotations } from '../Annotations';
import { FieldNameTypeComment } from './FieldNameTypeComment';
import { FieldProperties } from './FieldProperties';

export class FieldGeneral {
  readonly inscriptionTab: InscriptionTab;
  readonly nameTypeComment: FieldNameTypeComment;
  readonly properties: FieldProperties;
  readonly annotations: Annotations;

  constructor(page: Page, parentLocator: Locator) {
    this.inscriptionTab = new InscriptionTab(page, parentLocator, { label: 'General' });
    this.nameTypeComment = new FieldNameTypeComment(page, this.inscriptionTab.locator);
    this.properties = new FieldProperties(page, this.inscriptionTab.locator);
    this.annotations = new Annotations(page, this.inscriptionTab.locator);
  }

  async expectToHaveValues(name: string, type: string, comment: string, persistent: boolean, annotations: Array<string>) {
    await this.inscriptionTab.toggle();
    await this.nameTypeComment.expectToHaveValues(name, type, comment);
    await this.properties.expectToHaveValues(persistent);
    await this.annotations.expectToHaveValues(annotations);
  }

  async fillValues(name: string, type: string, comment: string, persistent: boolean, annotations: Array<string>) {
    await this.inscriptionTab.toggle();
    await this.nameTypeComment.fillValues(name, type, comment);
    await this.properties.fillValues(persistent);
    await this.annotations.fillValues(...annotations);
  }
}
