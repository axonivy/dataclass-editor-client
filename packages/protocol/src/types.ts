import type { DataContext, ValidationMessage } from '.';
import type { DataClass } from './dataclass';
import type {
  DataClassCombineArgs,
  DataClassEditorDataContext,
  DataclassType,
  JavaType,
  TypeSearchRequest,
  ValidationResult
} from './editor';

export { type DataClassEditorDataContext as DataContext };
export type Data = { context: DataContext; data: DataClass };
export type EditorProps = { context: DataContext; directSave?: boolean };
export type SaveArgs = Data & { directSave?: boolean };
export interface DataClassActionArgs {
  actionId: 'openForm' | 'openProcess';
  payload: string;
  context: DataContext;
}

export { type ValidationResult as ValidationMessage };

export interface RequestTypes extends MetaRequestTypes, FunctionRequestTypes {
  data: [DataContext, Data];
  saveData: [Data, Array<ValidationMessage>];
  validate: [DataContext, Array<ValidationMessage>];
}

export interface NotificationTypes {
  action: DataClassActionArgs;
}

export interface OnNotificationTypes {
  dataChanged: void;
}

export interface Event<T> {
  (listener: (e: T) => any, thisArgs?: any, disposables?: Disposable[]): Disposable;
}

export interface Disposable {
  dispose(): void;
}

export interface Client {
  data(context: DataContext): Promise<Data>;
  saveData(saveArgs: SaveArgs): Promise<Array<ValidationMessage>>;
  validate(context: DataContext): Promise<Array<ValidationMessage>>;

  meta<TMeta extends keyof MetaRequestTypes>(path: TMeta, args: MetaRequestTypes[TMeta][0]): Promise<MetaRequestTypes[TMeta][1]>;

  action(action: DataClassActionArgs): void;
  function<TFunct extends keyof FunctionRequestTypes>(
    path: TFunct,
    args: FunctionRequestTypes[TFunct][0]
  ): Promise<FunctionRequestTypes[TFunct][1]>;

  onDataChanged: Event<void>;
}

export interface ClientContext {
  client: Client;
}

export interface MetaRequestTypes {
  'meta/scripting/dataClasses': [DataContext, DataclassType[]];
  'meta/scripting/ivyTypes': [void, JavaType[]];
  'meta/scripting/allTypes': [TypeSearchRequest, JavaType[]];
  'meta/scripting/ownTypes': [TypeSearchRequest, JavaType[]];
}

export interface FunctionRequestTypes {
  'function/combineFields': [DataClassCombineArgs, DataClass];
}