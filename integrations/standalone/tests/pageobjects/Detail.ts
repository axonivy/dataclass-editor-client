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
    this.locator = page.getByTestId('detail-container');
    this.title = this.locator.getByTestId('detail-header');
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

  async isDataClass() {
    await this.classType.expectToExist();
    await this.description.expectToExist();
    await this.annotations.expectToExist();

    await this.name.expectToNotExist();
    await this.type.expectToNotExist();
    await expect(this.persistent).toHaveCount(0);
    await this.comment.expectToNotExist();
  }

  async isField() {
    await this.name.expectToExist();
    await this.type.expectToExist();
    await expect(this.persistent).toHaveCount(1);
    await this.comment.expectToExist();
    await this.annotations.expectToExist();

    await this.classType.expectToNotExist();
    await this.description.expectToNotExist();
  }

  async expectDataClassValues(classType: string, description: string, annotations: string) {
    await this.isDataClass();
    await this.classType.expectValue(classType);
    await this.description.expectValue(description);
    await this.annotations.expectValue(annotations);
  }

  async expectFieldValues(name: string, type: string, persistent: boolean, comment: string, annotations: string) {
    await this.isField();
    await this.name.expectValue(name);
    await this.type.expectValue(type);
    if (persistent) {
      await expect(this.persistent).toBeChecked();
    } else {
      await expect(this.persistent).not.toBeChecked();
    }
    await this.comment.expectValue(comment);
    await this.annotations.expectValue(annotations);
  }
}
