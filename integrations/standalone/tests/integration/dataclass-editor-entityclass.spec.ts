import { test } from '@playwright/test';
import { DataClassEditor } from '../pageobjects/DataClassEditor';

let editor: DataClassEditor;

test.beforeEach(async ({ page }) => {
  editor = await DataClassEditor.openEngine(page, 'dataclasses/dataclass/EntityClass.d.json');
});

test('load data', async () => {
  const table = editor.table;
  const detail = editor.detail;

  await detail.expectDataClassValues('Entity Class', 'EntityClass comment', '');

  await table.expectRowCount(1);

  const row0 = table.row(0);
  await row0.expectValues('id', 'Integer', 'Identifier');
  await row0.click();
  await detail.expectFieldValues('id', 'Integer', true, 'Identifier', '');
});
