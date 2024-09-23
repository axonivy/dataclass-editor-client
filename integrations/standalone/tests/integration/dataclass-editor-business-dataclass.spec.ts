import { expect, test } from '@playwright/test';
import { DataClassEditor } from '../pageobjects/DataClassEditor';

let editor: DataClassEditor;

test.beforeEach(async ({ page }) => {
  editor = await DataClassEditor.openDataClass(page, 'dataclasses/dataclass/DataClass.d.json');
});

test('load data', async () => {
  const table = editor.table;
  const detail = editor.detail;

  await detail.expectToHaveDataClassValues('DataClass', 'DataClass comment', ['@javax.persistence.Table(name="tableName")'], 'Business Data');

  await expect(table.rows).toHaveCount(3);

  const row0 = table.row(0);
  await row0.expectToHaveValues('dataClassField0', 'String', 'DataClassField0 comment');
  await row0.locator.click();
  await detail.expectToHaveFieldValues('dataClassField0', 'String', 'DataClassField0 comment', true, []);

  const row1 = table.row(1);
  await row1.expectToHaveValues('dataClassField1', 'Integer', '');
  await row1.locator.click();
  await detail.expectToHaveFieldValues('dataClassField1', 'Integer', '', true, [
    '@javax.persistence.ManyToMany',
    '@javax.persistence.JoinTable(name = "tableName", joinColumns = { @javax.persistence.JoinColumn(name = "name1Id", referencedColumnName = "id") }, inverseJoinColumns = { @javax.persistence.JoinColumn(name = "tableNameId", referencedColumnName = "id") })'
  ]);

  const row2 = table.row(2);
  await row2.expectToHaveValues('dataClassField2', 'Date', 'DataClassField2 comment');
  await row2.locator.click();
  await detail.expectToHaveFieldValues('dataClassField2', 'Date', 'DataClassField2 comment', false, []);
});

test('save data', async ({ page }) => {
  const { editor, name } = await DataClassEditor.openNewDataClass(page);
  await expect(editor.table.rows).toHaveCount(0);

  await editor.detail.fillDataClassValues('New Description', ['New Data Class Annotation'], 'Business Data');
  await editor.addField('newAttribute', 'String');

  await editor.page.reload();

  await editor.detail.expectToHaveDataClassValues(name, 'New Description', ['New Data Class Annotation'], 'Business Data');
  await expect(editor.table.rows).toHaveCount(1);
  await editor.table.row(0).expectToHaveValues('newAttribute', 'String', '');

  await editor.table.row(0).locator.click();
  await editor.detail.fillFieldValues('New Name', 'New Type', 'New Comment', true, ['New Field Annotation']);

  await editor.page.reload();

  await editor.table.row(0).locator.click();
  await editor.detail.expectToHaveFieldValues('New Name', 'New Type', 'New Comment', true, ['New Field Annotation']);

  await editor.delete.locator.click();

  await editor.page.reload();

  await expect(editor.table.rows).toHaveCount(0);
});
