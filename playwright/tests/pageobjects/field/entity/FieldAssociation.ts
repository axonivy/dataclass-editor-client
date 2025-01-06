import { expect, type Locator, type Page } from '@playwright/test';
import { Collapsible } from '../../abstract/Collapsible';
import { FieldMessage } from '../../abstract/FieldMessage';
import { Select } from '../../abstract/Select';

export type FieldAssociationCascadeTypes = { [K in keyof FieldAssociation['cascadeTypes']]: boolean };

export class FieldAssociation {
  readonly collapsible: Collapsible;
  readonly cardinality: Select;
  readonly cardinalityMessage: FieldMessage;
  readonly cascadeTypes: {
    all: Locator;
    persist: Locator;
    merge: Locator;
    remove: Locator;
    refresh: Locator;
  };
  readonly mappedBy: Select;
  readonly removeOrphans: Locator;

  constructor(page: Page, parentLocator: Locator) {
    this.collapsible = new Collapsible(page, parentLocator, { label: 'Association' });
    this.cardinality = new Select(page, this.collapsible.locator, { label: 'Cardinality' });
    this.cardinalityMessage = new FieldMessage(this.collapsible.locator, { label: 'Cardinality' });
    this.cascadeTypes = {
      all: this.collapsible.locator.getByLabel('All'),
      persist: this.collapsible.locator.getByLabel('Persist'),
      merge: this.collapsible.locator.getByLabel('Merge'),
      remove: this.collapsible.locator.getByLabel('Remove', { exact: true }),
      refresh: this.collapsible.locator.getByLabel('Refresh')
    };
    this.mappedBy = new Select(page, this.collapsible.locator, { label: 'Mapped by' });
    this.removeOrphans = this.collapsible.locator.getByLabel('Remove orphans');
  }

  async expectToHaveValues(cardinality: string, cascadeTypes: FieldAssociationCascadeTypes, mappedBy: string, removeOrphans: boolean) {
    await this.collapsible.open();
    await expect(this.cardinality.locator).toHaveText(cardinality);
    await this.expectCascadeTypesToHaveCheckedState(cascadeTypes);
    await expect(this.mappedBy.locator).toHaveText(mappedBy);
    if (removeOrphans) {
      await expect(this.removeOrphans).toBeChecked();
    } else {
      await expect(this.removeOrphans).not.toBeChecked();
    }
  }

  async expectCascadeTypesToHaveCheckedState(cascadeTypes: FieldAssociationCascadeTypes) {
    for (const [cascadeType, locator] of Object.entries(this.cascadeTypes) as Array<[keyof FieldAssociationCascadeTypes, Locator]>) {
      if (cascadeTypes[cascadeType]) {
        await expect(locator).toBeChecked();
      } else {
        await expect(locator).not.toBeChecked();
      }
    }
  }

  async expectCascadeTypesToBeEnabled() {
    for (const locator of Object.values(this.cascadeTypes)) {
      await expect(locator).toBeEnabled();
    }
  }

  async expectCascadeTypesToBeDisabled() {
    for (const locator of Object.values(this.cascadeTypes)) {
      await expect(locator).toBeDisabled();
    }
  }

  async fillValues(cardinality: string, cascadeTypes: FieldAssociationCascadeTypes, mappedBy: string | undefined, removeOrphans: boolean) {
    await this.collapsible.open();
    await this.cardinality.choose(cardinality);
    await this.fillCascadeTypes(cascadeTypes);
    if (mappedBy !== undefined) {
      await this.mappedBy.choose(mappedBy);
    }
    if (removeOrphans !== (await this.removeOrphans.isChecked())) {
      await this.removeOrphans.click();
    }
  }

  async fillCascadeTypes(cascadeTypes: FieldAssociationCascadeTypes) {
    for (const [cascadeType, locator] of Object.entries(this.cascadeTypes) as Array<[keyof FieldAssociationCascadeTypes, Locator]>) {
      if (cascadeTypes[cascadeType] !== (await locator.isChecked())) {
        await locator.click();
      }
    }
  }
}
