import type { RenderHookOptions } from '@testing-library/react';
import { renderHook } from '@testing-library/react';
import { type ReactNode } from 'react';
import type { DataClass, DataClassField, EntityClass, EntityClassField } from '../../data/dataclass';
import type { DataContext } from '../../protocol/types';
import { AppProvider, EntityClassProvider } from '../AppContext';
import { EntityFieldProvider, FieldProvider } from '../FieldContext';

type ContextHelperProps = {
  appContext?: {
    context?: DataContext;
    dataClass?: DataClass;
    setDataClass?: (dataclass: DataClass) => void;
    selectedField?: number;
    setSelectedField?: (index?: number) => void;
    detail?: boolean;
    setDetail?: (detail: boolean) => void;
  };
  entityClassContext?: { entityClass?: EntityClass; setEntityClass?: (entityClass: EntityClass) => void };
  fieldContext?: { field?: DataClassField; setField?: (field: DataClassField) => void };
  entityFieldContext?: { field?: EntityClassField; setField?: (field: EntityClassField) => void };
};

const ContextHelper = (props: ContextHelperProps & { children: ReactNode }) => {
  const appContext = {
    context: props.appContext?.context ?? ({} as DataContext),
    dataClass: props.appContext?.dataClass ?? ({} as DataClass),
    setDataClass: props.appContext?.setDataClass ?? (() => {}),
    selectedField: props.appContext?.selectedField,
    setSelectedField: props.appContext?.setSelectedField ?? (() => {}),
    detail: props.appContext?.detail !== undefined ? props.appContext.detail : true,
    setDetail: props.appContext?.setDetail ?? (() => {})
  };

  const entityClassContext = {
    entityClass: props.entityClassContext?.entityClass ?? ({} as EntityClass),
    setEntityClass: props.entityClassContext?.setEntityClass ?? (() => {})
  };

  const fieldContext = {
    field: props.fieldContext?.field ?? ({} as DataClassField),
    setField: props.fieldContext?.setField ?? (() => {})
  };

  const entityFieldContext = {
    field: props.entityFieldContext?.field ?? ({} as EntityClassField),
    setField: props.entityFieldContext?.setField ?? (() => {})
  };

  return (
    <AppProvider value={appContext}>
      <EntityClassProvider value={entityClassContext}>
        <FieldProvider value={fieldContext}>
          <EntityFieldProvider value={entityFieldContext}>{props.children}</EntityFieldProvider>
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
