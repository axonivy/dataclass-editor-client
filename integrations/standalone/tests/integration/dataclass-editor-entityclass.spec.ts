import { test } from '@playwright/test';
import { DataClassEditor } from '../pageobjects/DataClassEditor';

let editor: DataClassEditor;

test.beforeEach(async ({ page }) => {
  editor = await DataClassEditor.openEngine(page, 'dataclasses/dataclass/EntityClass.d.json');
});

test('load data', async () => {
  const table = editor.table;
  const detail = editor.detail;

  await detail.expectToHaveDataClassValues('Entity Class', 'EntityClass comment', '');

  await table.expectToHaveRowCount(1);

  const row0 = table.row(0);
  await row0.expectToHaveValues('id', 'Integer', 'Identifier');
  await row0.click();
  await detail.expectToHaveFieldValues('id', 'Integer', true, 'Identifier', '');
});
