import { expect, test } from '@playwright/test';
import { DataClassEditor } from '../pageobjects/DataClassEditor';

let editor: DataClassEditor;

test.beforeEach(async ({ page }) => {
  editor = await DataClassEditor.openMock(page);
});

test('title', async () => {
  await editor.expectTitle('Data Class Editor Mock');
});

test('detail data class', async () => {
  await editor.detail.expectTitle('Data Class Editor');
  await editor.detail.isDataClass();
});

test('detail field', async () => {
  await editor.table.row(0).click();
  await editor.detail.expectTitle('Attribute - firstName');
  await editor.detail.isField();
});

test('theme', async () => {
  const settings = editor.settings;
  await settings.toggle();
  await settings.theme.expectLight();
  await settings.theme.toggle();
  await settings.theme.expectDark();
});

test('toggle detail', async () => {
  await expect(editor.detailPanel).toBeVisible();
  await editor.detailToggle.click();
  await expect(editor.detailPanel).not.toBeVisible();
  await editor.detailToggle.click();
  await expect(editor.detailPanel).toBeVisible();
});
