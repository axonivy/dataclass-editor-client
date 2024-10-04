import { expect, test } from '@playwright/test';
import { describe } from 'node:test';
import { DataClassEditor } from '../pageobjects/DataClassEditor';

describe('validation', async () => {
  test('class', async ({ page }) => {
    const editor = await DataClassEditor.openNewDataClass(page);
    await editor.detail.dataClass.general.classType.fillValues('Entity');

    await expect(editor.messages).toHaveCount(0);

    await editor.table.row(0).locator.click();
    await editor.delete.locator.click();
    await expect(editor.messages).toHaveCount(1);

    await expect(editor.messages.nth(0)).toHaveAttribute('data-state', 'error');
    await expect(editor.messages.nth(0)).toHaveText("An entity class needs exactly one 'Id' field.");
  });

  test('field', async ({ page }) => {
    const editor = await DataClassEditor.openNewDataClass(page);
    await editor.addField('field0', 'String');
    await editor.addField('field1', 'String');

    await expect(editor.table.rows).toHaveCount(2);

    await editor.table.row(0).locator.click();
    await editor.detail.field.general.nameTypeComment.type.locator.fill('UnknownType');
    await expect(editor.table.rows).toHaveCount(3);

    await expect(editor.table.row(0).locator).toHaveClass(/row-error/);
    await expect(editor.table.row(1).locator).toHaveClass(/ui-message-row/);
    await expect(editor.table.row(1).locator.locator('.ui-message')).toHaveAttribute('data-state', 'error');
    await expect(editor.table.row(1).locator).toHaveText("Unknown field type 'UnknownType'.");
  });
});
