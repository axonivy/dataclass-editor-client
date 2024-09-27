import { expect, test } from '@playwright/test';
import { describe } from 'node:test';
import { DataClassEditor } from '../pageobjects/DataClassEditor';

let editor: DataClassEditor;

test.beforeEach(async ({ page }) => {
  editor = await DataClassEditor.openMock(page);
});

test('accordion state', async () => {
  expect(await editor.detail.dataClass.general.accordion.isOpen()).toBeTruthy();

  await editor.table.row(0).locator.click();
  expect(await editor.detail.field.general.accordion.isOpen()).toBeTruthy();
});

describe('collapsible state', async () => {
  test('dataclass', async () => {
    const general = editor.detail.dataClass.general;

    expect(await general.nameDescription.collapsible.isOpen()).toBeTruthy();
    expect(await general.annotations.collapsible.isOpen()).toBeTruthy();
    expect(await general.classType.collapsible.isOpen()).toBeFalsy();

    await general.fillValues('', [], 'Entity');
    await general.accordion.reopen();

    expect(await general.nameDescription.collapsible.isOpen()).toBeTruthy();
    expect(await general.annotations.collapsible.isOpen()).toBeFalsy();
    expect(await general.classType.collapsible.isOpen()).toBeFalsy();
  });

  test('field', async () => {
    const general = editor.detail.field.general;

    await editor.table.row(0).locator.click();

    expect(await general.nameTypeComment.collapsible.isOpen()).toBeTruthy();
    expect(await general.properties.collapsible.isOpen()).toBeTruthy();
    expect(await general.annotations.collapsible.isOpen()).toBeFalsy();

    await general.fillValues('NewName', 'Integer', '', false, ['annotation']);
    await general.accordion.reopen();

    expect(await general.nameTypeComment.collapsible.isOpen()).toBeTruthy();
    expect(await general.properties.collapsible.isOpen()).toBeFalsy();
    expect(await general.annotations.collapsible.isOpen()).toBeTruthy();
  });
});

describe('annotations', async () => {
  test('add', async () => {
    const annotations = editor.detail.dataClass.general.annotations;

    await annotations.expectToHaveValues(['@full.qualified.name.one(argument = "value")', '@full.qualified.name.two']);

    await annotations.add.locator.click();
    await annotations.expectToHaveValues(['@full.qualified.name.one(argument = "value")', '@full.qualified.name.two', '']);
    await annotations.table.row(2).expectToBeSelected();
  });

  test('delete', async () => {
    const annotations = editor.detail.dataClass.general.annotations;

    await annotations.collapsible.open();
    await expect(annotations.delete.locator).toBeDisabled();

    await annotations.table.row(0).locator.click();
    await annotations.delete.locator.click();
    await annotations.expectToHaveValues(['@full.qualified.name.two']);
    await annotations.table.row(0).expectToBeSelected();

    await annotations.delete.locator.click();
    await expect(annotations.table.rows).toHaveCount(0);
    await expect(annotations.delete.locator).toBeDisabled();
  });
});
