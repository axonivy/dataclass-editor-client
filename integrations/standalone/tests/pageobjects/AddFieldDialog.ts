import { type Locator, type Page } from '@playwright/test';
import { Button } from './Button';
import { FieldMessage } from './FieldMessage';
import { TextArea } from './TextArea';

export class AddFieldDialog {
  readonly locator: Locator;
  readonly add: Button;
  readonly name: TextArea;
  readonly nameMessage: FieldMessage;
  readonly type: TextArea;
  readonly typeMessage: FieldMessage;
  readonly create: Button;

  constructor(page: Page) {
    this.locator = page.getByRole('dialog', { name: 'New Attribute' });
    this.add = new Button(page, { name: 'Add field' });
    this.name = new TextArea(this.locator, { label: 'Name' });
    this.nameMessage = new FieldMessage(this.locator, { label: 'Name' });
    this.type = new TextArea(this.locator, { label: 'Type' });
    this.typeMessage = new FieldMessage(this.locator, { label: 'Type' });
    this.create = new Button(page, { name: 'Create field' });
  }

  async open() {
    await this.add.click();
  }

  async expectToHaveValues(name: string, type: string) {
    await this.name.expectToHaveValue(name);
    await this.type.expectToHaveValue(type);
  }
}
