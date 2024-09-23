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

test('headers', async () => {
  await expect(editor.title).toHaveText('Data Editor');
  await expect(editor.detail.title).toHaveText('Data - Interview');

  await editor.detail.classTypeCollapsible.open();
  await editor.detail.classTypeSelect.choose('Business Data');
  await expect(editor.title).toHaveText('Business Data Editor');
  await expect(editor.detail.title).toHaveText('Business Data - Interview');

  await editor.detail.classTypeSelect.choose('Entity');
  await expect(editor.title).toHaveText('Entity Editor');
  await expect(editor.detail.title).toHaveText('Entity - Interview');

  await editor.table.row(0).locator.click();
  await expect(editor.detail.title).toHaveText('Attribute - firstName');
});

test('detail', async () => {
  await editor.detail.expectToBeDataClass();
  await editor.table.row(0).locator.click();
  await editor.detail.expectToBeDataClassField();
  await editor.table.header.click();
  await editor.detail.expectToBeDataClass();

  await editor.detail.classTypeCollapsible.open();
  await editor.detail.classTypeSelect.choose('Entity');
  await editor.detail.expectToBeEntityClass();
  await editor.table.row(0).locator.click();
  await editor.detail.expectToBeEntityClassField();
  await editor.table.header.click();
  await editor.detail.expectToBeEntityClass();
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
    await row.expectToHaveValues('date', 'Date', '');
    await row.expectToBeSelected();
    await editor.detail.expectToHaveDataClassFieldValues('date', 'Date', '', true, []);
  });

  test('delete last field', async () => {
    await editor.deleteField(3);
    await expect(editor.table.rows).toHaveCount(3);

    await editor.table.row(2).expectToBeSelected();
    await editor.detail.expectToHaveDataClassFieldValues('date', 'Date', '', true, []);
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

test('type', async () => {
  const row = editor.table.row(3);
  await expect(row.column(1).locator).toHaveText('Conversation');
  await row.locator.click();
  await expect(editor.detail.type.locator).toHaveValue('mock.Conversation');
});

test('annotations', async () => {
  await editor.detail.annotations.collapsible.open();
  await editor.detail.annotations.expectToHaveValues('@full.qualified.name.one(argument = "value")', '@full.qualified.name.two');
  await expect(editor.detail.annotations.delete.locator).toBeDisabled();

  await editor.detail.annotations.add.locator.click();
  await editor.detail.annotations.expectToHaveValues('@full.qualified.name.one(argument = "value")', '@full.qualified.name.two', '');
  await editor.detail.annotations.table.row(2).expectToBeSelected();
  await expect(editor.detail.annotations.delete.locator).toBeEnabled();

  await editor.detail.annotations.delete.locator.click();
  await editor.detail.annotations.expectToHaveValues('@full.qualified.name.one(argument = "value")', '@full.qualified.name.two');
  await editor.detail.annotations.table.row(1).expectToBeSelected();

  await editor.detail.annotations.table.row(0).locator.click();
  await editor.detail.annotations.delete.locator.click();
  await editor.detail.annotations.expectToHaveValues('@full.qualified.name.two');
  await editor.detail.annotations.table.row(0).expectToBeSelected();

  await editor.detail.annotations.delete.locator.click();
  await expect(editor.detail.annotations.table.rows).toHaveCount(0);
  await expect(editor.detail.annotations.delete.locator).toBeDisabled();
});

test('collapsible state', async () => {
  expect(await editor.detail.nameDescription.isOpen()).toBeTruthy();
  expect(await editor.detail.annotations.collapsible.isOpen()).toBeTruthy();
  expect(await editor.detail.classTypeCollapsible.isOpen()).toBeFalsy();

  await editor.detail.fillDataClassGeneralValues('', [], 'Entity');
  await editor.detail.general.reopen();
  expect(await editor.detail.nameDescription.isOpen()).toBeTruthy();
  expect(await editor.detail.annotations.collapsible.isOpen()).toBeFalsy();
  expect(await editor.detail.classTypeCollapsible.isOpen()).toBeFalsy();

  await editor.detail.entity.open();
  expect(await editor.detail.databaseTable.isOpen()).toBeFalsy();

  await editor.detail.fillDataClassEntityValues('DatabaseTableName');
  await editor.detail.entity.reopen();
  expect(await editor.detail.databaseTable.isOpen()).toBeTruthy();

  await editor.table.row(0).locator.click();
  expect(await editor.detail.nameTypeComment.isOpen()).toBeTruthy();
  expect(await editor.detail.properties.isOpen()).toBeFalsy();
  expect(await editor.detail.annotations.collapsible.isOpen()).toBeFalsy();

  await editor.detail.fillFieldGeneralValues('NewName', 'Integer', '', false, ['annotation']);
  await editor.detail.general.reopen();
  expect(await editor.detail.nameTypeComment.isOpen()).toBeTruthy();
  expect(await editor.detail.properties.isOpen()).toBeFalsy();
  expect(await editor.detail.annotations.collapsible.isOpen()).toBeTruthy();

  await editor.table.row(1).locator.click();
  await editor.detail.entity.open();
  expect(await editor.detail.databaseField.isOpen()).toBeFalsy();
  expect(await editor.detail.association.isOpen()).toBeFalsy();

  await editor.detail.fillFieldEntityDatabaseValues('DatabaseFieldName', '', []);
  await editor.detail.entity.reopen();
  expect(await editor.detail.databaseField.isOpen()).toBeTruthy();

  await editor.detail.fillFieldEntityAssociationValues('One-to-One', [], 'MappedByFieldName', false);
  await editor.detail.entity.reopen();
  expect(await editor.detail.databaseField.isOpen()).toBeFalsy();

  await editor.detail.association.open();
  await editor.detail.cardinality.choose('');
  await editor.detail.fillFieldEntityDatabaseValues('', 'DatabaseFieldLength', []);
  await editor.detail.entity.reopen();
  expect(await editor.detail.databaseField.isOpen()).toBeTruthy();

  await editor.detail.general.open();
  await editor.detail.type.locator.fill('Integer');
  await editor.detail.entity.open();
  expect(await editor.detail.databaseField.isOpen()).toBeFalsy();

  await editor.detail.general.open();
  await editor.detail.type.locator.fill('String');
  await editor.detail.fillFieldEntityDatabaseValues('', '', ['ID']);
  await editor.detail.entity.reopen();
  expect(await editor.detail.databaseField.isOpen()).toBeTruthy();

  await editor.detail.fillFieldEntityAssociationValues('One-to-One', ['All'], 'MappedByFieldName', true);
  await editor.detail.entity.reopen();
  expect(await editor.detail.association.isOpen()).toBeFalsy();
});

test('accordion state', async () => {
  expect(await editor.detail.general.isOpen()).toBeTruthy();
  await expect(editor.detail.entity.locator).toBeHidden();

  await editor.table.row(0).locator.click();
  expect(await editor.detail.general.isOpen()).toBeTruthy();
  await expect(editor.detail.entity.locator).toBeHidden();

  await editor.table.header.click();
  await editor.detail.classTypeCollapsible.open();
  await editor.detail.classTypeSelect.choose('Business Data');
  await expect(editor.detail.entity.locator).toBeHidden();

  await editor.table.row(0).locator.click();
  await expect(editor.detail.entity.locator).toBeHidden();

  await editor.table.header.click();
  await editor.detail.classTypeCollapsible.open();
  await editor.detail.classTypeSelect.choose('Entity');
  expect(await editor.detail.general.isOpen()).toBeTruthy();
  expect(await editor.detail.entity.isOpen()).toBeFalsy();

  await editor.table.row(0).locator.click();
  expect(await editor.detail.general.isOpen()).toBeTruthy();
  expect(await editor.detail.entity.isOpen()).toBeFalsy();

  await editor.detail.properties.open();
  await editor.detail.persistent.click();
  await expect(editor.detail.entity.locator).toBeHidden();
});

test('database field name', async () => {
  await editor.detail.classTypeCollapsible.open();
  await editor.detail.classTypeSelect.choose('Entity');
  await editor.table.row(0).locator.click();
  await editor.detail.entity.open();
  await editor.detail.databaseField.open();
  expect(editor.detail.databaseFieldName.locator).toHaveValue('');
  editor.detail.databaseFieldName.expectToHavePlaceholder('firstName');
  expect(editor.detail.databaseFieldName.locator).toBeEnabled();

  await editor.detail.databaseFieldName.locator.fill('NewName');
  await editor.detail.fillFieldEntityAssociationValues('One-to-One', [], 'MappedByFieldName', false);
  expect(editor.detail.databaseFieldName.locator).toHaveValue('');
  editor.detail.databaseFieldName.expectToHavePlaceholder('');
  expect(editor.detail.databaseFieldName.locator).toBeDisabled();

  await editor.detail.mappedBy.locator.clear();
  await expect(editor.detail.databaseFieldName.locator).toHaveValue('NewName');
});

test('database field length', async () => {
  await editor.detail.classTypeCollapsible.open();
  await editor.detail.classTypeSelect.choose('Entity');
  await editor.table.row(0).locator.click();
  await editor.detail.entity.open();
  await editor.detail.databaseField.open();
  expect(editor.detail.databaseFieldLength.locator).toHaveValue('');
  editor.detail.databaseFieldLength.expectToHavePlaceholder('255');
  expect(editor.detail.databaseFieldLength.locator).toBeEnabled();

  await editor.detail.general.open();
  await editor.detail.type.locator.fill('BigInteger');
  await editor.detail.entity.open();
  await editor.detail.databaseField.open();
  expect(editor.detail.databaseFieldLength.locator).toHaveValue('');
  editor.detail.databaseFieldLength.expectToHavePlaceholder('19,2');
  expect(editor.detail.databaseFieldLength.locator).toBeEnabled();

  await editor.detail.general.open();
  await editor.detail.type.locator.fill('BigDecimal');
  await editor.detail.entity.open();
  await editor.detail.databaseField.open();
  expect(editor.detail.databaseFieldLength.locator).toHaveValue('');
  editor.detail.databaseFieldLength.expectToHavePlaceholder('19,2');
  expect(editor.detail.databaseFieldLength.locator).toBeEnabled();

  await editor.detail.databaseFieldLength.locator.fill('12,8');
  await editor.detail.general.open();
  await editor.detail.type.locator.fill('Integer');
  await editor.detail.entity.open();
  await editor.detail.databaseField.open();
  expect(editor.detail.databaseFieldLength.locator).toHaveValue('');
  editor.detail.databaseFieldLength.expectToHavePlaceholder('');
  expect(editor.detail.databaseFieldLength.locator).toBeDisabled();

  await editor.detail.general.open();
  await editor.detail.type.locator.fill('BigDecimal');
  await editor.detail.entity.open();
  await editor.detail.databaseField.open();
  expect(editor.detail.databaseFieldLength.locator).toHaveValue('12,8');
});

test('database field properties', async () => {
  await editor.detail.classTypeCollapsible.open();
  await editor.detail.classTypeSelect.choose('Entity');
  await editor.table.row(0).locator.click();
  await editor.detail.entity.open();
  await editor.detail.databaseField.open();
  await expect(editor.detail.databaseFieldProperties.ID).toBeEnabled();
  await expect(editor.detail.databaseFieldProperties.Generated).toBeDisabled();
  await expect(editor.detail.databaseFieldProperties['Not nullable']).toBeEnabled();
  await expect(editor.detail.databaseFieldProperties.Unique).toBeEnabled();
  await expect(editor.detail.databaseFieldProperties['Not updateable']).toBeEnabled();
  await expect(editor.detail.databaseFieldProperties['Not insertable']).toBeEnabled();
  await expect(editor.detail.databaseFieldProperties.Version).toBeDisabled();

  await editor.detail.databaseFieldProperties.ID.click();
  await expect(editor.detail.databaseFieldProperties.Generated).toBeEnabled();
  await expect(editor.detail.databaseFieldProperties['Not nullable']).toBeDisabled();
  await expect(editor.detail.databaseFieldProperties.Unique).toBeDisabled();
  await expect(editor.detail.databaseFieldProperties['Not updateable']).toBeDisabled();
  await expect(editor.detail.databaseFieldProperties['Not insertable']).toBeDisabled();
  await expect(editor.detail.databaseFieldProperties.Version).toBeDisabled();

  await editor.detail.general.open();
  await editor.detail.type.locator.fill('Short');
  await editor.detail.entity.open();
  await editor.detail.databaseField.open();
  await expect(editor.detail.databaseFieldProperties.ID).toBeDisabled();
  await expect(editor.detail.databaseFieldProperties.Version).toBeEnabled();

  await editor.detail.general.open();
  await editor.detail.type.locator.fill('Integer');
  await editor.detail.entity.open();
  await editor.detail.databaseField.open();
  await expect(editor.detail.databaseFieldProperties.ID).toBeEnabled();
  await expect(editor.detail.databaseFieldProperties.Version).toBeEnabled();

  await editor.detail.databaseFieldProperties.ID.click();
  await expect(editor.detail.databaseFieldProperties.Version).toBeDisabled();

  await editor.detail.databaseFieldProperties.ID.click();
  await editor.detail.databaseFieldProperties.Version.click();
  await expect(editor.detail.databaseFieldProperties.ID).toBeDisabled();
  await expect(editor.detail.databaseFieldProperties.Generated).toBeDisabled();
  await expect(editor.detail.databaseFieldProperties['Not nullable']).toBeDisabled();
  await expect(editor.detail.databaseFieldProperties.Unique).toBeDisabled();
  await expect(editor.detail.databaseFieldProperties['Not updateable']).toBeDisabled();
  await expect(editor.detail.databaseFieldProperties['Not insertable']).toBeDisabled();
  await expect(editor.detail.databaseFieldProperties.Version).toBeEnabled();

  await editor.detail.databaseFieldProperties.Version.click();
  await editor.detail.association.open();
  await editor.detail.cardinality.choose('One-to-One');
  await editor.detail.mappedBy.locator.fill('MappedByFieldName');
  await expect(editor.detail.databaseFieldProperties.ID).toBeDisabled();
  await expect(editor.detail.databaseFieldProperties.Generated).toBeDisabled();
  await expect(editor.detail.databaseFieldProperties['Not nullable']).toBeDisabled();
  await expect(editor.detail.databaseFieldProperties.Unique).toBeDisabled();
  await expect(editor.detail.databaseFieldProperties['Not updateable']).toBeDisabled();
  await expect(editor.detail.databaseFieldProperties['Not insertable']).toBeDisabled();
  await expect(editor.detail.databaseFieldProperties.Version).toBeDisabled();
});

test('association cascade', async () => {
  await editor.detail.classTypeCollapsible.open();
  await editor.detail.classTypeSelect.choose('Entity');
  await editor.table.row(0).locator.click();
  await editor.detail.entity.open();
  await editor.detail.association.open();

  await expect(editor.detail.cascadeTypes.All).toBeDisabled();
  await expect(editor.detail.cascadeTypes.Persist).toBeDisabled();
  await expect(editor.detail.cascadeTypes.Merge).toBeDisabled();
  await expect(editor.detail.cascadeTypes.Remove).toBeDisabled();
  await expect(editor.detail.cascadeTypes.Refresh).toBeDisabled();

  await editor.detail.cardinality.choose('One-to-One');
  await expect(editor.detail.cascadeTypes.All).toBeEnabled();
  await expect(editor.detail.cascadeTypes.Persist).toBeEnabled();
  await expect(editor.detail.cascadeTypes.Merge).toBeEnabled();
  await expect(editor.detail.cascadeTypes.Remove).toBeEnabled();
  await expect(editor.detail.cascadeTypes.Refresh).toBeEnabled();

  await editor.detail.cascadeTypes.All.click();
  await expect(editor.detail.cascadeTypes.All).toBeChecked();
  await expect(editor.detail.cascadeTypes.Persist).toBeChecked();
  await expect(editor.detail.cascadeTypes.Merge).toBeChecked();
  await expect(editor.detail.cascadeTypes.Remove).toBeChecked();
  await expect(editor.detail.cascadeTypes.Refresh).toBeChecked();

  await editor.detail.cascadeTypes.Merge.click();
  await expect(editor.detail.cascadeTypes.All).not.toBeChecked();
  await expect(editor.detail.cascadeTypes.Persist).toBeChecked();
  await expect(editor.detail.cascadeTypes.Merge).not.toBeChecked();
  await expect(editor.detail.cascadeTypes.Remove).toBeChecked();
  await expect(editor.detail.cascadeTypes.Refresh).toBeChecked();
});

test('association mapped by', async () => {
  await editor.detail.classTypeCollapsible.open();
  await editor.detail.classTypeSelect.choose('Entity');
  await editor.table.row(0).locator.click();
  await editor.detail.entity.open();
  await editor.detail.association.open();

  await expect(editor.detail.mappedBy.locator).toBeDisabled();

  await editor.detail.cardinality.choose('One-to-One');
  await expect(editor.detail.mappedBy.locator).toBeEnabled();
  await editor.detail.mappedBy.locator.fill('MappedByFieldName');

  await editor.detail.cardinality.choose('Many-to-One');
  await expect(editor.detail.mappedBy.locator).toBeDisabled();
  await expect(editor.detail.mappedBy.locator).toHaveValue('');

  await editor.detail.cardinality.choose('One-to-Many');
  await expect(editor.detail.mappedBy.locator).toBeEnabled();
  await expect(editor.detail.mappedBy.locator).toHaveValue('');
});

test('association remove orphans', async () => {
  await editor.detail.classTypeCollapsible.open();
  await editor.detail.classTypeSelect.choose('Entity');
  await editor.table.row(0).locator.click();
  await editor.detail.entity.open();
  await editor.detail.association.open();

  await expect(editor.detail.removeOrphans).toBeDisabled();

  await editor.detail.cardinality.choose('One-to-One');
  await expect(editor.detail.removeOrphans).toBeEnabled();
  await editor.detail.removeOrphans.click();

  await editor.detail.cardinality.choose('Many-to-One');
  await expect(editor.detail.removeOrphans).toBeDisabled();
  await expect(editor.detail.removeOrphans).not.toBeChecked();

  await editor.detail.cardinality.choose('One-to-Many');
  await expect(editor.detail.removeOrphans).toBeEnabled();
  await expect(editor.detail.removeOrphans).not.toBeChecked();
});
