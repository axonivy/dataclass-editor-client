import type { Locator, Page } from '@playwright/test';
import { AccordionItem } from '../../abstract/AccordionItem';
import { FieldAssociation } from './FieldAssociation';
import { FieldDatabaseField } from './FieldDatabaseField';

export class FieldEntity {
  readonly accordion: AccordionItem;
  readonly databaseField: FieldDatabaseField;
  readonly association: FieldAssociation;

  constructor(page: Page, parentLocator: Locator) {
    this.accordion = new AccordionItem(page, parentLocator, { label: 'Entity' });
    this.databaseField = new FieldDatabaseField(page, this.accordion.locator);
    this.association = new FieldAssociation(page, this.accordion.locator);
  }
}
