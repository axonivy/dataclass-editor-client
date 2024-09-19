import { expect, type Locator, type Page } from '@playwright/test';
import { ClassType } from './ClassType';
import { Collapsible } from './Collapsible';
import { TextArea } from './TextArea';

export class Detail {
  readonly locator: Locator;
  readonly title: Locator;
  readonly nameDescriptionCollapsible: Collapsible;
  readonly nameText: TextArea;
  readonly descriptionText: TextArea;
  readonly annotationsCollapsible: Collapsible;
  readonly annotationsText: TextArea;
  readonly classTypeCollapsible: Collapsible;
  readonly classTypeGroup: ClassType;
  readonly nameTypeCommentCollapsible: Collapsible;
  readonly typeText: TextArea;
  readonly commentText: TextArea;
  readonly properties: Collapsible;
  readonly persistent: Locator;

  constructor(page: Page) {
    this.locator = page.locator('.detail-container');
    this.title = this.locator.locator('.detail-header');
    this.classTypeCollapsible = new Collapsible(page, this.locator, { label: 'Class type' });
    this.classTypeGroup = new ClassType(this.classTypeCollapsible.locator);
    this.nameDescriptionCollapsible = new Collapsible(page, this.locator, { label: 'Name / Description' });
    this.descriptionText = new TextArea(this.locator, { label: 'Description' });
    this.annotationsCollapsible = new Collapsible(page, this.locator, { label: 'Annotations' });
    this.annotationsText = new TextArea(this.annotationsCollapsible.locator);
    this.nameText = new TextArea(this.locator, { label: 'Name' });
    this.nameTypeCommentCollapsible = new Collapsible(page, this.locator, { label: 'Name / Type / Comment' });
    this.typeText = new TextArea(this.locator, { label: 'Type' });
    this.properties = new Collapsible(page, this.locator, { label: 'Properties' });
    this.persistent = this.locator.getByLabel('Persistent');
    this.commentText = new TextArea(this.locator, { label: 'Comment' });
  }

  async expectToBeDataClass() {
    await expect(this.nameDescriptionCollapsible.locator).toBeVisible();
    await this.nameDescriptionCollapsible.open();
    await expect(this.nameText.locator).toBeDisabled();
    await expect(this.annotationsCollapsible.locator).toBeVisible();
    await expect(this.classTypeCollapsible.locator).toBeVisible();

    await expect(this.nameTypeCommentCollapsible.locator).toBeHidden();
    await expect(this.properties.locator).toBeHidden();
  }

  async expectToBeField() {
    await expect(this.nameTypeCommentCollapsible.locator).toBeVisible();
    await expect(this.properties.locator).toBeVisible();
    await expect(this.annotationsCollapsible.locator).toBeVisible();

    await expect(this.nameDescriptionCollapsible.locator).toBeHidden();
    await expect(this.classTypeCollapsible.locator).toBeHidden();
  }

  async expectToHaveDataClassValues(name: string, description: string, annotations: string, classType: string) {
    await this.expectToBeDataClass();
    await this.nameDescriptionCollapsible.open();
    await expect(this.nameText.locator).toHaveValue(name);
    await expect(this.descriptionText.locator).toHaveValue(description);
    await this.annotationsCollapsible.open();
    await expect(this.annotationsText.locator).toHaveValue(annotations);
    await this.classTypeCollapsible.open();
    await this.classTypeGroup.expectToHaveValue(classType);
  }

  async expectToHaveFieldValues(name: string, type: string, comment: string, persistent: boolean, annotations: string) {
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
    await this.annotationsCollapsible.open();
    await expect(this.annotationsText.locator).toHaveValue(annotations);
  }

  async fillDataClassValues(description: string, annotations: string, classType: string) {
    await this.expectToBeDataClass();
    await this.nameDescriptionCollapsible.open();
    await this.descriptionText.locator.fill(description);
    await this.annotationsCollapsible.open();
    await this.annotationsText.locator.fill(annotations);
    await this.classTypeCollapsible.open();
    await this.classTypeGroup.button(classType).click();
  }

  async fillFieldValues(name: string, type: string, comment: string, persistent: boolean, annotations: string) {
    await this.expectToBeField();
    await this.nameTypeCommentCollapsible.open();
    await this.nameText.locator.fill(name);
    await this.typeText.locator.fill(type);
    await this.commentText.locator.fill(comment);
    await this.properties.open();
    if (persistent !== (await this.persistent.isChecked())) {
      await this.persistent.click();
    }
    await this.annotationsCollapsible.open();
    await this.annotationsText.locator.fill(annotations);
  }
}
