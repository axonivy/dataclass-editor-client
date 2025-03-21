import { expect, test } from '@playwright/test';
import { DataClassEditor } from '../../pageobjects/DataClassEditor';

test('english translation', async ({ page }) => {
  const editor = await DataClassEditor.openMock(page);
  await expect(editor.toolbar.locator).toContainText('Data Class - ');
});

test('german translation', async ({ page }) => {
  const editor = await DataClassEditor.openMock(page, { lng: 'de' });
  await expect(editor.toolbar.locator).toContainText('Datenklasse - ');
});
