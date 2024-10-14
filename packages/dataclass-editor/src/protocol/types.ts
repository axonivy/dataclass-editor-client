import type { DataClass } from '../data/dataclass';

export type Data = { context: DataContext; data: DataClass };
export type DataContext = { app: string; pmv: string; file: string };
export type EditorProps = { context: DataContext; directSave?: boolean };
export type SaveArgs = Data & { directSave?: boolean };
export interface DataClassActionArgs {
  actionId: 'openForm' | 'openProcess';
  payload: string;
  context: DataContext;
}

export type ValidationMessage = { message: string; path: string; severity: Severity };
export type Severity = 'INFO' | 'WARNING' | 'ERROR';

export interface RequestTypes extends MetaRequestTypes {
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

export interface TypeSearchRequest {
  context: DataContext;
  limit: number;
  type: string;
}

export interface JavaType {
  fullQualifiedName: string;
  packageName: string;
  simpleName: string;
}

export interface DataclassType {
  fullQualifiedName: string;
  name: string;
  packageName: string;
  path: string;
}
