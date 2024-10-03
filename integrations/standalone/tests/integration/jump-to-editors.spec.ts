import { expect, test } from '@playwright/test';
import { DataClassEditor } from '../pageobjects/DataClassEditor';

test('not visible in normal data class', async ({ page }) => {
  const editor = await DataClassEditor.openDataClass(page, 'dataclasses/dataclass/Data.d.json');
  await expect(editor.title).toHaveText('Data Class - Data');
  await expect(editor.toolbar.getByRole('button', { name: 'Open Process' })).toBeHidden();
  await expect(editor.toolbar.getByRole('button', { name: 'Open Form' })).toBeHidden();
});

test('visible in form data class', async ({ page }) => {
  const editor = await DataClassEditor.openDataClass(page, 'src_hd/dataclass/form/formData.d.json');
  await expect(editor.title).toHaveText('Data Class - formData');
  await expect(editor.toolbar.getByRole('button', { name: 'Open Process' })).toBeVisible();
  await expect(editor.toolbar.getByRole('button', { name: 'Open Form' })).toBeVisible();
});
