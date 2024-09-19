import { expect, test } from '@playwright/test';
import { DataClassEditor } from '../pageobjects/DataClassEditor';

let editor: DataClassEditor;

test.beforeEach(async ({ page }) => {
  editor = await DataClassEditor.openDataClass(page, 'dataclasses/dataclass/EntityClass.d.json');
});

test('load data', async () => {
  const table = editor.table;
  const detail = editor.detail;

  await detail.expectToHaveDataClassValues('EntityClass', 'EntityClass comment', [], 'Entity');

  await expect(table.rows).toHaveCount(1);

  const row0 = table.row(0);
  await row0.expectToHaveValues('id', 'Integer', 'Identifier');
  await row0.locator.click();
  await detail.expectToHaveFieldValues('id', 'Integer', 'Identifier', true, []);
});
