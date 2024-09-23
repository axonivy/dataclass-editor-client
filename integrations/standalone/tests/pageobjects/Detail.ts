import { expect, type Locator, type Page } from '@playwright/test';
import { AccordionItem } from './AccordionItem';
import { Annotations } from './Annotations';
import { Collapsible } from './Collapsible';
import { Select } from './Select';
import { TextArea } from './TextArea';

export class Detail {
  readonly locator: Locator;
  readonly title: Locator;
  readonly general: AccordionItem;
  readonly nameDescription: Collapsible;
  readonly dataClassName: TextArea;
  readonly description: TextArea;
  readonly annotations: Annotations;
  readonly classTypeCollapsible: Collapsible;
  readonly classTypeSelect: Select;
  readonly nameTypeComment: Collapsible;
  readonly fieldName: TextArea;
  readonly type: TextArea;
  readonly comment: TextArea;
  readonly properties: Collapsible;
  readonly persistent: Locator;
  readonly entity: AccordionItem;
  readonly databaseTable: Collapsible;
  readonly databaseTableName: TextArea;
  readonly databaseField: Collapsible;
  readonly databaseFieldName: TextArea;
  readonly databaseFieldLength: TextArea;
  readonly databaseFieldProperties: {
    ID: Locator;
    Generated: Locator;
    'Not nullable': Locator;
    Unique: Locator;
    'Not updateable': Locator;
    'Not insertable': Locator;
    Version: Locator;
  };
  readonly association: Collapsible;
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

  constructor(page: Page) {
    this.locator = page.locator('.detail-container');
    this.title = this.locator.locator('.detail-header');
    this.general = new AccordionItem(page, this.locator, { label: 'General' });
    this.nameDescription = new Collapsible(page, this.general.locator, { label: 'Name / Description' });
    this.dataClassName = new TextArea(this.nameDescription.locator, { label: 'Name' });
    this.description = new TextArea(this.nameDescription.locator, { label: 'Description' });
    this.annotations = new Annotations(page, this.general.locator);
    this.classTypeCollapsible = new Collapsible(page, this.general.locator, { label: 'Class type' });
    this.classTypeSelect = new Select(page, this.classTypeCollapsible.locator);
    this.nameTypeComment = new Collapsible(page, this.general.locator, { label: 'Name / Type / Comment' });
    this.fieldName = new TextArea(this.nameTypeComment.locator, { label: 'Name' });
    this.type = new TextArea(this.nameTypeComment.locator, { label: 'Type' });
    this.comment = new TextArea(this.nameTypeComment.locator, { label: 'Comment' });
    this.properties = new Collapsible(page, this.general.locator, { label: 'Properties' });
    this.persistent = this.properties.locator.getByLabel('Persistent');
    this.entity = new AccordionItem(page, this.locator, { label: 'Entity' });
    this.databaseTable = new Collapsible(page, this.entity.locator, { label: 'Database Table' });
    this.databaseTableName = new TextArea(this.databaseTable.locator, { label: 'Name' });
    this.databaseField = new Collapsible(page, this.entity.locator, { label: 'Database Field' });
    this.databaseFieldName = new TextArea(this.databaseField.locator, { label: 'Name' });
    this.databaseFieldLength = new TextArea(this.databaseField.locator, { label: 'Length' });
    this.databaseFieldProperties = {
      ID: this.databaseField.locator.getByLabel('ID'),
      Generated: this.databaseField.locator.getByLabel('Generated'),
      'Not nullable': this.databaseField.locator.getByLabel('Not nullable'),
      Unique: this.databaseField.locator.getByLabel('Unique'),
      'Not updateable': this.databaseField.locator.getByLabel('Not updateable'),
      'Not insertable': this.databaseField.locator.getByLabel('Not insertable'),
      Version: this.databaseField.locator.getByLabel('Version')
    };
    this.association = new Collapsible(page, this.entity.locator, { label: 'Association' });
    this.cardinality = new Select(page, this.association.locator, { label: 'Cardinality' });
    this.cascadeTypes = {
      All: this.association.locator.getByLabel('All'),
      Persist: this.association.locator.getByLabel('Persist'),
      Merge: this.association.locator.getByLabel('Merge'),
      Remove: this.association.locator.getByLabel('Remove', { exact: true }),
      Refresh: this.association.locator.getByLabel('Refresh')
    };
    this.mappedBy = new TextArea(this.association.locator, { label: 'Mapped by' });
    this.removeOrphans = this.association.locator.getByLabel('Remove orphans');
  }

