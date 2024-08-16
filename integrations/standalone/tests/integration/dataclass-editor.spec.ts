import { test } from '@playwright/test';
import { DataClassEditor } from '../pageobjects/DataClassEditor';

test.describe('DataClassEditor', () => {
  let editor: DataClassEditor;

  test.beforeEach(async ({ page }) => {
    editor = await DataClassEditor.openEngine(page);
  });

  test('title', async () => {
    await editor.expectTitle('Data Class Editor');
  });
});
