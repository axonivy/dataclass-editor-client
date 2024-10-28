import { expect, type Locator, type Page } from '@playwright/test';
import { Button } from './abstract/Button';
import { FieldMessage } from './abstract/FieldMessage';
import { TextArea } from './abstract/TextArea';

export class AddFieldDialog {
  readonly locator: Locator;
  readonly open: Button;
  readonly name: TextArea;
  readonly nameMessage: FieldMessage;
  readonly type: TextArea;
  readonly typeMessage: FieldMessage;
  readonly create: Button;

  constructor(page: Page) {
    this.locator = page.getByRole('dialog', { name: 'New Attribute' });
    this.open = new Button(page.locator('.master-content'), { name: 'Add field' });
    this.name = new TextArea(this.locator, { label: 'Name' });
    this.nameMessage = new FieldMessage(this.locator, { label: 'Name' });
    this.type = new TextArea(this.locator, { label: 'Type' });
    this.typeMessage = new FieldMessage(this.locator, { label: 'Type' });
    this.create = new Button(this.locator, { name: 'Create field' });
  }

  async expectToHaveValues(name: string, type: string) {
    await expect(this.name.locator).toHaveValue(name);
    await expect(this.type.locator).toHaveValue(type);
  }
}
