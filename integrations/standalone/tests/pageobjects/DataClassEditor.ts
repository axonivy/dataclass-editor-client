import { expect, type Locator, type Page } from '@playwright/test';
import { randomUUID } from 'crypto';
import { AddFieldDialog } from './AddFieldDialog';
import { Button } from './Button';
import { Detail } from './Detail';
import { Settings } from './Settings';
import { Table } from './Table';

const server = process.env.BASE_URL ?? 'http://localhost:8081';
const ws = process.env.TEST_WS ?? '';
const app = process.env.TEST_APP ?? 'designer';
const pmv = 'dataclass-test-project';

export class DataClassEditor {
  readonly page: Page;
  readonly title: Locator;
  readonly detailPanel: Locator;
  readonly detailToggle: Button;
  readonly detail: Detail;
  readonly settings: Settings;
  readonly table: Table;
  readonly add: AddFieldDialog;
  readonly delete: Button;

  constructor(page: Page) {
    this.page = page;
    this.title = this.page.locator('.master-header');
    this.detailPanel = this.page.locator('.detail-panel');
    this.detailToggle = new Button(this.page, { name: 'Details toggle' });
    this.detail = new Detail(this.page);
    this.settings = new Settings(this.page);
    this.table = new Table(page);
    this.add = new AddFieldDialog(page);
    this.delete = new Button(page, { name: 'Delete field' });
  }

  static async openDataClass(page: Page, file: string) {
    const serverUrl = server.replace(/^https?:\/\//, '');
    const url = `?server=${serverUrl}${ws}&app=${app}&pmv=${pmv}&file=${file}`;
    return this.openUrl(page, url);
  }

  static async openNewDataClass(page: Page) {
    const name = 'DataClass' + randomUUID().replaceAll('-', '');
    const namespace = 'temp';
    const user = 'Developer';
    const result = await fetch(`${server}${ws}/api/web-ide/dataclass`, {
      method: 'POST',
      headers: {
        'X-Requested-By': 'dataclass-editor-tests',
        'Content-Type': 'application/json',
        Authorization: 'Basic ' + Buffer.from(user + ':' + user).toString('base64')
      },
      body: JSON.stringify({ name: namespace + '.' + name, project: { app, pmv } })
    });
    if (!result.ok) {
      throw Error(`Failed to create data class: ${result.status}`);
    }
    return await this.openDataClass(page, `dataclasses/${namespace}/${name}.d.json`);
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

  async deleteField(index: number) {
    this.table.row(index).locator.click();
    this.delete.locator.click();
  }
}
