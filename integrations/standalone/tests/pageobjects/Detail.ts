import { expect, type Locator, type Page } from '@playwright/test';
import { Annotations } from './Annotations';
import { Collapsible } from './Collapsible';
import { Select } from './Select';
import { TextArea } from './TextArea';

export class Detail {
  readonly locator: Locator;
  readonly title: Locator;
  readonly nameDescriptionCollapsible: Collapsible;
  readonly nameText: TextArea;
  readonly descriptionText: TextArea;
  readonly annotations: Annotations;
  readonly classTypeCollapsible: Collapsible;
  readonly classTypeSelect: Select;
  readonly nameTypeCommentCollapsible: Collapsible;
  readonly typeText: TextArea;
  readonly commentText: TextArea;
  readonly properties: Collapsible;
  readonly persistent: Locator;

  constructor(page: Page) {
    this.locator = page.locator('.detail-container');
    this.title = this.locator.locator('.detail-header');
    this.nameDescriptionCollapsible = new Collapsible(page, this.locator, { label: 'Name / Description' });
    this.nameText = new TextArea(this.locator, { label: 'Name' });
    this.descriptionText = new TextArea(this.locator, { label: 'Description' });
    this.annotations = new Annotations(page, this.locator);
    this.classTypeCollapsible = new Collapsible(page, this.locator, { label: 'Class type' });
    this.classTypeSelect = new Select(page, this.classTypeCollapsible.locator);
    this.nameTypeCommentCollapsible = new Collapsible(page, this.locator, { label: 'Name / Type / Comment' });
    this.typeText = new TextArea(this.locator, { label: 'Type' });
    this.commentText = new TextArea(this.locator, { label: 'Comment' });
    this.properties = new Collapsible(page, this.locator, { label: 'Properties' });
    this.persistent = this.locator.getByLabel('Persistent');
  }

  async expectToBeDataClass() {
    await expect(this.nameDescriptionCollapsible.locator).toBeVisible();
    await this.nameDescriptionCollapsible.open();
    await expect(this.nameText.locator).toBeDisabled();
    await expect(this.annotations.collapsible.locator).toBeVisible();
    await expect(this.classTypeCollapsible.locator).toBeVisible();

    await expect(this.nameTypeCommentCollapsible.locator).toBeHidden();
    await expect(this.properties.locator).toBeHidden();
  }

  async expectToBeField() {
    await expect(this.nameTypeCommentCollapsible.locator).toBeVisible();
    await expect(this.properties.locator).toBeVisible();
    await expect(this.annotations.collapsible.locator).toBeVisible();

    await expect(this.nameDescriptionCollapsible.locator).toBeHidden();
    await expect(this.classTypeCollapsible.locator).toBeHidden();
  }

  async expectToHaveDataClassValues(name: string, description: string, annotations: Array<string>, classType: string) {
    await this.expectToBeDataClass();
    await this.nameDescriptionCollapsible.open();
    await expect(this.nameText.locator).toHaveValue(name);
    await expect(this.descriptionText.locator).toHaveValue(description);
    await this.annotations.expectToHaveValues(...annotations);
    await this.classTypeCollapsible.open();
    await this.classTypeSelect.expectToHaveValue(classType);
  }

  async expectToHaveFieldValues(name: string, type: string, comment: string, persistent: boolean, annotations: Array<string>) {
    await this.expectToBeField();
    await this.nameTypeCommentCollapsible.open();
    await expect(this.nameText.locator).toHaveValue(name);
    await expect(this.typeText.locator).toHaveValue(type);
    await expect(this.commentText.locator).toHaveValue(comment);
    await this.properties.open();
    if (persistent) {
      await expect(this.persistent).toBeChecked();
    } else {
      await expect(this.persistent).not.toBeChecked();
    }
    await this.annotations.expectToHaveValues(...annotations);
  }

  async fillDataClassValues(description: string, annotations: Array<string>, classType: string) {
    await this.expectToBeDataClass();
    await this.nameDescriptionCollapsible.open();
    await this.descriptionText.locator.fill(description);
    await this.annotations.fillValues(annotations);
    await this.classTypeCollapsible.open();
    await this.classTypeSelect.choose(classType);
  }

  async fillFieldValues(name: string, type: string, comment: string, persistent: boolean, annotations: Array<string>) {
    await this.expectToBeField();
    await this.nameTypeCommentCollapsible.open();
    await this.nameText.locator.fill(name);
    await this.typeText.locator.fill(type);
    await this.commentText.locator.fill(comment);
    await this.properties.open();
    if (persistent !== (await this.persistent.isChecked())) {
      await this.persistent.click();
    }
    await this.annotations.fillValues(annotations);
  }
}
