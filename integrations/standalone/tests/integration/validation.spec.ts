import { expect, test } from '@playwright/test';
import { DataClassEditor } from '../pageobjects/DataClassEditor';

test('validation', async ({ page }) => {
  const editor = await DataClassEditor.openNewDataClass(page);
  await editor.addField('field0', 'String');
  await editor.addField('field1', 'String');

  await expect(editor.table.rows).toHaveCount(2);

  await editor.table.row(0).locator.click();
  await editor.detail.field.general.nameTypeComment.type.locator.fill('UnknownType');
  await expect(editor.table.rows).toHaveCount(3);

  await expect(editor.table.row(0).locator).toHaveClass(/row-error/);
  await expect(editor.table.row(1).locator).toHaveClass(/ui-message-row/);
  await expect(editor.table.row(1).locator.locator('p')).toHaveAttribute('data-state', 'error');
  await expect(editor.table.row(1).locator).toHaveText("Unknown field type 'UnknownType'.");
});
