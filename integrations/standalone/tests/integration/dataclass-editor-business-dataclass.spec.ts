import { expect, test } from '@playwright/test';
import { DataClassEditor } from '../pageobjects/DataClassEditor';

let editor: DataClassEditor;

test.beforeEach(async ({ page }) => {
  editor = await DataClassEditor.openDataClass(page, 'dataclasses/dataclass/DataClass.d.json');
});

test('load data', async () => {
  const table = editor.table;
  const detail = editor.detail;

  await detail.expectToHaveDataClassValues('Business Data', 'DataClass comment', '@javax.persistence.Table(name="tableName")');

  await expect(table.rows).toHaveCount(3);

  const row0 = table.row(0);
  await row0.expectToHaveValues('dataClassField0', 'String', 'DataClassField0 comment');
  await row0.locator.click();
  await detail.expectToHaveFieldValues('dataClassField0', 'String', true, 'DataClassField0 comment', '');

  const row1 = table.row(1);
  await row1.expectToHaveValues('dataClassField1', 'Integer', '');
  await row1.locator.click();
  await detail.expectToHaveFieldValues(
    'dataClassField1',
    'Integer',
    true,
    '',
    '@javax.persistence.ManyToMany\n@javax.persistence.JoinTable(name = "tableName", joinColumns = { @javax.persistence.JoinColumn(name = "name1Id", referencedColumnName = "id") }, inverseJoinColumns = { @javax.persistence.JoinColumn(name = "tableNameId", referencedColumnName = "id") })'
  );

  const row2 = table.row(2);
  await row2.expectToHaveValues('dataClassField2', 'Date', 'DataClassField2 comment');
  await row2.locator.click();
  await detail.expectToHaveFieldValues('dataClassField2', 'Date', false, 'DataClassField2 comment', '');
});

test('save data', async ({ page }) => {
  const editor = await DataClassEditor.openNewDataClass(page);
  await expect(editor.table.rows).toHaveCount(0);

  await editor.addField('newAttribute', 'String');

  await editor.page.reload();

  await expect(editor.table.rows).toHaveCount(1);
  await editor.table.row(0).expectToHaveValues('newAttribute', 'String', '');

  await editor.table.row(0).locator.click();
  await editor.delete.locator.click();

  await editor.page.reload();

  await expect(editor.table.rows).toHaveCount(0);
});
