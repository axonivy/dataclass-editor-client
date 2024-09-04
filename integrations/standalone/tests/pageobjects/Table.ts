import type { Locator, Page } from '@playwright/test';
import { expect } from '@playwright/test';

export class Table {
  private readonly page: Page;
  private readonly rows: Locator;

  constructor(page: Page) {
    this.page = page;
    this.rows = this.page.locator('tbody tr');
  }

  row(index: number) {
    return new Row(this.rows, index);
  }

  async expectRowCount(rows: number) {
    await expect(this.rows).toHaveCount(rows);
  }
}

export class Row {
  private readonly locator: Locator;

  constructor(rowsLocator: Locator, index: number) {
    this.locator = rowsLocator.nth(index);
  }

  private column(column: number) {
    return new Cell(this.locator, column);
  }

  async expectValues(...values: Array<string>) {
    for (let i = 0; i < values.length; i++) {
      await this.column(i).expectValue(values[i]);
    }
  }

  async click() {
    await this.locator.click();
  }
}

export class Cell {
  private readonly locator: Locator;

  constructor(rowLocator: Locator, index: number) {
    this.locator = rowLocator.getByRole('cell').nth(index);
  }

  async expectValue(value: string) {
    await expect(this.locator).toHaveText(value);
  }
}
