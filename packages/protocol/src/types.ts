import type { DataClassEditorDataContext } from '.';
import type { DataClass } from './dataclass';
import type {
  DataActionArgs,
  DataClassCombineArgs,
  DataClassData,
  DataClassSaveDataArgs,
  DataclassType,
  EntityClassFieldAssociation,
  FieldContext,
  JavaType,
  TypeSearchRequest,
  ValidationResult
} from './editor';

export type EditorProps = { context: DataClassEditorDataContext; directSave?: boolean };
export type SaveArgs = DataClassSaveDataArgs & { directSave?: boolean };

export interface RequestTypes extends MetaRequestTypes, FunctionRequestTypes {
  data: [DataClassEditorDataContext, DataClassData];
  saveData: [DataClassData, Array<ValidationResult>];
  validate: [DataClassEditorDataContext, Array<ValidationResult>];
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
  data(context: DataClassEditorDataContext): Promise<DataClassData>;
  saveData(saveArgs: SaveArgs): Promise<Array<ValidationResult>>;
  validate(context: DataClassEditorDataContext): Promise<Array<ValidationResult>>;

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

export type MappedByFieldsContext = FieldContext & { cardinality?: string };

export interface MetaRequestTypes {
  'meta/scripting/dataClasses': [DataClassEditorDataContext, Array<DataclassType>];
  'meta/scripting/ivyTypes': [void, Array<JavaType>];
  'meta/scripting/allTypes': [TypeSearchRequest, Array<JavaType>];
  'meta/scripting/ownTypes': [TypeSearchRequest, Array<JavaType>];
  'meta/scripting/cardinalities': [FieldContext, Array<EntityClassFieldAssociation>];
  'meta/scripting/mappedByFields': [MappedByFieldsContext, Array<string>];
}

export interface FunctionRequestTypes {
  'function/combineFields': [DataClassCombineArgs, DataClass];
}
