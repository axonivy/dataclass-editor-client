import { expect, test } from '@playwright/test';
import { DataClassEditor } from '../pageobjects/DataClassEditor';

let editor: DataClassEditor;

test.beforeEach(async ({ page }) => {
  editor = await DataClassEditor.openDataClass(page, 'dataclasses/dataclass/EntityClass.d.json');
});

test('load data', async () => {
  const table = editor.table;
  const detail = editor.detail;

  await detail.expectToHaveEntityClassValues('EntityClass', 'EntityClass comment', [], 'Entity', 'DBTableName');

  await expect(table.rows).toHaveCount(3);

  const row0 = table.row(0);
  await row0.expectToHaveValues('id', 'Integer', 'Identifier');
  await row0.locator.click();
  await detail.expectToHaveEntityClassFieldValues(
    'id',
    'Integer',
    'Identifier',
    true,
    [],
    '',
    '',
    {
      ID: true,
      Generated: true,
      'Not nullable': false,
      Unique: false,
      'Not updateable': false,
      'Not insertable': false,
      Version: false
    },
    '',
    {
      All: false,
      Persist: true,
      Merge: true,
      Remove: false,
      Refresh: false
    },
    '',
    false
  );

  const row1 = table.row(1);
  await row1.expectToHaveValues('entityClassField0', 'String', '');
  await row1.locator.click();
  await detail.expectToHaveEntityClassFieldValues(
    'entityClassField0',
    'String',
    '',
    true,
    [],
    'dbFieldName0',
    '128',
    {
      ID: false,
      Generated: false,
      'Not nullable': true,
      Unique: true,
      'Not updateable': true,
      'Not insertable': true,
      Version: false
    },
    '',
    {
      All: false,
      Persist: true,
      Merge: true,
      Remove: false,
      Refresh: false
    },
    '',
    false
  );

  const row2 = table.row(2);
  await row2.expectToHaveValues('entityClassField1', 'AnotherEntityClass', '');
  await row2.locator.click();
  await detail.expectToHaveEntityClassFieldValues(
    'entityClassField1',
    'dataclass.AnotherEntityClass',
    '',
    true,
    [],
    '',
    '',
    {
      ID: false,
      Generated: false,
      'Not nullable': false,
      Unique: false,
      'Not updateable': false,
      'Not insertable': false,
      Version: false
    },
    'One-to-One',
    {
      All: false,
      Persist: false,
      Merge: false,
      Remove: true,
      Refresh: true
    },
    'invers',
    true
  );
});

test('save data', async ({ page }) => {
  const { editor, name } = await DataClassEditor.openNewDataClass(page);
  await expect(editor.table.rows).toHaveCount(0);

  await editor.detail.fillEntityClassValues('New Description', ['New Entity Class Annotation'], 'Entity', 'DatabaseTableName');
  await editor.addField('newAttribute', 'String');

  await editor.page.reload();

  await editor.detail.expectToHaveEntityClassValues(name, 'New Description', ['New Entity Class Annotation'], 'Entity', 'DatabaseTableName');
  await expect(editor.table.rows).toHaveCount(1);
  await editor.table.row(0).expectToHaveValues('newAttribute', 'String', '');

  await editor.table.row(0).locator.click();
  await editor.detail.fillEntityFieldValues(
    'New Name',
    'String',
    'New Comment',
    true,
    ['New Field Annotation'],
    'New Database Field Name',
    'New Database Field Length',
    ['Not nullable', 'Unique', 'Not updateable', 'Not insertable'],
    'One-to-One',
    ['All'],
    '',
    false
  );

  await editor.page.reload();

  await editor.table.row(0).locator.click();
  await editor.detail.expectToHaveEntityClassFieldValues(
    'New Name',
    'String',
    'New Comment',
    true,
    ['New Field Annotation'],
    'New Database Field Name',
    'New Database Field Length',
    {
      ID: false,
      Generated: false,
      'Not nullable': true,
      Unique: true,
      'Not updateable': true,
      'Not insertable': true,
      Version: false
    },
    'One-to-One',
    {
      All: true,
      Persist: true,
      Merge: true,
      Remove: true,
      Refresh: true
    },
    '',
    false
  );

  await editor.detail.mappedBy.locator.fill('New Association Mapped By');
  await editor.detail.removeOrphans.click();

  await editor.page.reload();

  await editor.table.row(0).locator.click();
  await editor.detail.entity.open();
  await editor.detail.association.open();
  await expect(editor.detail.mappedBy.locator).toHaveValue('New Association Mapped By');
  await expect(editor.detail.removeOrphans).toBeChecked();

  await editor.delete.locator.click();

  await editor.page.reload();

  await expect(editor.table.rows).toHaveCount(0);
});