  async expectToBeDataClass(entityVisible?: boolean) {
    await this.general.open();

    await expect(this.nameDescription.locator).toBeVisible();
    await this.nameDescription.open();
    await expect(this.dataClassName.locator).toBeDisabled();
    await expect(this.annotations.collapsible.locator).toBeVisible();
    await expect(this.classTypeCollapsible.locator).toBeVisible();

    await expect(this.nameTypeComment.locator).toBeHidden();
    await expect(this.properties.locator).toBeHidden();

    if (!entityVisible) {
      await expect(this.entity.locator).toBeHidden();
    }
  }

  async expectToBeEntityClass() {
    await this.expectToBeDataClass(true);
    await this.entity.open();

    await expect(this.databaseTable.locator).toBeVisible();

    await expect(this.databaseField.locator).toBeHidden();
    await expect(this.association.locator).toBeHidden();
  }

  async expectToBeDataClassField(entityVisible?: boolean) {
    await this.general.open();

    await expect(this.nameTypeComment.locator).toBeVisible();
    await expect(this.properties.locator).toBeVisible();
    await expect(this.annotations.collapsible.locator).toBeVisible();

    await expect(this.nameDescription.locator).toBeHidden();
    await expect(this.classTypeCollapsible.locator).toBeHidden();

    if (!entityVisible) {
      await expect(this.entity.locator).toBeHidden();
    }
  }

  async expectToBeEntityClassField() {
    await this.expectToBeDataClassField(true);
    await this.entity.open();

    await expect(this.databaseField.locator).toBeVisible();
    await expect(this.association.locator).toBeVisible();

    await expect(this.databaseTable.locator).toBeHidden();
  }

  async expectToHaveDataClassValues(name: string, description: string, annotations: Array<string>, classType: string) {
    await this.general.open();
    await this.nameDescription.open();
    await expect(this.dataClassName.locator).toHaveValue(name);
    await expect(this.description.locator).toHaveValue(description);
    await this.annotations.expectToHaveValues(...annotations);
    await this.classTypeCollapsible.open();
    await expect(this.classTypeSelect.locator).toHaveText(classType);
  }

  async expectToHaveEntityClassValues(
    name: string,
    description: string,
    annotations: Array<string>,
    classType: string,
    databaseTableName: string
  ) {
    await this.expectToHaveDataClassValues(name, description, annotations, classType);
    await this.entity.open();
    await this.databaseTable.open();
    await expect(this.databaseTableName.locator).toHaveValue(databaseTableName);
  }

  async expectToHaveDataClassFieldValues(name: string, type: string, comment: string, persistent: boolean, annotations: Array<string>) {
    await this.general.open();
    await this.nameTypeComment.open();
    await expect(this.fieldName.locator).toHaveValue(name);
    await expect(this.type.locator).toHaveValue(type);
    await expect(this.comment.locator).toHaveValue(comment);
    await this.properties.open();
    expect(await this.persistent.isChecked()).toEqual(persistent);
    await this.annotations.expectToHaveValues(...annotations);
  }

  async expectToHaveEntityClassFieldValues(
    name: string,
    type: string,
    comment: string,
    persistent: boolean,
    annotations: Array<string>,
    databaseFieldName: string,
    databaseFieldLength: string,
    databaseFieldProperties: {
      ID: boolean;
      Generated: boolean;
      'Not nullable': boolean;
      Unique: boolean;
      'Not updateable': boolean;
      'Not insertable': boolean;
      Version: boolean;
    },
    cardinality: string,
    cascadeTypes: {
      All: boolean;
      Persist: boolean;
      Merge: boolean;
      Remove: boolean;
      Refresh: boolean;
    },
    mappedBy: string,
    removeOrphans: boolean
  ) {
    await this.expectToHaveDataClassFieldValues(name, type, comment, persistent, annotations);
    await this.entity.open();
    await this.databaseField.open();
    await expect(this.databaseFieldName.locator).toHaveValue(databaseFieldName);
    await expect(this.databaseFieldLength.locator).toHaveValue(databaseFieldLength);
    for (const [property, expectedValue] of Object.entries(databaseFieldProperties) as [
      keyof typeof this.databaseFieldProperties,
      boolean
    ][]) {
      expect(await this.databaseFieldProperties[property].isChecked()).toEqual(expectedValue);
    }
    await this.association.open();
    await expect(this.cardinality.locator).toHaveText(cardinality);
    for (const [cascadeType, expectedValue] of Object.entries(cascadeTypes) as [keyof typeof this.cascadeTypes, boolean][]) {
      expect(await this.cascadeTypes[cascadeType].isChecked()).toEqual(expectedValue);
    }
    await expect(this.mappedBy.locator).toHaveValue(mappedBy);
    expect(await this.removeOrphans.isChecked()).toEqual(removeOrphans);
  }

