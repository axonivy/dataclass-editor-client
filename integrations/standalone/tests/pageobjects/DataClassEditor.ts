import { expect, type Locator, type Page } from '@playwright/test';
import { AddFieldDialog } from './AddFieldDialog';
import { Button } from './Button';
import { Detail } from './Detail';
import { Settings } from './Settings';
import { Table } from './Table';

export class DataClassEditor {
  readonly page: Page;
  readonly detailPanel: Locator;
  readonly detailToggle: Button;
  readonly detail: Detail;
  readonly settings: Settings;
  readonly table: Table;
  readonly add: AddFieldDialog;

  constructor(page: Page) {
    this.page = page;
    this.detailPanel = this.page.locator('.detail-panel');
    this.detailToggle = new Button(this.page, { name: 'Details toggle' });
    this.detail = new Detail(this.page);
    this.settings = new Settings(this.page);
    this.table = new Table(page);
    this.add = new AddFieldDialog(page);
  }

  static async openEngine(page: Page, file: string) {
    const server = process.env.BASE_URL ?? 'localhost:8081';
    const app = process.env.TEST_APP ?? 'designer';
    const serverUrl = server.replace(/^https?:\/\//, '');
    const pmv = 'dataclass-integration';
    const url = `?server=${serverUrl}&app=${app}&pmv=${pmv}&file=${file}`;
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

  async takeScreenshot(fileName: string) {
    await this.hideQuery();
    const dir = process.env.SCREENSHOT_DIR ?? 'tests/screenshots/target';
    const buffer = await this.page.screenshot({ path: `${dir}/screenshots/${fileName}`, animations: 'disabled' });
    expect(buffer.byteLength).toBeGreaterThan(3000);
  }

  async hideQuery() {
    await this.page.addStyleTag({ content: `.tsqd-parent-container { display: none; }` });
  }

  async addField(name: string, type: string) {
    await this.add.open.locator.click();
    await this.add.name.locator.fill(name);
    await this.add.type.locator.fill(type);
    await this.add.create.locator.click();
  }
}
