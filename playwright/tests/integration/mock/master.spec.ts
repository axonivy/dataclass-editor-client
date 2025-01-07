import { expect, test } from '@playwright/test';
import { DataClassEditor } from '../../pageobjects/DataClassEditor';

let editor: DataClassEditor;

test.beforeEach(async ({ page }) => {
  editor = await DataClassEditor.openMock(page);
});

test.describe('add field', () => {
  test.describe('add', () => {
    test('data class', async () => {
      await editor.addField('newAttribute', 'String');
      await expect(editor.table.rows).toHaveCount(7);
      await editor.table.row(6).expectToBeSelected();
      await editor.table.row(6).expectToHaveValues('newAttribute', 'String', '');
      await editor.detail.field.general.properties.expectToHaveValues(true);
    });

    test('entity class', async () => {
      await editor.detail.dataClass.general.classType.fillValues('Entity');
      await editor.addField('entityNew', 'String');
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

  test.describe('validation', () => {
    test.describe('name', () => {
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

    test.describe('type', () => {
      test('empty', async () => {
        await editor.add.open.locator.click();
        await expect(editor.add.typeMessage.locator).toBeHidden();
        await editor.add.type.locator.clear();
        await editor.add.typeMessage.expectToHaveErrorMessage('Type cannot be empty.');
      });
    });
  });

  test('shortcuts', async () => {
    await editor.page.keyboard.press('ControlOrMeta+Alt+n');
    await expect(editor.add.locator).toBeVisible();
    await editor.page.keyboard.press('Enter');
    await expect(editor.add.locator).toBeHidden();
    await expect(editor.table.rows).toHaveCount(7);
  });
});

test.describe('delete field', () => {
  test('delete', async () => {
    await editor.deleteField(1);
    await expect(editor.table.rows).toHaveCount(5);

    await editor.table.row(1).expectToBeSelected();
    await editor.detail.field.general.expectToHaveValues('date', 'Date', '', true, []);
  });

  test('delete last field', async () => {
    await editor.deleteField(5);
    await expect(editor.table.rows).toHaveCount(5);

    await editor.table.row(4).expectToBeSelected();
    await editor.detail.field.general.expectToHaveValues('entity', 'mock.Entity', 'An entity.', true, []);
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

test.describe('table keyboard support', async () => {
  test('move single selection via arrowKey', async () => {
    await editor.table.expectToHaveNothingSelected();
    await editor.table.locator.focus();
    await editor.page.keyboard.press('ArrowDown');
    await editor.page.keyboard.press('ArrowDown');
    await editor.table.expectToBeSelected(1);

    await editor.page.keyboard.press('ArrowUp');
    await editor.page.keyboard.press('ArrowUp');
    await editor.page.keyboard.press('ArrowUp');
    await editor.table.expectToBeSelected(4);
  });

  test('move multi selection via arrowKey', async () => {
    await editor.table.expectToHaveNothingSelected();
    await editor.table.locator.focus();
    await editor.page.keyboard.press('ArrowDown');
    await editor.page.keyboard.down('Shift');
    await editor.page.keyboard.press('ArrowDown');
    await editor.page.keyboard.press('ArrowDown');
    await editor.table.expectToBeSelected(0, 1, 2);

    await editor.page.keyboard.up('Shift');
    await editor.page.keyboard.press('ArrowDown');
    await editor.table.expectToBeSelected(3);

    await editor.page.keyboard.down('Shift');
    await editor.page.keyboard.press('ArrowUp');
    await editor.page.keyboard.press('ArrowUp');
    await editor.table.expectToBeSelected(1, 2, 3);
  });

  test('reorder single row via arrowKey', async () => {
    await editor.table.expectToHaveNothingSelected();
    await editor.table.locator.focus();
    await editor.page.keyboard.press('ArrowDown');
    await editor.page.keyboard.down('Alt');
    await editor.page.keyboard.press('ArrowDown');
    await editor.page.keyboard.press('ArrowDown');
    await expect(editor.table.row(2).column(0).locator).toHaveText('firstName');
  });

  test('reorder multiple rows via arrowKey', async () => {
    await editor.table.expectToHaveNothingSelected();
    await editor.table.locator.focus();
    await editor.page.keyboard.press('ArrowDown');
    await editor.page.keyboard.down('Shift');
    await editor.page.keyboard.press('ArrowDown');

    await editor.page.keyboard.down('Alt');
    await editor.page.keyboard.press('ArrowUp');
    await editor.page.keyboard.press('ArrowUp');
    await expect(editor.table.row(3).column(0).locator).toHaveText('firstName');
    await expect(editor.table.row(4).column(0).locator).toHaveText('lastName');
  });

  test('open/close detail via enter', async () => {
    await editor.table.expectToHaveNothingSelected();
    await expect(editor.detail.locator).toBeVisible();
    await editor.table.locator.focus();
    await editor.page.keyboard.press('ArrowDown');
    await editor.page.keyboard.press('Enter');
    await expect(editor.detail.locator).not.toBeVisible();
    await editor.page.keyboard.press('ArrowDown');
    await editor.page.keyboard.press('ArrowDown');
    await editor.page.keyboard.press('Enter');
    await expect(editor.detail.locator).toBeVisible();
    await editor.detail.field.general.nameTypeComment.expectToHaveValues('date', 'Date', '');
  });
});
