export type Data = { context: DataContext; data: string };
export type DataContext = { app: string; pmv: string; file: string };
export type EditorProps = { context: DataContext; directSave?: boolean };
export type SaveArgs = Data & { directSave?: boolean };

export interface RequestTypes {
  data: [DataContext, Data];
  saveData: [Data, String];
}

export interface NotificationTypes {
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
  onDataChanged: Event<void>;
}

export interface ClientContext {
  client: Client;
}
