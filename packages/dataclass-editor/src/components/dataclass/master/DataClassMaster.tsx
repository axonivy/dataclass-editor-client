import {
  BasicField,
  Button,
  SelectRow,
  Table,
  TableBody,
  TableCell,
  TableResizableHeader,
  useReadonly,
  useTableSelect
} from '@axonivy/ui-components';
import { IvyIcons } from '@axonivy/ui-icons';
import { flexRender, getCoreRowModel, useReactTable, type ColumnDef } from '@tanstack/react-table';
import { isRowSelected, selectRow } from '../../../utils/table';
import { Control } from '../../control/Control';
import {
  dataClassFieldCommentAttribute,
  dataClassFieldNameAttribute,
  dataClassFieldTypeAttribute,
  type DataClassField
} from '../data/dataclass';
import { isPersistent } from '../data/dataclass-field-utils';
import './DataClassMaster.css';

type DataClassMasterProps = {
  dataClassFields: Array<DataClassField>;
};

export const DataClassMaster = ({ dataClassFields }: DataClassMasterProps) => {
  const selection = useTableSelect<DataClassField>();
  const columns: Array<ColumnDef<DataClassField, string>> = [
    {
      accessorKey: dataClassFieldNameAttribute,
      header: 'Name',
      cell: cell => <div>{cell.getValue()}</div>,
      minSize: 50
    },
    {
      accessorKey: dataClassFieldTypeAttribute,
      header: 'Type',
      cell: cell => <div>{cell.getValue()}</div>
    },
    {
      accessorFn: (dataClassField: DataClassField) => String(isPersistent(dataClassField)),
      header: 'Persistent',
      cell: cell => <div>{cell.getValue()}</div>
    },
    {
      accessorKey: dataClassFieldCommentAttribute,
      header: 'Comment',
      cell: cell => <div>{cell.getValue()}</div>
    }
  ];
  const table = useReactTable({
    ...selection.options,
    data: dataClassFields,
    columns,
    getCoreRowModel: getCoreRowModel(),
    state: {
      ...selection.tableState
    }
  });

  const resetSelection = () => {
    selectRow(table);
  };

  const readonly = useReadonly();
  const controls = [];
  if (!readonly) {
    controls.push(
      <Button key='addButton' icon={IvyIcons.Plus} onClick={() => {}} aria-label='Add data class field' />,
      <Button
        key='deleteButton'
        icon={IvyIcons.Trash}
        onClick={() => {}}
        disabled={!isRowSelected(table)}
        aria-label='Delete data class field'
      />
    );
  }

  return (
    <>
      <BasicField className='dataclass-wrapper' label='Attributes' control={<Control buttons={controls} />}>
        <Table>
          <TableResizableHeader headerGroups={table.getHeaderGroups()} onClick={resetSelection} />
          <TableBody>
            {table.getRowModel().rows.map(row => (
              <SelectRow key={row.id} row={row}>
                {row.getVisibleCells().map(cell => (
                  <TableCell key={cell.id}>{flexRender(cell.column.columnDef.cell, cell.getContext())}</TableCell>
                ))}
              </SelectRow>
            ))}
          </TableBody>
        </Table>
      </BasicField>
    </>
  );
};
