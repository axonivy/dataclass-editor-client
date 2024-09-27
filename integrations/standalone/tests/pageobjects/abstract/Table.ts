import type { Locator } from '@playwright/test';
import { expect } from '@playwright/test';

export class Table {
  readonly rows: Locator;
  readonly header: Locator;

  constructor(parentLocator: Locator) {
    this.rows = parentLocator.locator('tbody tr');
    this.header = parentLocator.locator('.ui-table-header');
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
