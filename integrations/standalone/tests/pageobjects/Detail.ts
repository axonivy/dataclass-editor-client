import { expect, type Locator, type Page } from '@playwright/test';
import { ClassType } from './ClassType';
import { Collapsible } from './Collapsible';
import { TextArea } from './TextArea';

export class Detail {
  readonly locator: Locator;
  readonly title: Locator;
  readonly classTypeCollapsible: Collapsible;
  readonly classTypeGroup: ClassType;
  readonly description: TextArea;
  readonly annotationsCollapsible: Collapsible;
  readonly annotationsText: TextArea;
  readonly name: TextArea;
  readonly type: TextArea;
  readonly properties: Collapsible;
  readonly persistent: Locator;
  readonly comment: TextArea;

  constructor(page: Page) {
    this.locator = page.locator('.detail-container');
    this.title = this.locator.locator('.detail-header');
    this.classTypeCollapsible = new Collapsible(page, this.locator, { label: 'Class type' });
    this.classTypeGroup = new ClassType(this.classTypeCollapsible.locator);
    this.description = new TextArea(this.locator, { label: 'Description' });
    this.annotationsCollapsible = new Collapsible(page, this.locator, { label: 'Annotations' });
    this.annotationsText = new TextArea(this.annotationsCollapsible.locator);
    this.name = new TextArea(this.locator, { label: 'Name' });
    this.type = new TextArea(this.locator, { label: 'Type' });
    this.properties = new Collapsible(page, this.locator, { label: 'Properties' });
    this.persistent = this.locator.getByLabel('Persistent');
    this.comment = new TextArea(this.locator, { label: 'Comment' });
  }

  async expectToBeDataClass() {
    await expect(this.classTypeCollapsible.locator).toBeVisible();
    await expect(this.description.locator).toBeVisible();
    await expect(this.annotationsCollapsible.locator).toBeVisible();

    await expect(this.name.locator).toBeHidden();
    await expect(this.type.locator).toBeHidden();
    await expect(this.properties.locator).toBeHidden();
    await expect(this.comment.locator).toBeHidden();
  }

  async expectToBeField() {
    await expect(this.name.locator).toBeVisible();
    await expect(this.type.locator).toBeVisible();
    await expect(this.properties.locator).toBeVisible();
    await expect(this.comment.locator).toBeVisible();
    await expect(this.annotationsCollapsible.locator).toBeVisible();

    await expect(this.classTypeCollapsible.locator).toBeHidden();
    await expect(this.description.locator).toBeHidden();
  }

  async expectToHaveDataClassValues(classType: string, description: string, annotations: string) {
    await this.expectToBeDataClass();
    await this.classTypeCollapsible.open();
    await this.classTypeGroup.expectToHaveValue(classType);
    await expect(this.description.locator).toHaveValue(description);
    await this.annotationsCollapsible.open();
    await expect(this.annotationsText.locator).toHaveValue(annotations);
  }

  async expectToHaveFieldValues(name: string, type: string, persistent: boolean, comment: string, annotations: string) {
    await this.expectToBeField();
    await expect(this.name.locator).toHaveValue(name);
    await expect(this.type.locator).toHaveValue(type);
    await this.properties.open();
    if (persistent) {
      await expect(this.persistent).toBeChecked();
    } else {
      await expect(this.persistent).not.toBeChecked();
    }
    await expect(this.comment.locator).toHaveValue(comment);
    await this.annotationsCollapsible.open();
    await expect(this.annotationsText.locator).toHaveValue(annotations);
  }

  async fillDataClassValues(classType: string, description: string, annotations: string) {
    await this.expectToBeDataClass();
    await this.classTypeCollapsible.open();
    await this.classTypeGroup.button(classType).click();
    await this.description.locator.fill(description);
    await this.annotationsCollapsible.open();
    await this.annotationsText.locator.fill(annotations);
  }

  async fillFieldValues(name: string, type: string, persistent: boolean, comment: string, annotations: string) {
    await this.expectToBeField();
    await this.name.locator.fill(name);
    await this.type.locator.fill(type);
    await this.properties.open();
    if (persistent !== (await this.persistent.isChecked())) {
      await this.persistent.click();
    }
    await this.comment.locator.fill(comment);
    await this.annotationsCollapsible.open();
    await this.annotationsText.locator.fill(annotations);
  }
}
