import { expect, test } from '@playwright/test';
import { DataClassEditor } from '../pageobjects/DataClassEditor';

test('load data', async ({ page }) => {
  const editor = await DataClassEditor.openDataClass(page, 'dataclasses/dataclass/EntityClass.d.json');
  const table = editor.table;
  const detail = editor.detail;

  await detail.expectToHaveDataClassValues('Entity Class', 'EntityClass comment', '');

  await expect(table.rows).toHaveCount(1);

  const row0 = table.row(0);
  await row0.expectToHaveValues('id', 'Integer', 'Identifier');
  await row0.locator.click();
  await detail.expectToHaveFieldValues('id', 'Integer', true, 'Identifier', '');
});
