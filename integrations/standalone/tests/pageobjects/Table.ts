import type { Locator, Page } from '@playwright/test';
import { expect } from '@playwright/test';

export class Table {
  readonly page: Page;
  readonly rows: Locator;
  readonly header: Locator;

  constructor(page: Page) {
    this.page = page;
    this.rows = this.page.locator('tbody tr');
    this.header = this.page.locator('.ui-table-header');
  }

  row(index: number) {
    return new Row(this.rows, index);
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
      await expect(this.column(i).locator).toHaveText(values[i]);
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
