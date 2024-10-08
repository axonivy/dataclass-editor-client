import {
  BasicField,
  Button,
  deleteFirstSelectedRow,
  Flex,
  Message,
  selectRow,
  Separator,
  Table,
  TableBody,
  TableResizableHeader,
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
  useReadonly,
  useTableSelect
} from '@axonivy/ui-components';
import { IvyIcons } from '@axonivy/ui-icons';
import { getCoreRowModel, useReactTable, type ColumnDef } from '@tanstack/react-table';
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

export const DataClassMasterContent = () => {
  const { dataClass, setDataClass, setSelectedField } = useAppContext();
  const messages = useValidation();

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
    <Flex direction='column' gap={4} className='master-content-container' onClick={resetSelection}>
      {messages.map((message, index) => (
        <Message key={index} variant={message.variant}>
          {message.message}
        </Message>
      ))}
      <BasicField className='master-content' label='Attributes' control={control} onClick={event => event.stopPropagation()}>
        <Table>
          <TableResizableHeader headerGroups={table.getHeaderGroups()} onClick={resetSelection} />
          <TableBody>
            {table.getRowModel().rows.map(row => (
              <ValidationRow key={row.id} row={row} />
            ))}
          </TableBody>
        </Table>
      </BasicField>
    </Flex>
  );
};
