import { type Field } from '@axonivy/dataclass-editor-protocol';
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
  useHotkeys,
  useMultiSelectRow,
  useReadonly,
  useTableKeyHandler,
  useTableSelect,
  useTableSort
} from '@axonivy/ui-components';
import { IvyIcons } from '@axonivy/ui-icons';
import { useQueryClient } from '@tanstack/react-query';
import { getCoreRowModel, useReactTable, type ColumnDef, type Row } from '@tanstack/react-table';
import { useRef } from 'react';
import { useAppContext } from '../context/AppContext';
import { useFunction } from '../context/useFunction';
import { useValidation } from '../context/useValidation';
import { variant } from '../data/validation-utils';
import { genQueryKey } from '../query/query-client';
import { useKnownHotkeys } from '../utils/hotkeys';
import { AddFieldDialog } from './AddFieldDialog';
import './DataClassMasterContent.css';
import { ValidationRow } from './ValidationRow';

const fullQualifiedClassNameRegex = /(?:[\w]+\.)+([\w]+)(?=[<,> ]|$)/g;

export const simpleTypeName = (fullQualifiedType: string) => {
  return fullQualifiedType.replace(fullQualifiedClassNameRegex, (_fullQualifiedClassName, className) => className);
};

export const DataClassMasterContent = () => {
  const { context, dataClass, setDataClass, setSelectedField, setDetail, detail } = useAppContext();
  const queryClient = useQueryClient();

  const validations = useValidation();

  const selection = useTableSelect<Field>({
    onSelect: selectedRows => {
      const selectedRowId = Object.keys(selectedRows).find(key => selectedRows[key]);
      const selectedRowCount = Object.values(selectedRows).filter(value => value === true).length;
      const selectedField = selectedRowCount === 1 ? table.getRowModel().flatRows.find(row => row.id === selectedRowId)?.index : undefined;
      setSelectedField(selectedField);
    }
  });
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
  const { handleMultiSelectOnRow } = useMultiSelectRow(table);

  const deleteField = () => {
    setDataClass(old => {
      const { newData: newFields } = deleteAllSelectedRows(table, old.fields);
      const newDataClass = structuredClone(old);
      newDataClass.fields = newFields;
      return newDataClass;
    });
  };

  const updateDataArray = (moveIndexes: number[], toIndex: number, data: Field[]) => {
    const newArray = arrayMoveMultiple(data, moveIndexes, toIndex);
    setDataClass(old => ({ ...old, fields: [...newArray] }));
  };

  const updateOrder = (moveId: string, targetId: string) => {
    const selectedRows = table.getSelectedRowModel().flatRows.map(r => r.original.name);
    const moveIds = selectedRows.length > 1 ? selectedRows : [dataClass.fields[parseInt(moveId)].name];
    const newDataClass = structuredClone(dataClass);
    const moveIndexes = moveIds.map(moveId => indexOf(newDataClass.fields, field => field.name === moveId));
    const toIndex = parseInt(targetId);
    updateDataArray(moveIndexes, toIndex, newDataClass.fields);
    resetAndSetRowSelection(table, newDataClass.fields, moveIds, row => row.name);
  };

  const { handleKeyDown } = useTableKeyHandler({
    table,
    data: dataClass.fields,
    options: { multiSelect: true, reorder: { updateOrder: updateDataArray, getRowId: row => row.name } }
  });

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
  const hotkeys = useKnownHotkeys();
  const isCombineSupported = context.app === 'designer';
  const control = readonly ? null : (
    <Flex gap={2}>
      <AddFieldDialog table={table} />
      <Separator decorative orientation='vertical' style={{ height: '20px', margin: 0 }} />
      <Button
        icon={IvyIcons.Trash}
        onClick={deleteField}
        disabled={table.getSelectedRowModel().rows.length === 0}
        aria-label={hotkeys.deleteAttr.label}
        title={hotkeys.deleteAttr.label}
      />

      {isCombineSupported && (
        <>
          <Separator decorative orientation='vertical' style={{ height: '20px', margin: 0 }} />
          <Button
            icon={IvyIcons.WrapToSubprocess}
            onClick={() => combineFields.mutate()}
            aria-label={hotkeys.combineAttr.label}
            title={hotkeys.combineAttr.label}
            disabled={table.getSelectedRowModel().rows.length === 0}
          />
        </>
      )}
    </Flex>
  );

  const ref = useHotkeys(
    [hotkeys.deleteAttr.hotkey, hotkeys.combineAttr.hotkey],
    (_, { hotkey }) => {
      if (hotkey === hotkeys.deleteAttr.hotkey) {
        deleteField();
      }
      if (hotkey === hotkeys.combineAttr.hotkey && isCombineSupported) {
        combineFields.mutate();
      }
    },
    { scopes: ['global'], enabled: !readonly }
  );
  const firstElement = useRef<HTMLDivElement>(null);
  useHotkeys(hotkeys.focusMain.hotkey, () => firstElement.current?.focus(), { scopes: ['global'] });

  return (
    <Flex direction='column' ref={ref} gap={4} className='master-content-container' onClick={() => selectRow(table)}>
      {validations.map((val, index) => (
        <Message key={index} variant={variant(val)}>
          {val.message}
        </Message>
      ))}
      <BasicField
        tabIndex={-1}
        ref={firstElement}
        className='master-content'
        label='Attributes'
        control={control}
        onClick={event => event.stopPropagation()}
      >
        <Table onKeyDown={e => handleKeyDown(e, () => setDetail(!detail))}>
          <TableResizableHeader headerGroups={table.getHeaderGroups()} onClick={() => selectRow(table)} />
          <TableBody>
            {table.getRowModel().rows.map(row => (
              <ValidationRow
                key={row.id}
                row={row}
                isReorderable={table.getState().sorting.length === 0 && !readonly}
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
