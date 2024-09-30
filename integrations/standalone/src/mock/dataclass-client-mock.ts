import type { Client, Data, DataClassActionArgs, Event } from '@axonivy/dataclass-editor/src/protocol/types';

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

  saveData(saveData: Data): Promise<String> {
    this.dataClassData.data = saveData.data;
    return Promise.resolve('');
  }

  action(action: DataClassActionArgs): void {
    console.log(action);
  }

  onDataChanged: Event<void>;
}
