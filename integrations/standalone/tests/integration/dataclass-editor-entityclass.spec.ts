import { expect, test } from '@playwright/test';
import { DataClassEditor } from '../pageobjects/DataClassEditor';

let editor: DataClassEditor;

test.beforeEach(async ({ page }) => {
  editor = await DataClassEditor.openDataClass(page, 'dataclasses/dataclass/EntityClass.d.json');
});

test('load data', async () => {
  await editor.detail.dataClass.entity.expectToHaveValues('DBTableName');

  await editor.table.row(1).locator.click();
  await editor.detail.field.entity.accordion.open();
  await editor.detail.field.entity.databaseField.expectToHaveValues('dbFieldName0', '128', {
    ID: false,
    Generated: false,
    'Not nullable': true,
    Unique: true,
    'Not updateable': true,
    'Not insertable': true,
    Version: false
  });

  await editor.table.row(2).locator.click();
  await editor.detail.field.entity.accordion.open();
  await editor.detail.field.entity.association.expectToHaveValues(
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
  const editor = await DataClassEditor.openNewDataClass(page);
  await editor.detail.dataClass.general.classType.fillValues('Entity');

  await editor.detail.dataClass.entity.fillValues('NewDatabaseTableName');

  await editor.addField('entityField0', 'String');
  await editor.detail.field.general.properties.fillValues(true);
  await editor.detail.field.entity.accordion.open();
  await editor.detail.field.entity.databaseField.fillValues('NewDatabaseFieldName', 'NewDatabaseFieldLength', {
    ID: true,
    Generated: true,
    'Not nullable': false,
    Unique: false,
    'Not updateable': false,
    'Not insertable': false,
    Version: false
  });

  await editor.addField('entityField1', 'dataclass.AnotherEntityClass');
  await editor.detail.field.general.properties.fillValues(true);
  await editor.detail.field.entity.accordion.open();
  await editor.detail.field.entity.association.fillValues(
    'One-to-One',
    {
      All: true,
      Persist: true,
      Merge: true,
      Remove: true,
      Refresh: true
    },
    'NewMappedByFieldName',
    true
  );

  await page.reload();

  await editor.detail.dataClass.entity.expectToHaveValues('NewDatabaseTableName');

  await expect(editor.table.rows).toHaveCount(2);

  await editor.table.row(0).locator.click();
  await editor.detail.field.entity.accordion.open();
  await editor.detail.field.entity.databaseField.expectToHaveValues('NewDatabaseFieldName', 'NewDatabaseFieldLength', {
    ID: true,
    Generated: true,
    'Not nullable': false,
    Unique: false,
    'Not updateable': false,
    'Not insertable': false,
    Version: false
  });

  await editor.table.row(1).locator.click();
  await editor.detail.field.entity.accordion.open();
  await editor.detail.field.entity.association.expectToHaveValues(
    'One-to-One',
    {
      All: true,
      Persist: true,
      Merge: true,
      Remove: true,
      Refresh: true
    },
    'NewMappedByFieldName',
    true
  );
});
