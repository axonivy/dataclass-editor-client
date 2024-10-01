import { expect, test } from '@playwright/test';
import { DataClassEditor } from '../pageobjects/DataClassEditor';

let editor: DataClassEditor;

test.beforeEach(async ({ page }) => {
  editor = await DataClassEditor.openMock(page);
});

test('cascade', async () => {
  const association = editor.detail.field.entity.association;

  await editor.detail.dataClass.general.classType.fillValues('Entity');
  await editor.table.row(0).locator.click();
  await editor.detail.field.entity.accordion.open();
  await association.collapsible.open();

  await association.expectCascadeTypesToBeDisabled();

  await association.cardinality.choose('One-to-One');

  await association.expectCascadeTypesToBeEnabled();

  await association.cascadeTypes.All.click();
  await association.expectCascadeTypesToHaveCheckedState({
    All: true,
    Persist: true,
    Merge: true,
    Remove: true,
    Refresh: true
  });

  await association.cascadeTypes.Merge.click();
  await association.expectCascadeTypesToHaveCheckedState({
    All: false,
    Persist: true,
    Merge: false,
    Remove: true,
    Refresh: true
  });
});

test('mapped by', async () => {
  const mappedBy = editor.detail.field.entity.association.mappedBy;

  await editor.detail.dataClass.general.classType.fillValues('Entity');
  await editor.table.row(0).locator.click();
  await editor.detail.field.entity.accordion.open();
  await editor.detail.field.entity.association.collapsible.open();

  await expect(mappedBy.locator).toBeDisabled();

  await editor.detail.field.entity.association.cardinality.choose('One-to-One');

  await expect(mappedBy.locator).toBeEnabled();

  await editor.detail.field.entity.association.cardinality.choose('Many-to-One');

  await expect(mappedBy.locator).toBeDisabled();

  await editor.detail.field.entity.association.cardinality.choose('One-to-Many');

  await expect(mappedBy.locator).toBeEnabled();
});

test('remove orphans', async () => {
  const removeOrphans = editor.detail.field.entity.association.removeOrphans;

  await editor.detail.dataClass.general.classType.fillValues('Entity');
  await editor.table.row(0).locator.click();
  await editor.detail.field.entity.accordion.open();
  await editor.detail.field.entity.association.collapsible.open();

  await expect(removeOrphans).toBeDisabled();

  await editor.detail.field.entity.association.cardinality.choose('One-to-One');

  await expect(removeOrphans).toBeEnabled();

  await editor.detail.field.entity.association.cardinality.choose('Many-to-One');

  await expect(removeOrphans).toBeDisabled();

  await editor.detail.field.entity.association.cardinality.choose('One-to-Many');

  await expect(removeOrphans).toBeEnabled();
});