import { expect, test } from '@playwright/test';
import { DataClassEditor } from '../../pageobjects/DataClassEditor';
import { consoleLog } from '../../pageobjects/console-log';

test('title', async ({ page }) => {
  await DataClassEditor.openMock(page);
  await expect(page).toHaveTitle('Data Class Editor Mock');
});

test('headers', async ({ page }) => {
  const editor = await DataClassEditor.openMock(page);
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

test('detail', async ({ page }) => {
  const editor = await DataClassEditor.openMock(page);
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

test('theme', async ({ page }) => {
  const editor = await DataClassEditor.openMock(page);
  const settings = editor.settings;

  await settings.theme.expectToBeLight();
  await settings.button.locator.click();
  await settings.theme.switch.locator.click();
  await settings.theme.expectToBeDark();
});

test('toggle detail', async ({ page }) => {
  const editor = await DataClassEditor.openMock(page);
  await expect(editor.detail.locator).toBeVisible();
  await editor.detailToggle.locator.click();
  await expect(editor.detail.locator).not.toBeVisible();
  await editor.detailToggle.locator.click();
  await expect(editor.detail.locator).toBeVisible();
});

test('type', async ({ page }) => {
  const editor = await DataClassEditor.openMock(page);
  await expect(editor.table.row(3).column(1).locator).toHaveText('Conversation');
  await editor.table.row(3).locator.click();
  await editor.detail.field.general.nameTypeComment.collapsible.open();
  await expect(editor.detail.field.general.nameTypeComment.type.locator).toHaveValue('mock.Conversation');
});

test('open process', async ({ page }) => {
  const editor = await DataClassEditor.openMock(page, { file: '/src_hd/Data.d.json' });
  const msg1 = consoleLog(page);
  await editor.toolbar.getByRole('button', { name: 'Open Process' }).click();
  expect(await msg1).toContain('openProcess');

  const msg2 = consoleLog(page);
  await page.keyboard.press('p');
  expect(await msg2).toContain('openProcess');
});

test('open form', async ({ page }) => {
  const editor = await DataClassEditor.openMock(page, { file: '/src_hd/Data.d.json' });
  const msg1 = consoleLog(page);
  await editor.toolbar.getByRole('button', { name: 'Open Form' }).click();
  expect(await msg1).toContain('openForm');

  const msg2 = consoleLog(page);
  await page.keyboard.press('f');
  expect(await msg2).toContain('openForm');
});

test('help', async ({ page }) => {
  const editor = await DataClassEditor.openMock(page);
  const msg1 = consoleLog(page);
  await editor.detail.title.getByRole('button', { name: 'Open Help' }).click();
  expect(await msg1).toContain('openUrl');

  const msg2 = consoleLog(page);
  await page.keyboard.press('F1');
  expect(await msg2).toContain('openUrl');
  expect(await msg2).toContain('https://dev.axonivy.com');
});

test('focus jumps', async ({ page }) => {
  const editor = await DataClassEditor.openMock(page);
  await page.keyboard.press('1');
  await expect(editor.toolbar).toBeFocused();
  await page.keyboard.press('2');
  await expect(editor.main).toBeFocused();
  await page.keyboard.press('3');
  await expect(editor.detail.dataClass.general.accordion.trigger.locator).toBeFocused();
  await editor.table.row(0).locator.click();
  await page.keyboard.press('3');
  await expect(editor.detail.field.general.accordion.trigger.locator).toBeFocused();
});
