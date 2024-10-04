import { MessageRow, SelectRow, TableCell } from '@axonivy/ui-components';
import { flexRender, type Row } from '@tanstack/react-table';
import { useAppContext } from '../context/AppContext';
import type { DataClassField } from '../data/dataclass';
import type { ValidationMessage } from '../protocol/types';
import './ValidationRow.css';

export const validationMessagesOfRow = (validationMessages: Array<ValidationMessage>, field: DataClassField) => {
  return validationMessages.filter(message => message.path === field.name);
};

export const rowClassName = (validationMessages: Array<ValidationMessage>) => {
  if (validationMessages.some(message => message.severity === 'ERROR')) {
    return 'row-error';
  } else if (validationMessages.some(message => message.severity === 'WARNING')) {
    return 'row-warning';
  }
  return;
};

type ValidationRowProps = {
  row: Row<DataClassField>;
};

export const ValidationRow = ({ row }: ValidationRowProps) => {
  const { setSelectedField, validationMessages } = useAppContext();

  const messages = validationMessagesOfRow(validationMessages, row.original);

  return (
    <>
      <SelectRow row={row} onClick={() => setSelectedField(row.index)} className={rowClassName(messages)}>
        {row.getVisibleCells().map(cell => (
          <TableCell key={cell.id}>{flexRender(cell.column.columnDef.cell, cell.getContext())}</TableCell>
        ))}
      </SelectRow>
      {messages.map((message, index) => (
        <MessageRow key={index} columnCount={3} message={{ message: message.message, variant: message.severity.toLowerCase() }} />
      ))}
    </>
  );
};
