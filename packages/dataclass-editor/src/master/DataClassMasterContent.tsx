import {
  BasicField,
  Button,
  deleteFirstSelectedRow,
  Flex,
  selectRow,
  SelectRow,
  Separator,
  Table,
  TableBody,
  TableCell,
  TableResizableHeader,
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
  useReadonly,
  useTableSelect
} from '@axonivy/ui-components';
import { IvyIcons } from '@axonivy/ui-icons';
import { flexRender, getCoreRowModel, useReactTable, type ColumnDef } from '@tanstack/react-table';
import { useAppContext } from '../context/AppContext';
import { type DataClassField } from '../data/dataclass';
import { AddFieldDialog } from './AddFieldDialog';
import './DataClassMasterContent.css';

export const className = (qualifiedName: string) => {
  const lastDotIndex = qualifiedName.lastIndexOf('.');
  if (lastDotIndex === -1) {
    return qualifiedName;
  }
  return qualifiedName.substring(lastDotIndex + 1);
};

export const DataClassMasterContent = () => {
  const { dataClass, setDataClass, setSelectedField } = useAppContext();

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
      cell: cell => (
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <span className='cell-with-tooltip'>{className(cell.getValue())}</span>
            </TooltipTrigger>
            <TooltipContent>
              <span>{cell.getValue()}</span>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      )
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

  const deleteField = () => {
    const { newData: newFields, selection } = deleteFirstSelectedRow(table, dataClass.fields);
    const newDataClass = structuredClone(dataClass);
    newDataClass.fields = newFields;
    setDataClass(newDataClass);
    setSelectedField(selection);
  };

  const resetSelection = () => {
    selectRow(table);
    setSelectedField(undefined);
  };

  const readonly = useReadonly();
  const control = readonly ? null : (
    <Flex gap={2}>
      <AddFieldDialog table={table} />
      <Separator decorative orientation='vertical' style={{ height: '20px', margin: 0 }} />
      <Button
        key='deleteButton'
        icon={IvyIcons.Trash}
        onClick={deleteField}
        disabled={table.getSelectedRowModel().rows.length === 0}
        aria-label='Delete field'
      />
    </Flex>
  );

  return (
    <BasicField className='master-content' label='Attributes' control={control} onClick={resetSelection}>
      <Table>
        <TableResizableHeader headerGroups={table.getHeaderGroups()} />
        <TableBody>
          {table.getRowModel().rows.map(row => (
            <SelectRow
              key={row.id}
              row={row}
              onClick={event => {
                event.stopPropagation();
                setSelectedField(row.index);
              }}
            >
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
