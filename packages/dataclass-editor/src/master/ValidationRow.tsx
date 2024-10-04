import { MessageRow, SelectRow, TableCell, type MessageData } from '@axonivy/ui-components';
import { flexRender, type Row } from '@tanstack/react-table';
import { useAppContext } from '../context/AppContext';
import type { DataClassField } from '../data/dataclass';
import './ValidationRow.css';
import { useValidation } from './useValidation';

export const rowClassName = (messages: Array<MessageData>) => {
  if (messages.some(message => message.variant === 'error')) {
    return 'row-error';
  } else if (messages.some(message => message.variant === 'warning')) {
    return 'row-warning';
  }
  return;
};

type ValidationRowProps = {
  row: Row<DataClassField>;
};

export const ValidationRow = ({ row }: ValidationRowProps) => {
  const { setSelectedField } = useAppContext();
  const messages = useValidation(row.original);

  return (
    <>
      <SelectRow row={row} onClick={() => setSelectedField(row.index)} className={rowClassName(messages)}>
        {row.getVisibleCells().map(cell => (
          <TableCell key={cell.id}>{flexRender(cell.column.columnDef.cell, cell.getContext())}</TableCell>
        ))}
      </SelectRow>
      {messages.map((message, index) => (
        <MessageRow key={index} columnCount={3} message={message} />
      ))}
    </>
  );
};
