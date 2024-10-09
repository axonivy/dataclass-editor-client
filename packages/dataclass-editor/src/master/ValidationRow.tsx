import { arraymove, MessageRow, ReorderRow, SelectRow, TableCell, type MessageData } from '@axonivy/ui-components';
import { flexRender, type Row } from '@tanstack/react-table';
import { useAppContext } from '../context/AppContext';
import type { DataClassField } from '../data/dataclass';
import './ValidationRow.css';
import { useValidation } from './useValidation';

export const useUpdateOrder = () => {
  const { dataClass, setDataClass } = useAppContext();
  return (moveId: string, targetId: string) => {
    const newDataClass = structuredClone(dataClass);
    arraymove(newDataClass.fields, parseInt(moveId), parseInt(targetId));
    setDataClass(newDataClass);
  };
};

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
  isReorderable: boolean;
};

export const ValidationRow = ({ row, isReorderable }: ValidationRowProps) => {
  const updateOrder = useUpdateOrder();
  const messages = useValidation(row.original);

  const RowComponent = isReorderable ? ReorderRow : SelectRow;

  return (
    <>
      <RowComponent id={row.index.toString()} row={row} className={rowClassName(messages)} updateOrder={updateOrder}>
        {row.getVisibleCells().map(cell => (
          <TableCell key={cell.id}>{flexRender(cell.column.columnDef.cell, cell.getContext())}</TableCell>
        ))}
      </RowComponent>
      {messages.map((message, index) => (
        <MessageRow key={index} columnCount={3} message={message} />
      ))}
    </>
  );
};
