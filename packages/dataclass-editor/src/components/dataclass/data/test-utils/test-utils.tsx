import type { RenderHookOptions } from '@testing-library/react';
import { renderHook } from '@testing-library/react';
import { type ReactNode } from 'react';
import { AppProvider } from '../../../../context/AppContext';
import type { DataClass } from '../dataclass';

type ContextHelperProps = {
  dataClass?: DataClass;
  setDataClass?: (dataclass: DataClass) => void;
  selectedField?: number;
  setSelectedField?: (index?: number) => void;
  detail?: boolean;
  setDetail?: (detail: boolean) => void;
};

const ContextHelper = (props: ContextHelperProps & { children: ReactNode }) => {
  const appContext = {
    dataClass: props.dataClass ?? ({} as DataClass),
    setDataClass: props.setDataClass ?? (() => {}),
    selectedField: props.selectedField,
    setSelectedField: props.setSelectedField ?? (() => {}),
    detail: props.detail !== undefined ? props.detail : true,
    setDetail: props.setDetail ?? (() => {})
  };

  return <AppProvider value={appContext}>{props.children}</AppProvider>;
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
