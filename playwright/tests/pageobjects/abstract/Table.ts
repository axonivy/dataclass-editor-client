import type { Locator } from '@playwright/test';
import { expect } from '@playwright/test';
import { Button } from './Button';

export class Table {
  readonly rows: Locator;
  readonly headers: Locator;

  constructor(parentLocator: Locator) {
    this.rows = parentLocator.locator('tbody tr');
    this.headers = parentLocator.locator('.ui-table-head');
  }

  row(index: number) {
    return new Row(this.rows, index);
  }

  async expectToHaveValues(...values: Array<Array<string>>) {
    await expect(this.rows).toHaveCount(values.length);
    for (let i = 0; i < values.length; i++) {
      await this.row(i).expectToHaveValues(...values[i]);
    }
  }

  header(index: number) {
    return new TableHeader(this.headers, index);
  }

  async unselect() {
    await this.header(0).locator.click();
  }

  async expectToBeReorderable() {
    for (let i = 0; i < (await this.rows.count()); i++) {
      await expect(this.row(i).locator).toHaveClass(/ui-dnd-row/);
    }
  }

  async expectToNotBeReorderable() {
    for (let i = 0; i < (await this.rows.count()); i++) {
      await expect(this.row(i).locator).not.toHaveClass(/ui-dnd-row/);
    }
  }
}

export class TableHeader {
  readonly locator: Locator;
  readonly sort: Button;

  constructor(headersLocator: Locator, index: number) {
    this.locator = headersLocator.nth(index);
    this.sort = new Button(this.locator);
  }
}

export class Row {
  readonly locator: Locator;

  constructor(rowsLocator: Locator, index: number) {
    this.locator = rowsLocator.nth(index);
  }

  column(column: number) {
    return new Cell(this.locator, column);
  }

  async expectToHaveValues(...values: Array<string>) {
    for (let i = 0; i < values.length; i++) {
      const column = this.column(i).locator;
      switch (await column.evaluate(element => element.firstElementChild?.tagName)) {
        case 'INPUT':
          await expect(column.locator('input')).toHaveValue(values[i]);
          break;
        default:
          await expect(column).toHaveText(values[i]);
          break;
      }
    }
  }

  async expectToBeSelected() {
    await expect(this.locator).toHaveAttribute('data-state', 'selected');
  }
}

export class Cell {
  readonly locator: Locator;

  constructor(rowLocator: Locator, index: number) {
    this.locator = rowLocator.getByRole('cell').nth(index);
  }
}
