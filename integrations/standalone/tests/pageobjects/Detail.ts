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

  async expectTitle(title: string) {
    await expect(this.title).toHaveText(title);
  }

  async expectToBeDataClass() {
    await this.classType.expectToExist();
    await this.description.expectToExist();
    await this.annotations.expectToExist();

    await this.name.expectToBeHidden();
    await this.type.expectToBeHidden();
    await expect(this.persistent).toBeHidden();
    await this.comment.expectToBeHidden();
  }

  async expectToBeField() {
    await this.name.expectToExist();
    await this.type.expectToExist();
    await expect(this.persistent).not.toBeHidden();
    await this.comment.expectToExist();
    await this.annotations.expectToExist();

    await this.classType.expectToBeHidden();
    await this.description.expectToBeHidden();
  }

  async expectToHaveDataClassValues(classType: string, description: string, annotations: string) {
    await this.expectToBeDataClass();
    await this.classType.expectToHaveValue(classType);
    await this.description.expectToHaveValue(description);
    await this.annotations.expectToHaveValue(annotations);
  }

  async expectToHaveFieldValues(name: string, type: string, persistent: boolean, comment: string, annotations: string) {
    await this.expectToBeField();
    await this.name.expectToHaveValue(name);
    await this.type.expectToHaveValue(type);
    if (persistent) {
      await expect(this.persistent).toBeChecked();
    } else {
      await expect(this.persistent).not.toBeChecked();
    }
    await this.comment.expectToHaveValue(comment);
    await this.annotations.expectToHaveValue(annotations);
  }
}
