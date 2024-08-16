import { expect, type Page } from '@playwright/test';

export class DataClassEditor {
  readonly page: Page;

  constructor(page: Page) {
    this.page = page;
  }

  static async openEngine(page: Page) {
    const server = process.env.BASE_URL ?? 'localhost:8081';
    const app = process.env.TEST_APP ?? 'designer';
    const serverUrl = server.replace(/^https?:\/\//, '');
    const pmv = 'dataclass-integration';
    const url = `?server=${serverUrl}&app=${app}&pmv=${pmv}&file=dataclass-integration/Data.d.json`;
    return this.openUrl(page, url);
  }

  static async openMock(page: Page) {
    return this.openUrl(page, '/mock.html');
  }

  private static async openUrl(page: Page, url: string) {
    const editor = new DataClassEditor(page);
    await page.goto(url);
    return editor;
  }

  async expectTitle(title: string) {
    await expect(this.page).toHaveTitle(title);
  }

  async takeScreenshot(fileName: string) {
    await this.hideQuery();
    const dir = process.env.SCREENSHOT_DIR ?? 'tests/screenshots/target';
    const buffer = await this.page.screenshot({ path: `${dir}/screenshots/${fileName}`, animations: 'disabled' });
    expect(buffer.byteLength).toBeGreaterThan(3000);
  }

  async hideQuery() {
    await this.page.addStyleTag({ content: `.tsqd-parent-container { display: none; }` });
  }
}
