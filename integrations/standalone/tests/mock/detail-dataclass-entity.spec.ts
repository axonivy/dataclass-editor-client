import { expect, test } from '@playwright/test';
import { describe } from 'node:test';
import { DataClassEditor } from '../pageobjects/DataClassEditor';

let editor: DataClassEditor;

test.beforeEach(async ({ page }) => {
  editor = await DataClassEditor.openMock(page);
});

test('accordion state', async () => {
  await expect(editor.detail.dataClass.entity.accordion.locator).toBeHidden();

  await editor.table.row(0).locator.click();
  await expect(editor.detail.field.entity.accordion.locator).toBeHidden();

  await editor.table.header.click();
  await editor.detail.dataClass.general.classType.fillValues('Entity');
  expect(await editor.detail.dataClass.entity.accordion.isOpen()).toBeFalsy();

  await editor.table.row(0).locator.click();
  expect(await editor.detail.field.entity.accordion.isOpen()).toBeFalsy();

  await editor.detail.field.general.properties.fillValues(false);
  await expect(editor.detail.field.entity.accordion.locator).toBeHidden();
});

describe('collapsible state', async () => {
  test('dataclass', async () => {
    const entity = editor.detail.dataClass.entity;

    await editor.detail.dataClass.general.classType.fillValues('Entity');
    await entity.accordion.open();

    expect(await entity.databaseTable.collapsible.isOpen()).toBeFalsy();

    await entity.fillValues('DatabaseTableName');
    await entity.accordion.reopen();

    expect(await entity.databaseTable.collapsible.isOpen()).toBeTruthy();
  });

  describe('field', async () => {
    describe('database field', async () => {
      test('name', async () => {
        const entity = editor.detail.field.entity;

        await editor.detail.dataClass.general.classType.fillValues('Entity');
        await editor.table.row(0).locator.click();
        await entity.accordion.open();

        expect(await entity.databaseField.collapsible.isOpen()).toBeFalsy();

        await entity.databaseField.collapsible.open();
        await entity.databaseField.name.locator.fill('DatabaseFieldName');
        await entity.accordion.reopen();

        expect(await entity.databaseField.collapsible.isOpen()).toBeTruthy();

        await entity.association.collapsible.open();
        await entity.association.cardinality.choose('One-to-One');
        await entity.association.mappedBy.locator.fill('MappedByFieldName');
        await entity.accordion.reopen();

        expect(await entity.databaseField.collapsible.isOpen()).toBeFalsy();
      });

      test('length', async () => {
        const entity = editor.detail.field.entity;

        await editor.detail.dataClass.general.classType.fillValues('Entity');
        await editor.table.row(0).locator.click();
        await entity.accordion.open();

        expect(await entity.databaseField.collapsible.isOpen()).toBeFalsy();

        await entity.databaseField.collapsible.open();
        await entity.databaseField.length.locator.fill('DatabaseFieldLength');
        await entity.accordion.reopen();

        expect(await entity.databaseField.collapsible.isOpen()).toBeTruthy();

        await editor.detail.field.general.accordion.open();
        await editor.detail.field.general.nameTypeComment.type.locator.fill('Date');
        await entity.accordion.open();

        expect(await entity.databaseField.collapsible.isOpen()).toBeFalsy();
      });

      test('properties', async () => {
        const entity = editor.detail.field.entity;

        await editor.detail.dataClass.general.classType.fillValues('Entity');
        await editor.table.row(0).locator.click();
        await entity.accordion.open();

        expect(await entity.databaseField.collapsible.isOpen()).toBeFalsy();

        await entity.databaseField.collapsible.open();
        await entity.databaseField.properties.id.click();
        await entity.accordion.reopen();

        expect(await entity.databaseField.collapsible.isOpen()).toBeTruthy();
      });
    });

    test('association', async () => {
      const entity = editor.detail.field.entity;

      await editor.detail.dataClass.general.classType.fillValues('Entity');
      await editor.table.row(0).locator.click();
      await entity.accordion.open();

      expect(await entity.association.collapsible.isOpen()).toBeFalsy();

      await entity.association.fillValues(
        'One-to-One',
        {
          all: true,
          persist: false,
          merge: false,
          remove: false,
          refresh: false
        },
        'MappedByFieldName',
        true
      );
      await entity.accordion.reopen();

      expect(await entity.association.collapsible.isOpen()).toBeFalsy();
    });
  });
});
