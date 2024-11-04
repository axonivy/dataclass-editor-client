import { expect, test } from '@playwright/test';
import { DataClassEditor } from '../../pageobjects/DataClassEditor';

let editor: DataClassEditor;

test.beforeEach(async ({ page }) => {
  editor = await DataClassEditor.openMock(page);
});

test('title', async () => {
  await expect(editor.page).toHaveTitle('Data Class Editor Mock');
});

test('headers', async () => {
  await expect(editor.title).toHaveText('Data Class - Interview');
  await expect(editor.detail.title).toHaveText('Data Class - Interview');

  await editor.detail.dataClass.general.classType.fillValues('Business Data');
  await expect(editor.title).toHaveText('Business Data Class - Interview');
  await expect(editor.detail.title).toHaveText('Business Data Class - Interview');

  await editor.detail.dataClass.general.classType.fillValues('Entity');
  await expect(editor.title).toHaveText('Entity Class - Interview');
  await expect(editor.detail.title).toHaveText('Entity Class - Interview');

  await editor.table.row(1).locator.click();
  await expect(editor.detail.title).toHaveText('Attribute - firstName');
});

test('detail', async () => {
  await editor.detail.expectToBeDataClass();
  await editor.table.row(0).locator.click();
  await editor.detail.expectToBeField();
  await editor.table.unselect();
  await editor.detail.expectToBeDataClass();

  await editor.detail.dataClass.general.classType.fillValues('Entity');
  await editor.detail.expectToBeDataClass(true);
  await editor.table.row(0).locator.click();
  await editor.detail.expectToBeField(true);
  await editor.table.unselect();
  await editor.detail.expectToBeDataClass(true);
});

test('theme', async () => {
  const settings = editor.settings;

  await settings.theme.expectToBeLight();
  await settings.button.locator.click();
  await settings.theme.switch.locator.click();
  await settings.theme.expectToBeDark();
});

test('toggle detail', async () => {
  await expect(editor.detail.locator).toBeVisible();
  await editor.detailToggle.locator.click();
  await expect(editor.detail.locator).not.toBeVisible();
  await editor.detailToggle.locator.click();
  await expect(editor.detail.locator).toBeVisible();
});

test('type', async () => {
  await expect(editor.table.row(3).column(1).locator).toHaveText('Conversation');
  await editor.table.row(3).locator.click();
  await editor.detail.field.general.nameTypeComment.collapsible.open();
  await expect(editor.detail.field.general.nameTypeComment.type.locator).toHaveValue('mock.Conversation');
});
