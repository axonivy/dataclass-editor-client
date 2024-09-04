import {
  BasicField,
  Button,
  Flex,
  selectRow,
  SelectRow,
  Separator,
  Table,
  TableBody,
  TableCell,
  TableResizableHeader,
  useReadonly,
  useTableSelect
} from '@axonivy/ui-components';
import { IvyIcons } from '@axonivy/ui-icons';
import { flexRender, getCoreRowModel, useReactTable, type ColumnDef } from '@tanstack/react-table';
import { useAppContext } from '../../../context/AppContext';
import { type DataClassField } from '../data/dataclass';
import './DataClassMasterContent.css';

export const DataClassMasterContent = () => {
  const { dataClass, setSelectedField } = useAppContext();

  const selection = useTableSelect<DataClassField>();
  const columns: Array<ColumnDef<DataClassField, string>> = [
    {
      accessorKey: 'name',
      header: 'Name',
      cell: cell => <div>{cell.getValue()}</div>,
      minSize: 50
    },
    {
      accessorKey: 'type',
      header: 'Type',
      cell: cell => <div>{cell.getValue()}</div>
    },
    {
      accessorKey: 'comment',
      header: 'Comment',
      cell: cell => <div>{cell.getValue()}</div>
    }
  ];
  const table = useReactTable({
    ...selection.options,
    data: dataClass.fields,
    columns,
    getCoreRowModel: getCoreRowModel(),
    state: {
      ...selection.tableState
    }
  });

  const resetSelection = () => {
    selectRow(table);
    setSelectedField(undefined);
  };

  const readonly = useReadonly();
  const control = readonly ? null : (
    <Flex gap={2}>
      <Button key='addButton' icon={IvyIcons.Plus} onClick={() => {}} aria-label='Add data class field' />
      <Separator decorative orientation='vertical' style={{ height: '20px', margin: 0 }} />
      <Button
        key='deleteButton'
        icon={IvyIcons.Trash}
        onClick={() => {}}
        disabled={table.getSelectedRowModel().rows.length === 0}
        aria-label='Delete data class field'
      />
    </Flex>
  );

  return (
    <BasicField className='master-content' label='Attributes' control={control}>
      <Table>
        <TableResizableHeader headerGroups={table.getHeaderGroups()} onClick={resetSelection} />
        <TableBody>
          {table.getRowModel().rows.map(row => (
            <SelectRow key={row.id} row={row} onClick={() => setSelectedField(row.index)}>
              {row.getVisibleCells().map(cell => (
                <TableCell key={cell.id}>{flexRender(cell.column.columnDef.cell, cell.getContext())}</TableCell>
              ))}
            </SelectRow>
          ))}
        </TableBody>
      </Table>
    </BasicField>
  );
};
