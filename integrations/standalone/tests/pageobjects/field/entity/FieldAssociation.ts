import { expect, type Locator, type Page } from '@playwright/test';
import { Collapsible } from '../../abstract/Collapsible';
import { Select } from '../../abstract/Select';
import { TextArea } from '../../abstract/TextArea';

export type FieldAssociationCascadeTypes = { [K in keyof FieldAssociation['cascadeTypes']]: boolean };

export class FieldAssociation {
  readonly collapsible: Collapsible;
  readonly cardinality: Select;
  readonly cascadeTypes: {
    All: Locator;
    Persist: Locator;
    Merge: Locator;
    Remove: Locator;
    Refresh: Locator;
  };
  readonly mappedBy: TextArea;
  readonly removeOrphans: Locator;

  constructor(page: Page, parentLocator: Locator) {
    this.collapsible = new Collapsible(page, parentLocator, { label: 'Association' });
    this.cardinality = new Select(page, this.collapsible.locator, { label: 'Cardinality' });
    this.cascadeTypes = {
      All: this.collapsible.locator.getByLabel('All'),
      Persist: this.collapsible.locator.getByLabel('Persist'),
      Merge: this.collapsible.locator.getByLabel('Merge'),
      Remove: this.collapsible.locator.getByLabel('Remove', { exact: true }),
      Refresh: this.collapsible.locator.getByLabel('Refresh')
    };
    this.mappedBy = new TextArea(this.collapsible.locator, { label: 'Mapped by' });
    this.removeOrphans = this.collapsible.locator.getByLabel('Remove orphans');
  }

  async expectToHaveValues(cardinality: string, cascadeTypes: FieldAssociationCascadeTypes, mappedBy: string, removeOrphans: boolean) {
    await this.collapsible.open();
    await expect(this.cardinality.locator).toHaveText(cardinality);
    await this.expectCascadeTypesToHaveCheckedState(cascadeTypes);
    await expect(this.mappedBy.locator).toHaveValue(mappedBy);
    expect(await this.removeOrphans.isChecked()).toEqual(removeOrphans);
  }

  async expectCascadeTypesToHaveCheckedState(cascadeTypes: FieldAssociationCascadeTypes) {
    for (const [cascadeType, locator] of Object.entries(this.cascadeTypes) as Array<[keyof FieldAssociationCascadeTypes, Locator]>) {
      expect(await locator.isChecked()).toEqual(cascadeTypes[cascadeType]);
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

  async fillValues(cardinality: string, cascadeTypes: FieldAssociationCascadeTypes, mappedBy: string, removeOrphans: boolean) {
    await this.collapsible.open();
    await this.cardinality.choose(cardinality);
    await this.fillCascadeTypes(cascadeTypes);
    await this.mappedBy.locator.fill(mappedBy);
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