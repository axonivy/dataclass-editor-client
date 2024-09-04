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

  async expectToHaveRowCount(rows: number) {
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

  async expectToHaveValues(...values: Array<string>) {
    for (let i = 0; i < values.length; i++) {
      await this.column(i).expectToHaveValue(values[i]);
    }
  }

  async click() {
    await this.locator.click();
  }

  async expectToBeSelected() {
    await expect(this.locator).toHaveAttribute('data-state', 'selected');
  }
}

export class Cell {
  private readonly locator: Locator;

  constructor(rowLocator: Locator, index: number) {
    this.locator = rowLocator.getByRole('cell').nth(index);
  }

  async expectToHaveValue(value: string) {
    await expect(this.locator).toHaveText(value);
  }
}
