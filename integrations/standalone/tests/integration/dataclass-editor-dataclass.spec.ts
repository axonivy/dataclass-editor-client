import { expect, test } from '@playwright/test';
import { DataClassEditor } from '../pageobjects/DataClassEditor';

test('load data', async ({ page }) => {
  const editor = await DataClassEditor.openDataClass(page, 'dataclasses/dataclass/Data.d.json');
  const table = editor.table;
  const detail = editor.detail;

  await detail.expectToHaveDataClassValues('Data Class', '', '');

  await expect(table.rows).toHaveCount(0);
});
