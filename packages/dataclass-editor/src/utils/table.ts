import type { Table } from '@tanstack/react-table';

export const selectRow = <TData>(table: Table<TData>, rowId?: string) => {
  if (!rowId || rowId === '') {
    table.setRowSelection({});
  } else {
    table.setRowSelection({ [`${rowId}`]: true });
  }
};

/* workaround for "table.getIsSomeRowsSelected" as it returns false if only last remaining row is selected */
export const isRowSelected = <TData>(table: Table<TData>) => Object.keys(table.getState().rowSelection).length > 0;
