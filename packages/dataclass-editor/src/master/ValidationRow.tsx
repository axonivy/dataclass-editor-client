import { MessageRow, ReorderRow, SelectRow, TableCell, type MessageData } from '@axonivy/ui-components';
import { flexRender, type Row } from '@tanstack/react-table';
import type { DataClassField } from '@axonivy/dataclass-editor-protocol';
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
  isReorderable: boolean;
  updateOrder: (moveId: string, targetId: string) => void;
  onClick: React.MouseEventHandler<HTMLTableRowElement>;
  onDrag: React.DragEventHandler<HTMLTableRowElement>;
};

export const ValidationRow = ({ row, isReorderable, updateOrder, onClick, onDrag }: ValidationRowProps) => {
  const messages = useValidation(row.original);

  const tableCell = row
    .getVisibleCells()
    .map(cell => <TableCell key={cell.id}>{flexRender(cell.column.columnDef.cell, cell.getContext())}</TableCell>);

  const commonProps = {
    id: row.index.toString(),
    row: row,
    className: rowClassName(messages),
    onClick: onClick,
    onDrag: onDrag
  };

  return (
    <>
      {isReorderable ? (
        <ReorderRow {...commonProps} updateOrder={updateOrder}>
          {tableCell}
        </ReorderRow>
      ) : (
        <SelectRow {...commonProps}>{tableCell}</SelectRow>
      )}
      {messages.map((message, index) => (
        <MessageRow key={index} columnCount={3} message={message} />
      ))}
    </>
  );
};
