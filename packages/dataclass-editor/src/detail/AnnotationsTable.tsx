import {
  addRow,
  ButtonGroup,
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
  deleteFirstSelectedRow,
  InputCell,
  SelectRow,
  Table,
  TableAddRow,
  TableBody,
  TableCell,
  updateRowData,
  useReadonly,
  useTableSelect,
  type CollapsibleControlProps
} from '@axonivy/ui-components';
import { IvyIcons } from '@axonivy/ui-icons';
import { flexRender, getCoreRowModel, useReactTable, type ColumnDef } from '@tanstack/react-table';

type AnnotationsTableProps = {
  annotations: Array<string>;
  setAnnotations: (annotations: Array<string>) => void;
};

export const AnnotationsTable = ({ annotations, setAnnotations }: AnnotationsTableProps) => {
  const selection = useTableSelect<string>();
  const columns: Array<ColumnDef<string, string>> = [
    {
      accessorFn: (value: string) => value,
      header: 'Annotation',
      cell: cell => <InputCell cell={cell} />
    }
  ];
  const table = useReactTable({
    ...selection.options,
    data: annotations,
    columns: columns,
    getCoreRowModel: getCoreRowModel(),
    state: {
      ...selection.tableState
    },
    meta: {
      updateData: (rowId: string, _columnId: string, value: string) => {
        const newAnnotations = updateRowData(annotations, Number(rowId), value);
        setAnnotations(newAnnotations);
      }
    }
  });

  const readonly = useReadonly();

  const deleteAnnotation = () => {
    const { newData: newAnnotations } = deleteFirstSelectedRow(table, annotations);
    setAnnotations(newAnnotations);
  };

  const addAnnotation = () => {
    const newAnnotations = addRow(table, annotations, '');
    setAnnotations(newAnnotations);
  };

  return (
    <Collapsible defaultOpen={annotations.length !== 0}>
      <CollapsibleTrigger
        control={(props: CollapsibleControlProps) =>
          !readonly && (
            <ButtonGroup
              {...props}
              controls={[
                {
                  title: 'Delete Annotation',
                  icon: IvyIcons.Trash,
                  disabled: table.getSelectedRowModel().rows.length === 0,
                  onClick: deleteAnnotation,
                  'aria-label': 'Delete annotation'
                }
              ]}
            />
          )
        }
      >
        Annotations
      </CollapsibleTrigger>
      <CollapsibleContent>
        <Table>
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
        {!readonly && <TableAddRow addRow={addAnnotation} />}
      </CollapsibleContent>
    </Collapsible>
  );
};
