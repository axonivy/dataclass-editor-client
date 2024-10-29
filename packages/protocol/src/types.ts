import type { DataClassEditorDataContext, ValidationMessage } from '.';
import type { DataClass } from './dataclass';
import type { DataActionArgs, DataClassCombineArgs, DataclassType, JavaType, TypeSearchRequest, ValidationResult } from './editor';

export type Data = { context: DataClassEditorDataContext; data: DataClass };
export type EditorProps = { context: DataClassEditorDataContext; directSave?: boolean };
export type SaveArgs = Data & { directSave?: boolean };

export { type ValidationResult as ValidationMessage };

export interface RequestTypes extends MetaRequestTypes, FunctionRequestTypes {
  data: [DataClassEditorDataContext, Data];
  saveData: [Data, Array<ValidationMessage>];
  validate: [DataClassEditorDataContext, Array<ValidationMessage>];
}

export interface NotificationTypes {
  action: DataActionArgs;
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
  data(context: DataClassEditorDataContext): Promise<Data>;
  saveData(saveArgs: SaveArgs): Promise<Array<ValidationMessage>>;
  validate(context: DataClassEditorDataContext): Promise<Array<ValidationMessage>>;

  meta<TMeta extends keyof MetaRequestTypes>(path: TMeta, args: MetaRequestTypes[TMeta][0]): Promise<MetaRequestTypes[TMeta][1]>;

  action(action: DataActionArgs): void;
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
  'meta/scripting/dataClasses': [DataClassEditorDataContext, DataclassType[]];
  'meta/scripting/ivyTypes': [void, JavaType[]];
  'meta/scripting/allTypes': [TypeSearchRequest, JavaType[]];
  'meta/scripting/ownTypes': [TypeSearchRequest, JavaType[]];
}

export interface FunctionRequestTypes {
  'function/combineFields': [DataClassCombineArgs, DataClass];
}
