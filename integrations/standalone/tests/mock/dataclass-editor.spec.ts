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
  await expect(editor.masterPanel).toHaveAttribute('data-panel-size', '75.0');
  await editor.detailsToggle.click();
  await expect(editor.masterPanel).toHaveAttribute('data-panel-size', '1.0');
  await editor.detailsToggle.click();
  await expect(editor.masterPanel).toHaveAttribute('data-panel-size', '75.0');
});
