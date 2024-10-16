import {
  BasicField,
  Button,
  deleteFirstSelectedRow,
  Flex,
  Message,
  ReorderHandleWrapper,
  selectRow,
  Separator,
  SortableHeader,
  Table,
  TableBody,
  TableResizableHeader,
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
  useReadonly,
  useTableSelect,
  useTableSort
} from '@axonivy/ui-components';
import { IvyIcons } from '@axonivy/ui-icons';
import { getCoreRowModel, useReactTable, type ColumnDef, type Table as TanstackTable } from '@tanstack/react-table';
import { useEffect, useState } from 'react';
import { useAppContext } from '../context/AppContext';
import { type DataClassField } from '../data/dataclass';
import { AddFieldDialog } from './AddFieldDialog';
import './DataClassMasterContent.css';
import { ValidationRow } from './ValidationRow';
import { useValidation } from './useValidation';

const fullQualifiedClassNameRegex = /(?:[\w]+\.)+([\w]+)(?=[<,> ]|$)/g;

export const simpleTypeName = (fullQualifiedType: string) => {
  return fullQualifiedType.replace(fullQualifiedClassNameRegex, (_fullQualifiedClassName, className) => className);
};

export const useUpdateSelection = (table: TanstackTable<DataClassField>) => {
  const { setSelectedField } = useAppContext();
  const selectedRows = table.getSelectedRowModel().rows;
  const selectedField = selectedRows.length === 1 ? selectedRows[0].index : undefined;
  useEffect(() => {
    setSelectedField(selectedField);
  }, [selectedField, setSelectedField]);
};

export const DataClassMasterContent = () => {
  const { dataClass, setDataClass, setSelectedField, setFieldsToCombine } = useAppContext();
  const messages = useValidation();

  const selection = useTableSelect<DataClassField>();
  const sort = useTableSort();
  const columns: Array<ColumnDef<DataClassField, string>> = [
    {
      accessorKey: 'name',
      header: ({ column }) => <SortableHeader column={column} name='Name' />,
      cell: cell => <div>{cell.getValue()}</div>,
      minSize: 50
    },
    {
      accessorKey: 'type',
      header: ({ column }) => <SortableHeader column={column} name='Type' />,
      cell: cell => (
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <span className='cell-with-tooltip'>{simpleTypeName(cell.getValue())}</span>
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
      header: ({ column }) => <SortableHeader column={column} name='Comment' />,
      cell: cell => (
        <ReorderHandleWrapper>
          <div>{cell.getValue()}</div>
        </ReorderHandleWrapper>
      )
    }
  ];
  const [multiSelect, setMultiSelect] = useState(false);
  const table = useReactTable({
    ...selection.options,
    enableMultiRowSelection: multiSelect,
    ...sort.options,
    data: dataClass.fields,
    columns,
    getCoreRowModel: getCoreRowModel(),
    state: {
      ...selection.tableState,
      ...sort.tableState
    }
  });
  useUpdateSelection(table);

  const deleteField = () => {
    const { newData: newFields, selection } = deleteFirstSelectedRow(table, dataClass.fields);
    const newDataClass = structuredClone(dataClass);
    newDataClass.fields = newFields;
    setDataClass(newDataClass);
    setSelectedField(selection);
  };

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      const isCtrlOrCmdPressed = event.ctrlKey || event.metaKey;
      const hasSelection = Object.keys(table.getState().rowSelection).length > 0;

      if (isCtrlOrCmdPressed && hasSelection) {
        setMultiSelect(true);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', () => setMultiSelect(false));

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', () => setMultiSelect(false));
    };
  }, [table]);

  const readonly = useReadonly();
  const control = readonly ? null : (
    <Flex gap={2}>
      {table.getSelectedRowModel().rows.length > 1 && (
        <>
          <Button
            key='combineButton'
            icon={IvyIcons.WrapToSubprocess}
            onClick={() => {
              const selectedRows = table.getSelectedRowModel().rows;
              const originalData = selectedRows.map(row => row.original);
              setFieldsToCombine(originalData);
            }}
            aria-label='Combine fields'
            title='Combine fields'
          />
          <Separator decorative orientation='vertical' style={{ height: '20px', margin: 0 }} />
        </>
      )}
      <AddFieldDialog table={table} />
      <Separator decorative orientation='vertical' style={{ height: '20px', margin: 0 }} />
      <Button
        key='deleteButton'
        icon={IvyIcons.Trash}
        onClick={deleteField}
        disabled={table.getSelectedRowModel().rows.length === 0 || table.getSelectedRowModel().rows.length > 1}
        aria-label='Delete field'
      />
    </Flex>
  );

  return (
    <Flex direction='column' gap={4} className='master-content-container' onClick={() => selectRow(table)}>
      {messages.map((message, index) => (
        <Message key={index} variant={message.variant}>
          {message.message}
        </Message>
      ))}
      <BasicField className='master-content' label='Attributes' control={control} onClick={event => event.stopPropagation()}>
        <Table>
          <TableResizableHeader headerGroups={table.getHeaderGroups()} onClick={() => selectRow(table)} />
          <TableBody>
            {table.getRowModel().rows.map(row => (
              <ValidationRow
                key={row.id}
                row={row}
                isReorderable={table.getState().sorting.length === 0 && table.getSelectedRowModel().rows.length <= 1}
              />
            ))}
          </TableBody>
        </Table>
      </BasicField>
    </Flex>
  );
};
