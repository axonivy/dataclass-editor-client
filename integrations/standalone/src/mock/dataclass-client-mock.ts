import type {
  Client,
  Data,
  DataClassActionArgs,
  Event,
  FunctionRequestTypes,
  MetaRequestTypes,
  ValidationMessage
} from '@axonivy/dataclass-editor-protocol/src/types';
import { MetaMock } from './meta-mock';

export class DataClassClientMock implements Client {
  private dataClassData: Data = {
    context: { app: '', pmv: '', file: '' },
    data: {
      $schema: 'https://json-schema.axonivy.com/data-class/11.4.0/data-class.json',
      simpleName: 'Interview',
      namespace: 'workflow.businesscasedata',
      comment: 'Information about an interview.',
      annotations: ['@full.qualified.name.one(argument = "value")', '@full.qualified.name.two'],
      isBusinessCaseData: false,
      fields: [
        {
          name: 'firstName',
          type: 'String',
          modifiers: ['PERSISTENT'],
          comment: 'The first name of the interviewee.',
          annotations: []
        },
        {
          name: 'lastName',
          type: 'String',
          modifiers: ['PERSISTENT'],
          comment: 'The last name of the interviewee.',
          annotations: [
            '@javax.persistence.ManyToMany',
            '@javax.persistence.JoinTable(name = "tableName", joinColumns = { @JoinColumn(name = "name1Id", referencedColumnName = "id") }, inverseJoinColumns = { @JoinColumn(name = "tableNameId", referencedColumnName = "id") })'
          ]
        },
        {
          name: 'date',
          type: 'Date',
          modifiers: ['PERSISTENT'],
          comment: '',
          annotations: []
        },
        {
          name: 'conversation',
          type: 'mock.Conversation',
          modifiers: [],
          comment: 'Transcript of the conversation.',
          annotations: []
        }
      ]
    }
  };

  data(): Promise<Data> {
    return Promise.resolve(this.dataClassData);
  }

  saveData(saveData: Data): Promise<Array<ValidationMessage>> {
    this.dataClassData.data = saveData.data;
    return Promise.resolve([]);
  }

  validate(): Promise<Array<ValidationMessage>> {
    return Promise.resolve([]);
  }

  function<TFunct extends keyof FunctionRequestTypes>(path: TFunct): Promise<FunctionRequestTypes[TFunct][1]> {
    switch (path) {
      case 'function/combineFields':
        return Promise.resolve(this.dataClassData.data);
      default:
        throw Error('mock meta path not programmed');
    }
  }

  meta<TMeta extends keyof MetaRequestTypes>(path: TMeta): Promise<MetaRequestTypes[TMeta][1]> {
    switch (path) {
      case 'meta/scripting/ivyTypes':
        return Promise.resolve(MetaMock.IVYTYPES);
      case 'meta/scripting/dataClasses':
        return Promise.resolve(MetaMock.DATACLASSES);
      default:
        throw Error('mock meta path not programmed');
    }
  }

  action(action: DataClassActionArgs): void {
    console.log(action);
  }

  onDataChanged: Event<void>;
}
