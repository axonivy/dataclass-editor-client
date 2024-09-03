import { expect, test } from '@playwright/test';
import { DataClassEditor } from '../pageobjects/DataClassEditor';

let editor: DataClassEditor;

test.beforeEach(async ({ page }) => {
  editor = await DataClassEditor.openMock(page);
});

test('title', async () => {
  await editor.expectTitle('Data Class Editor Mock');
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
  await editor.detailsToggle.click();
  await expect(editor.detailPanel).not.toBeVisible();
  await editor.detailsToggle.click();
  await expect(editor.detailPanel).toBeVisible();
});