  async fillEntityClassValues(description: string, annotations: Array<string>, classType: string, databaseTableName: string) {
    await this.fillDataClassGeneralValues(description, annotations, classType);
    await this.fillDataClassEntityValues(databaseTableName);
  }

  async fillDataClassGeneralValues(description: string, annotations: Array<string>, classType: string) {
    await this.general.open();
    await this.nameDescription.open();
    await this.description.locator.fill(description);
    await this.annotations.fillValues(annotations);
    await this.classTypeCollapsible.open();
    await this.classTypeSelect.choose(classType);
  }

  async fillDataClassEntityValues(databaseTableName: string) {
    await this.entity.open();
    await this.databaseTable.open();
    await this.databaseTableName.locator.fill(databaseTableName);
  }

  async fillEntityFieldValues(
    name: string,
    type: string,
    comment: string,
    persistent: boolean,
    annotations: Array<string>,
    databaseFieldName: string,
    databaseFieldLength: string,
    databaseFieldProperties: Array<keyof typeof this.databaseFieldProperties>,
    associationCardinality: string,
    associationCascadeTypes: Array<keyof typeof this.cascadeTypes>,
    associationMappedBy: string,
    associationRemoveOrphans: boolean
  ) {
    await this.fillFieldGeneralValues(name, type, comment, persistent, annotations);
    await this.fillFieldEntityDatabaseValues(databaseFieldName, databaseFieldLength, databaseFieldProperties);
    await this.fillFieldEntityAssociationValues(
      associationCardinality,
      associationCascadeTypes,
      associationMappedBy,
      associationRemoveOrphans
    );
  }

  async fillFieldGeneralValues(name: string, type: string, comment: string, persistent: boolean, annotations: Array<string>) {
    await this.general.open();
    await this.nameTypeComment.open();
    await this.fieldName.locator.fill(name);
    await this.type.locator.fill(type);
    await this.comment.locator.fill(comment);
    await this.properties.open();
    if (persistent !== (await this.persistent.isChecked())) {
      await this.persistent.click();
    }
    await this.annotations.fillValues(annotations);
  }

  async fillFieldEntityDatabaseValues(name: string, length: string, properties: Array<keyof typeof this.databaseFieldProperties>) {
    await this.entity.open();
    await this.databaseField.open();
    await this.databaseFieldName.locator.fill(name);
    await this.databaseFieldLength.locator.fill(length);
    for (const [property, locator] of Object.entries(this.databaseFieldProperties)) {
      if (properties.includes(property as keyof typeof this.databaseFieldProperties) !== (await locator.isChecked())) {
        await locator.click();
      }
    }
  }

  async fillFieldEntityAssociationValues(
    cardinality: string,
    cascadeTypes: Array<keyof typeof this.cascadeTypes>,
    mappedBy: string,
    removeOrphans: boolean
  ) {
    await this.entity.open();
    await this.association.open();
    await this.cardinality.choose(cardinality);
    if (cascadeTypes.includes('All')) {
      if (!(await this.cascadeTypes.All.isChecked())) {
        await this.cascadeTypes.All.click();
      }
    } else {
      for (const [cascadeType, locator] of Object.entries(this.cascadeTypes)) {
        if (cascadeTypes.includes(cascadeType as keyof typeof this.cascadeTypes) !== (await locator.isChecked())) {
          await locator.click();
        }
      }
    }
    await this.mappedBy.locator.fill(mappedBy);
    if (removeOrphans !== (await this.removeOrphans.isChecked())) {
      await this.removeOrphans.click();
    }
  }
}
