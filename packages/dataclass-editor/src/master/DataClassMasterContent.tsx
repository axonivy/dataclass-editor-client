import {
  arrayMoveMultiple,
  BasicField,
  Button,
  deleteAllSelectedRows,
  Flex,
  indexOf,
  Message,
  ReorderHandleWrapper,
  resetAndSetRowSelection,
  selectRow,
  Separator,
  SortableHeader,
  Table,
  TableBody,
  TableResizableHeader,
  toast,
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
  useMultiSelectRow,
  useReadonly,
  useTableSelect,
  useTableSort
} from '@axonivy/ui-components';
import { IvyIcons } from '@axonivy/ui-icons';
import { getCoreRowModel, useReactTable, type ColumnDef, type Row, type Table as TanstackTable } from '@tanstack/react-table';
import { useEffect } from 'react';
import { useAppContext } from '../context/AppContext';
import { type Field } from '@axonivy/dataclass-editor-protocol';
import { AddFieldDialog } from './AddFieldDialog';
import './DataClassMasterContent.css';
import { ValidationRow } from './ValidationRow';
import { useValidation } from './useValidation';
import { useQueryClient } from '@tanstack/react-query';
import { genQueryKey } from '../query/query-client';
import { useFunction } from '../context/useFunction';

const fullQualifiedClassNameRegex = /(?:[\w]+\.)+([\w]+)(?=[<,> ]|$)/g;

export const simpleTypeName = (fullQualifiedType: string) => {
  return fullQualifiedType.replace(fullQualifiedClassNameRegex, (_fullQualifiedClassName, className) => className);
};

export const useUpdateSelection = (table: TanstackTable<Field>) => {
  const { setSelectedField } = useAppContext();
  const selectedRows = table.getSelectedRowModel().rows;
  const selectedField = selectedRows.length === 1 ? selectedRows[0].index : undefined;
  useEffect(() => {
    setSelectedField(selectedField);
  }, [selectedField, setSelectedField]);
};

export const DataClassMasterContent = () => {
  const { context, dataClass, setDataClass, setSelectedField } = useAppContext();
  const queryClient = useQueryClient();

  const messages = useValidation();

  const selection = useTableSelect<Field>();
  const sort = useTableSort();
  const columns: Array<ColumnDef<Field, string>> = [
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
  const table = useReactTable({
    ...selection.options,
    enableMultiRowSelection: true,
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
  const { handleMultiSelectOnRow } = useMultiSelectRow(table);

  const deleteField = () => {
    const { newData: newFields, selection } = deleteAllSelectedRows(table, dataClass.fields);
    const newDataClass = structuredClone(dataClass);
    newDataClass.fields = newFields;
    setDataClass(newDataClass);
    setSelectedField(selection);
  };

  const updateOrder = (moveId: string, targetId: string) => {
    const selectedRows = table.getSelectedRowModel().flatRows.map(r => r.original.name);
    const moveIds = selectedRows.length > 1 ? selectedRows : [dataClass.fields[parseInt(moveId)].name];
    const newDataClass = structuredClone(dataClass);
    const moveIndexes = moveIds.map(moveId => indexOf(newDataClass.fields, field => field.name === moveId));
    const toIndex = parseInt(targetId);
    arrayMoveMultiple(newDataClass.fields, moveIndexes, toIndex);

    setDataClass(newDataClass);
    resetAndSetRowSelection(table, newDataClass.fields, moveIds, row => row.name);
  };

  const isSameFields = (data: Field[]) => {
    if (data.length !== dataClass.fields.length) {
      return false;
    }
    for (let i = 0; i < data.length; i++) {
      if (data[i].type !== dataClass.fields[i].type) {
        return false;
      }
    }
    return true;
  };

  const combineFields = useFunction(
    'function/combineFields',
    {
      context,
      fieldNames: table.getSelectedRowModel().rows.map(row => row.original.name)
    },
    {
      onSuccess: data => {
        if (!isSameFields(data.fields)) {
          toast.info('Fields successfully combined');
          queryClient.invalidateQueries({ queryKey: genQueryKey('data', context) });
        }
      },
      onError: error => {
        toast.error('Failed to combine attributes', { description: error.message });
      }
    }
  );
  const handleRowDrag = (row: Row<Field>) => {
    if (!row.getIsSelected()) {
      table.resetRowSelection();
    }
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

      {context.app === 'designer' && (
        <>
          <Separator decorative orientation='vertical' style={{ height: '20px', margin: 0 }} />
          <Button
            key='combineButton'
            icon={IvyIcons.WrapToSubprocess}
            onClick={() => combineFields.mutate()}
            aria-label='Combine attributes'
            title='Combine attributes'
            disabled={table.getSelectedRowModel().rows.length === 0}
          />
        </>
      )}
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
                isReorderable={table.getState().sorting.length === 0}
                onDrag={() => handleRowDrag(row)}
                onClick={event => handleMultiSelectOnRow(row, event)}
                updateOrder={updateOrder}
              />
            ))}
          </TableBody>
        </Table>
      </BasicField>
    </Flex>
  );
};
