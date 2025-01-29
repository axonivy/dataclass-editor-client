import { type Locator, type Page } from '@playwright/test';
import { AccordionItem } from '../abstract/AccordionItem';
import { Annotations } from '../Annotations';
import { DataClassClassType } from './DataClassClassType';
import { DataClassNameDescription } from './DataClassNameDescription';

export class DataClassGeneral {
  readonly accordion: AccordionItem;
  readonly nameDescription: DataClassNameDescription;
  readonly annotations: Annotations;
  readonly classType: DataClassClassType;

  constructor(page: Page, parentLocator: Locator) {
    this.accordion = new AccordionItem(page, parentLocator, { label: 'General' });
    this.nameDescription = new DataClassNameDescription(page, this.accordion.locator);
    this.annotations = new Annotations(page, this.accordion.locator);
    this.classType = new DataClassClassType(page, this.accordion.locator);
  }

  async expectToHaveValues(name: string, description: string, annotations: Array<string>, classType: string) {
    await this.accordion.open();
    await this.nameDescription.expectToHaveValues(name, description);
    await this.annotations.expectToHaveValues(annotations);
    await this.classType.expectToHaveValues(classType);
  }

  async fillValues(description: string, annotations: Array<string>, classType: string) {
    await this.accordion.open();
    await this.nameDescription.fillValues(description);
    await this.annotations.fillValues(...annotations);
    await this.classType.fillValues(classType);
  }
}
