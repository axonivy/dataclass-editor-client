import { expect, test } from '@playwright/test';
import { DataClassEditor } from '../pageobjects/DataClassEditor';

let editor: DataClassEditor;

test.beforeEach(async ({ page }) => {
  editor = await DataClassEditor.openDataClass(page, 'dataclasses/dataclass/Data.d.json');
});

test('load data', async () => {
  const table = editor.table;
  const detail = editor.detail;

  await detail.expectToHaveDataClassValues('Data', '', '', 'Data');

  await expect(table.rows).toHaveCount(0);
});
