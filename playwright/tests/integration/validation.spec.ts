import { expect, test } from '@playwright/test';
import { DataClassEditor } from '../pageobjects/DataClassEditor';

test('validation', async ({ page }) => {
  const editor = await DataClassEditor.openNewDataClass(page);
  await editor.detail.dataClass.general.classType.fillValues('Entity');
  await expect(editor.messages).toHaveCount(0);

  await editor.deleteField(0);
  await expect(editor.messages).toHaveCount(1);

  await editor.addField();
  const row = editor.table.row(0);
  await expect(editor.table.messages).toHaveCount(0);
  await row.expectToHaveNoValidation();

  await editor.detail.field.general.nameTypeComment.type.locator.fill('unknownType');
  await expect(editor.table.messages).toHaveCount(1);
  await row.expectToHaveError();
});
