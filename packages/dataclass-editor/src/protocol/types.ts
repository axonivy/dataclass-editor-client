import type { DataClass } from '../components/dataclass/data/dataclass';

export type Data = { context: DataContext; data: DataClass };
export type DataContext = { app: string; pmv: string; file: string };
export type EditorProps = { context: DataContext; directSave?: boolean };
export type SaveArgs = Data & { directSave?: boolean };
export interface DataClassActionArgs {
  actionId: 'openForm' | 'openProcess';
  payload: string;
  context: DataContext;
}

export interface RequestTypes {
  data: [DataContext, Data];
  saveData: [Data, String];
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
  saveData(saveArgs: SaveArgs): Promise<String>;

  action(action: DataClassActionArgs): void;

  onDataChanged: Event<void>;
}

export interface ClientContext {
  client: Client;
}
