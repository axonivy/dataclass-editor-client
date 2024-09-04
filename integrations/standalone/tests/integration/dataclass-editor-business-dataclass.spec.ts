import { test } from '@playwright/test';
import { DataClassEditor } from '../pageobjects/DataClassEditor';

let editor: DataClassEditor;

test.beforeEach(async ({ page }) => {
  editor = await DataClassEditor.openEngine(page, 'dataclasses/dataclass/DataClass.d.json');
});

test('load data', async () => {
  const table = editor.table;
  const detail = editor.detail;

  await detail.expectDataClassValues('business-data-class', 'DataClass comment', '@javax.persistence.Table(name="tableName")');

  await table.expectRowCount(3);

  const row0 = table.row(0);
  await row0.expectValues('dataClassField0', 'String', true, 'DataClassField0 comment');
  await row0.click();
  await detail.expectFieldValues('dataClassField0', 'String', true, 'DataClassField0 comment', '');

  const row1 = table.row(1);
  await row1.expectValues('dataClassField1', 'Integer', true, '');
  await row1.click();
  await detail.expectFieldValues(
    'dataClassField1',
    'Integer',
    true,
    '',
    '@javax.persistence.ManyToMany\n@javax.persistence.JoinTable(name = "tableName", joinColumns = { @javax.persistence.JoinColumn(name = "name1Id", referencedColumnName = "id") }, inverseJoinColumns = { @javax.persistence.JoinColumn(name = "tableNameId", referencedColumnName = "id") })'
  );

  const row2 = table.row(2);
  await row2.expectValues('dataClassField2', 'Date', false, 'DataClassField2 comment');
  await row2.click();
  await detail.expectFieldValues('dataClassField2', 'Date', false, 'DataClassField2 comment', '');
});
