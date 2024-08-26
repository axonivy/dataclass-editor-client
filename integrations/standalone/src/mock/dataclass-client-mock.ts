import type { Client, Data, Event } from '@axonivy/dataclass-editor/src/protocol/types';

export class DataClassClientMock implements Client {
  private dataClassData: Data = {
    context: { app: '', pmv: '', file: '' },
    data: `{
  "$schema" : "https://json-schema.axonivy.com/data-class/11.4.0/data-class.json",
  "simpleName" : "Data",
  "namespace" : "mock",
  "isBusinessCaseData" : false
}`
  };

  data(): Promise<Data> {
    return Promise.resolve(this.dataClassData);
  }

  saveData(saveData: Data): Promise<String> {
    this.dataClassData.data = saveData.data;
    return Promise.resolve('');
  }

  onDataChanged: Event<void>;
}
