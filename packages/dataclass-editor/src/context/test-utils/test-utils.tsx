/* eslint-disable @typescript-eslint/ban-ts-comment */
import type {
  DataClass,
  DataClassEditorDataContext,
  EntityClassField,
  EntityDataClass,
  Field,
  ValidationResult
} from '@axonivy/dataclass-editor-protocol';
import type { MessageData } from '@axonivy/ui-components';
import type { RenderHookOptions } from '@testing-library/react';
import { renderHook } from '@testing-library/react';
import { type ReactNode } from 'react';
import { AppProvider, EntityClassProvider } from '../AppContext';
import { EntityFieldProvider, FieldProvider } from '../FieldContext';

type ContextHelperProps = {
  appContext?: {
    context?: DataClassEditorDataContext;
    dataClass?: DataClass;
    setDataClass?: (dataclass: DataClass) => void;
    selectedField?: number;
    setSelectedField?: (index?: number) => void;
    detail?: boolean;
    setDetail?: (detail: boolean) => void;
    validations?: Array<ValidationResult>;
  };
  entityClassContext?: {
    entityClass?: EntityDataClass;
    setEntityClass?: (entityClass: EntityDataClass) => void;
  };
  fieldContext?: {
    field?: Field;
    setField?: (field: Field) => void;
    messages?: Record<string, MessageData>;
  };
  entityFieldContext?: {
    field?: EntityClassField;
    setField?: (field: EntityClassField) => void;
    messages?: Record<string, MessageData>;
  };
};

const ContextHelper = ({
  appContext,
  entityClassContext,
  fieldContext,
  entityFieldContext,
  children
}: ContextHelperProps & { children: ReactNode }) => {
  const dataClass = appContext?.dataClass ?? ({} as DataClass);

  const dContext = {
    context: appContext?.context ?? ({ file: '' } as DataClassEditorDataContext),
    dataClass,
    // @ts-ignore
    setDataClass: appContext?.setDataClass ? getData => appContext.setDataClass(getData(dataClass)) : () => {},
    selectedField: appContext?.selectedField,
    setSelectedField: appContext?.setSelectedField ?? (() => {}),
    detail: appContext?.detail !== undefined ? appContext.detail : true,
    setDetail: appContext?.setDetail ?? (() => {}),
    validations: appContext?.validations ?? [],
    history: { push: () => {}, undo: () => {}, redo: () => {}, canUndo: false, canRedo: false }
  };

  const entityClass = entityClassContext?.entityClass ?? ({} as EntityDataClass);

  const edContext = {
    entityClass,
    // @ts-ignore
    setEntityClass: entityClassContext?.setEntityClass ? getData => entityClassContext.setEntityClass(getData(entityClass)) : () => {}
  };

  const fContext = {
    field: fieldContext?.field ?? ({} as Field),
    setField: fieldContext?.setField ?? (() => {}),
    messages: fieldContext?.messages ?? {}
  };

  const efContext = {
    field: entityFieldContext?.field ?? ({} as EntityClassField),
    setField: entityFieldContext?.setField ?? (() => {}),
    messages: entityFieldContext?.messages ?? {}
  };

  return (
    <AppProvider value={dContext}>
      <EntityClassProvider value={edContext}>
        <FieldProvider value={fContext}>
          <EntityFieldProvider value={efContext}>{children}</EntityFieldProvider>
        </FieldProvider>
      </EntityClassProvider>
    </AppProvider>
  );
};

export const customRenderHook = <Result, Props>(
  render: (initialProps: Props) => Result,
  options?: RenderHookOptions<Props> & { wrapperProps: ContextHelperProps }
) => {
  return renderHook(render, {
    wrapper: props => <ContextHelper {...props} {...options?.wrapperProps} />,
    ...options
  });
};
