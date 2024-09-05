import { expect, type Locator, type Page } from '@playwright/test';
import { Button } from './Button';
import { FieldMessage } from './FieldMessage';
import { TextArea } from './TextArea';

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
    this.open = new Button(page, { name: 'Add field' });
    this.name = new TextArea(this.locator, { label: 'Name' });
    this.nameMessage = new FieldMessage(this.locator, { label: 'Name' });
    this.type = new TextArea(this.locator, { label: 'Type' });
    this.typeMessage = new FieldMessage(this.locator, { label: 'Type' });
    this.create = new Button(page, { name: 'Create field' });
  }

  async expectToHaveValues(name: string, type: string) {
    await expect(this.name.locator).toHaveValue(name);
    await expect(this.type.locator).toHaveValue(type);
  }
}
