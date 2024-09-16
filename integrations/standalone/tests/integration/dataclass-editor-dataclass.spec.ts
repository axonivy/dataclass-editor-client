import { expect, test } from '@playwright/test';
import { DataClassEditor } from '../pageobjects/DataClassEditor';

let editor: DataClassEditor;

test.beforeEach(async ({ page }) => {
  editor = await DataClassEditor.openDataClass(page, 'dataclasses/dataclass/Data.d.json');
});

test('master header', async () => {
  await expect(editor.title).toHaveText('Data Editor');
});

test('detail header', async () => {
  await expect(editor.detail.title).toHaveText('Data - Data');
});

test('load data', async () => {
  const table = editor.table;
  const detail = editor.detail;

  await detail.expectToHaveDataClassValues('Data', '', '');

  await expect(table.rows).toHaveCount(0);
});
