import { expect, type Locator, type Page } from '@playwright/test';
import { ClassType } from './ClassType';
import { TextArea } from './TextArea';

export class Detail {
  readonly locator: Locator;
  readonly title: Locator;
  readonly classType: ClassType;
  readonly description: TextArea;
  readonly annotations: TextArea;
  readonly name: TextArea;
  readonly type: TextArea;
  readonly persistent: Locator;
  readonly comment: TextArea;

  constructor(page: Page) {
    this.locator = page.locator('.detail-container');
    this.title = this.locator.locator('.detail-header');
    this.classType = new ClassType(this.locator);
    this.description = new TextArea(this.locator, { label: 'Description' });
    this.annotations = new TextArea(this.locator, { label: 'Annotations' });
    this.name = new TextArea(this.locator, { label: 'Name' });
    this.type = new TextArea(this.locator, { label: 'Type' });
    this.persistent = this.locator.getByLabel('Persistent');
    this.comment = new TextArea(this.locator, { label: 'Comment' });
  }

  async expectToBeDataClass() {
    await expect(this.classType.locator).not.toBeHidden();
    await expect(this.description.locator).not.toBeHidden();
    await expect(this.annotations.locator).not.toBeHidden();

    await expect(this.name.locator).toBeHidden();
    await expect(this.type.locator).toBeHidden();
    await expect(this.persistent).toBeHidden();
    await expect(this.comment.locator).toBeHidden();
  }

  async expectToBeField() {
    await expect(this.name.locator).not.toBeHidden();
    await expect(this.type.locator).not.toBeHidden();
    await expect(this.persistent).not.toBeHidden();
    await expect(this.comment.locator).not.toBeHidden();
    await expect(this.annotations.locator).not.toBeHidden();

    await expect(this.classType.locator).toBeHidden();
    await expect(this.description.locator).toBeHidden();
  }

  async expectToHaveDataClassValues(classType: string, description: string, annotations: string) {
    await this.expectToBeDataClass();
    await this.classType.expectToHaveValue(classType);
    await expect(this.description.locator).toHaveValue(description);
    await expect(this.annotations.locator).toHaveValue(annotations);
  }

  async expectToHaveFieldValues(name: string, type: string, persistent: boolean, comment: string, annotations: string) {
    await this.expectToBeField();
    await expect(this.name.locator).toHaveValue(name);
    await expect(this.type.locator).toHaveValue(type);
    if (persistent) {
      await expect(this.persistent).toBeChecked();
    } else {
      await expect(this.persistent).not.toBeChecked();
    }
    await expect(this.comment.locator).toHaveValue(comment);
    await expect(this.annotations.locator).toHaveValue(annotations);
  }

  async fillDataClassValues(classType: string, description: string, annotations: string) {
    await this.expectToBeDataClass();
    await this.classType.button(classType).click();
    await this.description.locator.fill(description);
    await this.annotations.locator.fill(annotations);
  }
}
