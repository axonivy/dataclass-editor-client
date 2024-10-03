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
    id: false,
    generated: false,
    notNullable: true,
    unique: true,
    notUpdateable: true,
    notInsertable: true,
    Version: false
  });

  await editor.table.row(2).locator.click();
  await editor.detail.field.entity.accordion.open();
  await editor.detail.field.entity.association.expectToHaveValues(
    'One-to-One',
    {
      all: false,
      persist: false,
      merge: false,
      remove: true,
      refresh: true
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
    id: true,
    generated: true,
    notNullable: false,
    unique: false,
    notUpdateable: false,
    notInsertable: false,
    Version: false
  });

  await editor.addField('entityField1', 'dataclass.AnotherEntityClass');
  await editor.detail.field.general.properties.fillValues(true);
  await editor.detail.field.entity.accordion.open();
  await editor.detail.field.entity.association.fillValues(
    'One-to-One',
    {
      all: true,
      persist: true,
      merge: true,
      remove: true,
      refresh: true
    },
    'NewMappedByFieldName',
    true
  );

  await page.reload();

  await editor.detail.dataClass.entity.expectToHaveValues('NewDatabaseTableName');

  await expect(editor.table.rows).toHaveCount(3);

  await editor.table.row(1).locator.click();
  await editor.detail.field.entity.accordion.open();
  await editor.detail.field.entity.databaseField.expectToHaveValues('NewDatabaseFieldName', 'NewDatabaseFieldLength', {
    id: true,
    generated: true,
    notNullable: false,
    unique: false,
    notUpdateable: false,
    notInsertable: false,
    Version: false
  });

  await editor.table.row(2).locator.click();
  await editor.detail.field.entity.accordion.open();
  await editor.detail.field.entity.association.expectToHaveValues(
    'One-to-One',
    {
      all: true,
      persist: true,
      merge: true,
      remove: true,
      refresh: true
    },
    'NewMappedByFieldName',
    true
  );
});
