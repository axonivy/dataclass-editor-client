import { expect, test } from '@playwright/test';
import { DataClassEditor } from '../pageobjects/DataClassEditor';

let editor: DataClassEditor;

test.beforeEach(async ({ page }) => {
  editor = await DataClassEditor.openMock(page);
  await expect(editor.table.rows).toHaveCount(4);
});

test('title', async () => {
  await expect(editor.page).toHaveTitle('Data Class Editor Mock');
});

test('detail data class', async () => {
  await editor.detail.expectTitle('Data Class Editor');
  await editor.detail.expectToBeDataClass();
});

test('detail field', async () => {
  await editor.table.row(0).locator.click();
  await editor.detail.expectTitle('Attribute - firstName');
  await editor.detail.expectToBeField();
});

test('theme', async () => {
  const settings = editor.settings;
  await settings.button.locator.click();
  await settings.theme.expectToBeLight();
  await settings.theme.switch.locator.click();
  await settings.theme.expectToBeDark();
});

test('toggle detail', async () => {
  await expect(editor.detailPanel).toBeVisible();
  await editor.detailToggle.locator.click();
  await expect(editor.detailPanel).not.toBeVisible();
  await editor.detailToggle.locator.click();
  await expect(editor.detailPanel).toBeVisible();
});

test.describe('add field', async () => {
  test('add', async () => {
    await editor.addField('newAttribute', 'String');
    await expect(editor.table.rows).toHaveCount(5);
    await editor.table.row(4).expectToBeSelected();
    await editor.table.row(4).expectToHaveValues('newAttribute', 'String', '');
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
        await editor.add.type.locator.clear();
        await editor.add.typeMessage.expectToHaveErrorMessage('Type cannot be empty.');
      });
    });
  });
});

test.describe('delete field', async () => {
  test('delete', async () => {
    await editor.deleteField(1);
    await expect(editor.table.rows).toHaveCount(3);

    const row = editor.table.row(1);
    await row.expectToHaveValues('date', 'Date', 'The date of the interview.');
    await row.expectToBeSelected();
    await editor.detail.expectToHaveFieldValues('date', 'Date', true, 'The date of the interview.', '');
  });

  test('delete last field', async () => {
    await editor.deleteField(3);
    await expect(editor.table.rows).toHaveCount(3);

    await editor.table.row(2).expectToBeSelected();
    await editor.detail.expectToHaveFieldValues('date', 'Date', true, 'The date of the interview.', '');
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
