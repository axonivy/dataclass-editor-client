import { test } from '@playwright/test';
import { DataClassEditor } from '../pageobjects/DataClassEditor';

test.describe('DataClassEditor', () => {
  let editor: DataClassEditor;

  test.beforeEach(async ({ page }) => {
    editor = await DataClassEditor.openMock(page);
  });

  test('screenshot', async () => {
    await editor.takeScreenshot('dataclass-editor.png');
  });
});
