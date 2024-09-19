import { expect, type Locator, type Page } from '@playwright/test';
import { ClassType } from './ClassType';
import { Collapsible } from './Collapsible';
import { TextArea } from './TextArea';

export class Detail {
  readonly locator: Locator;
  readonly title: Locator;
  readonly classTypeCollapsible: Collapsible;
  readonly classTypeGroup: ClassType;
  readonly descriptionCollapsible: Collapsible;
  readonly descriptionText: TextArea;
  readonly annotationsCollapsible: Collapsible;
  readonly annotationsText: TextArea;
  readonly nameCollapsible: Collapsible;
  readonly nameText: TextArea;
  readonly typeCollapsible: Collapsible;
  readonly typeText: TextArea;
  readonly properties: Collapsible;
  readonly persistent: Locator;
  readonly commentCollapsible: Collapsible;
  readonly commentText: TextArea;

  constructor(page: Page) {
    this.locator = page.locator('.detail-container');
    this.title = this.locator.locator('.detail-header');
    this.classTypeCollapsible = new Collapsible(page, this.locator, { label: 'Class type' });
    this.classTypeGroup = new ClassType(this.classTypeCollapsible.locator);
    this.descriptionCollapsible = new Collapsible(page, this.locator, { label: 'Description' });
    this.descriptionText = new TextArea(this.descriptionCollapsible.locator);
    this.annotationsCollapsible = new Collapsible(page, this.locator, { label: 'Annotations' });
    this.annotationsText = new TextArea(this.annotationsCollapsible.locator);
    this.nameCollapsible = new Collapsible(page, this.locator, { label: 'Name' });
    this.nameText = new TextArea(this.nameCollapsible.locator);
    this.typeCollapsible = new Collapsible(page, this.locator, { label: 'Type' });
    this.typeText = new TextArea(this.typeCollapsible.locator);
    this.properties = new Collapsible(page, this.locator, { label: 'Properties' });
    this.persistent = this.locator.getByLabel('Persistent');
    this.commentCollapsible = new Collapsible(page, this.locator, { label: 'Comment' });
    this.commentText = new TextArea(this.commentCollapsible.locator);
  }

  async expectToBeDataClass() {
    await expect(this.nameCollapsible.locator).toBeVisible();
    await this.nameCollapsible.open();
    await expect(this.nameText.locator).toBeDisabled();
    await expect(this.classTypeCollapsible.locator).toBeVisible();
    await expect(this.descriptionCollapsible.locator).toBeVisible();
    await expect(this.annotationsCollapsible.locator).toBeVisible();

    await expect(this.typeCollapsible.locator).toBeHidden();
    await expect(this.properties.locator).toBeHidden();
    await expect(this.commentCollapsible.locator).toBeHidden();
  }

  async expectToBeField() {
    await expect(this.nameCollapsible.locator).toBeVisible();
    await this.nameCollapsible.open();
    await expect(this.nameText.locator).toBeEnabled();
    await expect(this.typeCollapsible.locator).toBeVisible();
    await expect(this.properties.locator).toBeVisible();
    await expect(this.commentCollapsible.locator).toBeVisible();
    await expect(this.annotationsCollapsible.locator).toBeVisible();

    await expect(this.classTypeCollapsible.locator).toBeHidden();
    await expect(this.descriptionCollapsible.locator).toBeHidden();
  }

  async expectToHaveDataClassValues(name: string, classType: string, description: string, annotations: string) {
    await this.expectToBeDataClass();
    await this.nameCollapsible.open();
    await expect(this.nameText.locator).toHaveValue(name);
    await this.classTypeCollapsible.open();
    await this.classTypeGroup.expectToHaveValue(classType);
    await this.descriptionCollapsible.open();
    await expect(this.descriptionText.locator).toHaveValue(description);
    await this.annotationsCollapsible.open();
    await expect(this.annotationsText.locator).toHaveValue(annotations);
  }

  async expectToHaveFieldValues(name: string, type: string, persistent: boolean, comment: string, annotations: string) {
    await this.expectToBeField();
    await this.nameCollapsible.open();
    await expect(this.nameText.locator).toHaveValue(name);
    await this.typeCollapsible.open();
    await expect(this.typeText.locator).toHaveValue(type);
    await this.properties.open();
    if (persistent) {
      await expect(this.persistent).toBeChecked();
    } else {
      await expect(this.persistent).not.toBeChecked();
    }
    await this.commentCollapsible.open();
    await expect(this.commentText.locator).toHaveValue(comment);
    await this.annotationsCollapsible.open();
    await expect(this.annotationsText.locator).toHaveValue(annotations);
  }

  async fillDataClassValues(classType: string, description: string, annotations: string) {
    await this.expectToBeDataClass();
    await this.classTypeCollapsible.open();
    await this.classTypeGroup.button(classType).click();
    await this.descriptionCollapsible.open();
    await this.descriptionText.locator.fill(description);
    await this.annotationsCollapsible.open();
    await this.annotationsText.locator.fill(annotations);
  }

  async fillFieldValues(name: string, type: string, persistent: boolean, comment: string, annotations: string) {
    await this.expectToBeField();
    await this.nameCollapsible.open();
    await this.nameText.locator.fill(name);
    await this.typeCollapsible.open();
    await this.typeText.locator.fill(type);
    await this.properties.open();
    if (persistent !== (await this.persistent.isChecked())) {
      await this.persistent.click();
    }
    await this.commentCollapsible.open();
    await this.commentText.locator.fill(comment);
    await this.annotationsCollapsible.open();
    await this.annotationsText.locator.fill(annotations);
  }
}
