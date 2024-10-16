import { expect, test } from '@playwright/test';
import { DataClassEditor } from '../pageobjects/DataClassEditor';

let editor: DataClassEditor;

test.beforeEach(async ({ page }) => {
  editor = await DataClassEditor.openMock(page);
});

test.describe('add field', async () => {
  test.describe('add', async () => {
    test('data class', async () => {
      await editor.addField('newAttribute', 'String');
      await expect(editor.table.rows).toHaveCount(5);
      await editor.table.row(4).expectToBeSelected();
      await editor.table.row(4).expectToHaveValues('newAttribute', 'String', '');
      await editor.table.row(4).locator.click();
      await editor.detail.field.general.properties.expectToHaveValues(true);
    });

    test('entity class', async () => {
      await editor.detail.dataClass.general.classType.fillValues('Entity');
      await editor.addField('newAttribute', 'String');
      await editor.detail.field.general.properties.fillValues(true);
      await editor.detail.field.entity.accordion.open();
      await editor.detail.field.entity.association.collapsible.open();
      await editor.detail.field.entity.association.expectCascadeTypesToHaveCheckedState({
        all: false,
        persist: true,
        merge: true,
        remove: false,
        refresh: false
      });
    });
  });

  test('default values', async () => {
    await editor.add.open.locator.click();
    await editor.add.expectToHaveValues('newAttribute', 'String');
  });

  test.describe('validation', async () => {
    test.describe('name', async () => {
      test('empty', async () => {
        await editor.add.open.locator.click();
        await expect(editor.add.nameMessage.locator).toBeHidden();
        await editor.add.name.locator.clear();
        await editor.add.nameMessage.expectToHaveErrorMessage('Name cannot be empty.');
      });

      test('taken', async () => {
        await editor.add.open.locator.click();
        await expect(editor.add.nameMessage.locator).toBeHidden();
        await editor.add.name.locator.fill('firstName');
        await editor.add.nameMessage.expectToHaveErrorMessage('Name is already taken.');
      });
    });

    test.describe('type', async () => {
      test('empty', async () => {
        await editor.add.open.locator.click();
        await expect(editor.add.typeMessage.locator).toBeHidden();
        await editor.add.type.clear();
        await editor.add.typeMessage.expectToHaveErrorMessage('Type cannot be empty.');
      });
    });
  });

  test('shortcuts', async ({ browserName }) => {
    const modifier = browserName === 'webkit' ? 'Meta' : 'Control';
    await editor.page.keyboard.press(`${modifier}+Alt+n`);
    await expect(editor.add.locator).toBeVisible();
    await editor.page.keyboard.press('Enter');
    await expect(editor.add.locator).toBeHidden();
    await expect(editor.table.rows).toHaveCount(5);
  });
});

test.describe('delete field', async () => {
  test('delete', async () => {
    await editor.deleteField(1);
    await expect(editor.table.rows).toHaveCount(3);

    await editor.table.row(1).expectToBeSelected();
    await editor.detail.field.general.expectToHaveValues('date', 'Date', '', true, []);
  });

  test('delete last field', async () => {
    await editor.deleteField(3);
    await expect(editor.table.rows).toHaveCount(3);

    await editor.table.row(2).expectToBeSelected();
    await editor.detail.field.general.expectToHaveValues('date', 'Date', '', true, []);
  });

  test('delete last remaining field', async () => {
    const rowCount = await editor.table.rows.count();

    await editor.table.row(0).locator.click();
    for (let i = 0; i < rowCount; i++) {
      await editor.delete.locator.click();
    }

    await expect(editor.table.rows).toHaveCount(0);
    await editor.detail.expectToBeDataClass();
  });
});

test('disable reorder', async () => {
  await editor.table.expectToBeReorderable();
  await editor.table.header(0).sort.locator.click();
  await editor.table.expectToNotBeReorderable();
  await editor.table.header(0).sort.locator.click();
  await editor.table.expectToNotBeReorderable();
  await editor.table.header(0).sort.locator.click();
  await editor.table.expectToBeReorderable();
});
