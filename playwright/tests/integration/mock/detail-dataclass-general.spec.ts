import { expect, test } from '@playwright/test';
import { describe } from 'node:test';
import { DataClassEditor } from '../../pageobjects/DataClassEditor';

let editor: DataClassEditor;

test.beforeEach(async ({ page }) => {
  editor = await DataClassEditor.openMock(page);
});

test('tab state', async () => {
  await editor.detail.dataClass.general.inscriptionTab.expectToBeOpen();

  await editor.table.row(0).locator.click();
  await editor.detail.field.general.inscriptionTab.expectToBeOpen();
});

describe('collapsible state', () => {
  test('dataclass', async () => {
    const general = editor.detail.dataClass.general;

    await general.nameDescription.collapsible.expectToBeOpen();
    await general.annotations.collapsible.expectToBeOpen();
    await general.classType.collapsible.expectToBeClosed();

    await general.fillValues('', [], 'Entity');
    await editor.detail.dataClass.entity.inscriptionTab.toggle();
    await general.inscriptionTab.toggle();

    await general.nameDescription.collapsible.expectToBeOpen();
    await general.annotations.collapsible.expectToBeClosed();
    await general.classType.collapsible.expectToBeClosed();
  });

  test('field', async () => {
    const general = editor.detail.field.general;

    await editor.table.row(0).locator.click();

    await general.nameTypeComment.collapsible.expectToBeOpen();
    await general.properties.collapsible.expectToBeOpen();
    await general.annotations.collapsible.expectToBeClosed();

    await general.fillValues('NewName', 'Integer', '', false, ['annotation']);
    await editor.table.row(1).locator.click();
    await editor.table.row(0).locator.click();

    await general.nameTypeComment.collapsible.expectToBeOpen();
    await general.properties.collapsible.expectToBeClosed();
    await general.annotations.collapsible.expectToBeOpen();
  });
});

describe('annotations', () => {
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
