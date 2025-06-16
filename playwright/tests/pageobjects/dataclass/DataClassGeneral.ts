import { type Locator, type Page } from '@playwright/test';
import { InscriptionTab } from '../abstract/InscriptionTab';
import { Annotations } from '../Annotations';
import { DataClassClassType } from './DataClassClassType';
import { DataClassNameDescription } from './DataClassNameDescription';

export class DataClassGeneral {
  readonly inscriptionTab: InscriptionTab;
  readonly nameDescription: DataClassNameDescription;
  readonly annotations: Annotations;
  readonly classType: DataClassClassType;

  constructor(page: Page, parentLocator: Locator) {
    this.inscriptionTab = new InscriptionTab(page, parentLocator, { label: 'General' });
    this.nameDescription = new DataClassNameDescription(page, this.inscriptionTab.locator);
    this.annotations = new Annotations(page, this.inscriptionTab.locator);
    this.classType = new DataClassClassType(page, this.inscriptionTab.locator);
  }

  async expectToHaveValues(name: string, description: string, annotations: Array<string>, classType: string) {
    await this.inscriptionTab.toggle();
    await this.nameDescription.expectToHaveValues(name, description);
    await this.annotations.expectToHaveValues(annotations);
    await this.classType.expectToHaveValues(classType);
  }

  async fillValues(description: string, annotations: Array<string>, classType: string) {
    await this.inscriptionTab.toggle();
    await this.nameDescription.fillValues(description);
    await this.annotations.fillValues(...annotations);
    await this.classType.fillValues(classType);
  }
}
