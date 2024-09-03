import type { Locator, Page } from '@playwright/test';
import { expect } from '@playwright/test';

export class Table {
  private readonly page: Page;
  private readonly rows: Locator;
  private readonly columnTypes: Array<ColumnType>;

  constructor(page: Page, columnTypes: Array<ColumnType>) {
    this.page = page;
    this.rows = this.page.locator('tbody tr');
    this.columnTypes = columnTypes;
  }

  row(index: number) {
    return new Row(this.rows, index, this.columnTypes);
  }

  async expectRowCount(rows: number) {
    await expect(this.rows).toHaveCount(rows);
  }
}

export type ColumnType = 'label' | 'checkbox';

export class Row {
  private readonly locator: Locator;
  private readonly columnTypes: Array<ColumnType>;

  constructor(rowsLocator: Locator, index: number, columnTypes: Array<ColumnType>) {
    this.locator = rowsLocator.nth(index);
    this.columnTypes = columnTypes;
  }

  private column(column: number) {
    return new Cell(this.locator, column, this.columnTypes[column]);
  }

  async expectValues(...values: Array<string | boolean>) {
    for (let i = 0; i < this.columnTypes.length; i++) {
      await this.column(i).expectValue(values[i]);
    }
  }

  async click() {
    await this.locator.click();
  }
}

export class Cell {
  private readonly locator: Locator;
  private readonly columnType: ColumnType;

  constructor(rowLocator: Locator, index: number, columnType: ColumnType) {
    this.locator = rowLocator.getByRole('cell').nth(index);
    this.columnType = columnType;
  }

  async expectValue(value: string | boolean) {
    switch (this.columnType) {
      case 'checkbox':
        if (value) {
          await expect(this.locator).toBeChecked();
        } else {
          await expect(this.locator).not.toBeChecked();
        }
        break;
      default:
        if (typeof value !== 'string') {
          throw new Error('This cell is a label');
        }
        await expect(this.locator).toHaveText(value);
    }
  }
}
