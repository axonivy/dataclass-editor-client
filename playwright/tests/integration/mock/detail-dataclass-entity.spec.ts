import { expect, test } from '@playwright/test';
import { describe } from 'node:test';
import { DataClassEditor } from '../../pageobjects/DataClassEditor';

let editor: DataClassEditor;

test.beforeEach(async ({ page }) => {
  editor = await DataClassEditor.openMock(page);
});

test('tab state', async () => {
  await expect(editor.detail.dataClass.entity.inscriptionTab.trigger).toBeHidden();

  await editor.table.row(0).locator.click();
  await expect(editor.detail.field.entity.inscriptionTab.trigger).toBeHidden();

  await editor.table.unselect();
  await editor.detail.dataClass.general.classType.fillValues('Entity');
  await editor.detail.dataClass.entity.inscriptionTab.expectToBeClosed();

  await editor.table.row(0).locator.click();
  await editor.detail.field.entity.inscriptionTab.expectToBeClosed();

  await editor.detail.field.general.properties.fillValues(false);
  await expect(editor.detail.field.entity.inscriptionTab.trigger).toBeHidden();
});

describe('collapsible state', () => {
  test('dataclass', async () => {
    const entity = editor.detail.dataClass.entity;

    await editor.detail.dataClass.general.classType.fillValues('Entity');
    await entity.inscriptionTab.toggle();

    await entity.databaseTable.collapsible.expectToBeClosed();

    await entity.fillValues('DatabaseTableName');
    await editor.detail.dataClass.general.inscriptionTab.toggle();
    await entity.inscriptionTab.toggle();

    await entity.databaseTable.collapsible.expectToBeOpen();
  });

  describe('field', () => {
    describe('database field', () => {
      test('name', async () => {
        const entity = editor.detail.field.entity;

        await editor.detail.dataClass.general.classType.fillValues('Entity');
        await editor.table.row(5).locator.click();
        await entity.inscriptionTab.toggle();

        await entity.databaseField.collapsible.expectToBeClosed();

        await entity.databaseField.collapsible.open();
        await entity.databaseField.name.locator.fill('DatabaseFieldName');
        await editor.detail.dataClass.general.inscriptionTab.toggle();
        await entity.inscriptionTab.toggle();

        await entity.databaseField.collapsible.expectToBeOpen();

        await entity.association.collapsible.open();
        await entity.association.cardinality.choose('One-to-One');
        await entity.association.mappedBy.choose('MappedByFieldName');
        await editor.detail.dataClass.general.inscriptionTab.toggle();
        await entity.inscriptionTab.toggle();

        await entity.databaseField.collapsible.expectToBeClosed();
      });

      test('length', async () => {
        const entity = editor.detail.field.entity;

        await editor.detail.dataClass.general.classType.fillValues('Entity');
        await editor.table.row(1).locator.click();
        await entity.inscriptionTab.toggle();

        await entity.databaseField.collapsible.expectToBeClosed();

        await entity.databaseField.collapsible.open();
        await entity.databaseField.length.locator.fill('DatabaseFieldLength');
        await editor.detail.dataClass.general.inscriptionTab.toggle();
        await entity.inscriptionTab.toggle();

        await entity.databaseField.collapsible.expectToBeOpen();

        await editor.detail.field.general.inscriptionTab.toggle();
        await editor.detail.field.general.nameTypeComment.type.locator.fill('Date');
        await entity.inscriptionTab.toggle();

        await entity.databaseField.collapsible.expectToBeClosed();
      });

      test('properties', async () => {
        const entity = editor.detail.field.entity;

        await editor.detail.dataClass.general.classType.fillValues('Entity');
        await editor.table.row(1).locator.click();
        await entity.inscriptionTab.toggle();

        await entity.databaseField.collapsible.expectToBeClosed();

        await entity.databaseField.collapsible.open();
        await entity.databaseField.properties.checkboxes.id.click();
        await editor.detail.dataClass.general.inscriptionTab.toggle();
        await entity.inscriptionTab.toggle();

        await entity.databaseField.collapsible.expectToBeOpen();
      });
    });

    test('association', async () => {
      const entity = editor.detail.field.entity;

      await editor.detail.dataClass.general.classType.fillValues('Entity');
      await editor.table.row(0).locator.click();
      await entity.inscriptionTab.toggle();

      await expect(entity.association.collapsible.locator).toBeHidden();

      await editor.table.row(5).locator.click();
      await entity.inscriptionTab.toggle();

      await expect(entity.association.collapsible.locator).toBeVisible();
      await entity.association.collapsible.expectToBeOpen();
    });
  });
});
