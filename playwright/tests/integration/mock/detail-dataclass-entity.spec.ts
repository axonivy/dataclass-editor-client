import { expect, test } from '@playwright/test';
import { describe } from 'node:test';
import { DataClassEditor } from '../../pageobjects/DataClassEditor';

let editor: DataClassEditor;

test.beforeEach(async ({ page }) => {
  editor = await DataClassEditor.openMock(page);
});

test('accordion state', async () => {
  await expect(editor.detail.dataClass.entity.accordion.locator).toBeHidden();

  await editor.table.row(0).locator.click();
  await expect(editor.detail.field.entity.accordion.locator).toBeHidden();

  await editor.table.unselect();
  await editor.detail.dataClass.general.classType.fillValues('Entity');
  await editor.detail.dataClass.entity.accordion.expectToBeClosed();

  await editor.table.row(0).locator.click();
  await editor.detail.field.entity.accordion.expectToBeClosed();

  await editor.detail.field.general.properties.fillValues(false);
  await expect(editor.detail.field.entity.accordion.locator).toBeHidden();
});

describe('collapsible state', async () => {
  test('dataclass', async () => {
    const entity = editor.detail.dataClass.entity;

    await editor.detail.dataClass.general.classType.fillValues('Entity');
    await entity.accordion.open();

    await entity.databaseTable.collapsible.expectToBeClosed();

    await entity.fillValues('DatabaseTableName');
    await entity.accordion.reopen();

    await entity.databaseTable.collapsible.expectToBeOpen();
  });

  describe('field', async () => {
    describe('database field', async () => {
      test('name', async () => {
        const entity = editor.detail.field.entity;

        await editor.detail.dataClass.general.classType.fillValues('Entity');
        await editor.table.row(5).locator.click();
        await entity.accordion.open();

        await entity.databaseField.collapsible.expectToBeClosed();

        await entity.databaseField.collapsible.open();
        await entity.databaseField.name.locator.fill('DatabaseFieldName');
        await entity.accordion.reopen();

        await entity.databaseField.collapsible.expectToBeOpen();

        await entity.association.collapsible.open();
        await entity.association.cardinality.choose('One-to-One');
        await entity.association.mappedBy.choose('MappedByFieldName');
        await entity.accordion.reopen();

        await entity.databaseField.collapsible.expectToBeClosed();
      });

      test('length', async () => {
        const entity = editor.detail.field.entity;

        await editor.detail.dataClass.general.classType.fillValues('Entity');
        await editor.table.row(1).locator.click();
        await entity.accordion.open();

        await entity.databaseField.collapsible.expectToBeClosed();

        await entity.databaseField.collapsible.open();
        await entity.databaseField.length.locator.fill('DatabaseFieldLength');
        await entity.accordion.reopen();

        await entity.databaseField.collapsible.expectToBeOpen();

        await editor.detail.field.general.accordion.open();
        await editor.detail.field.general.nameTypeComment.type.locator.fill('Date');
        await entity.accordion.open();

        await entity.databaseField.collapsible.expectToBeClosed();
      });

      test('properties', async () => {
        const entity = editor.detail.field.entity;

        await editor.detail.dataClass.general.classType.fillValues('Entity');
        await editor.table.row(1).locator.click();
        await entity.accordion.open();

        await entity.databaseField.collapsible.expectToBeClosed();

        await entity.databaseField.collapsible.open();
        await entity.databaseField.properties.id.click();
        await entity.accordion.reopen();

        await entity.databaseField.collapsible.expectToBeOpen();
      });
    });

    test('association', async () => {
      const entity = editor.detail.field.entity;

      await editor.detail.dataClass.general.classType.fillValues('Entity');
      await editor.table.row(0).locator.click();
      await entity.accordion.open();

      await expect(entity.association.collapsible.locator).toBeHidden();

      await editor.table.row(5).locator.click();
      await entity.accordion.open();

      await expect(entity.association.collapsible.locator).toBeVisible();
      await entity.association.collapsible.expectToBeOpen();
    });
  });
});
