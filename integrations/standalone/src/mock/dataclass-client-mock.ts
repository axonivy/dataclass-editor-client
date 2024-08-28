import { DataClassFieldModifier } from '@axonivy/dataclass-editor';
import type { Client, Data, Event } from '@axonivy/dataclass-editor/src/protocol/types';

export class DataClassClientMock implements Client {
  private dataClassData: Data = {
    context: { app: '', pmv: '', file: '' },
    data: {
      $schema: 'https://json-schema.axonivy.com/data-class/11.4.0/data-class.json',
      simpleName: 'Interview',
      namespace: 'workflow.businesscasedata',
      comment: 'Information about an interview.',
      annotations: [],
      isBusinessCaseData: true,
      fields: [
        {
          name: 'firstName',
          type: 'String',
          modifiers: [DataClassFieldModifier.PERSISTENT],
          comment: 'The first name of the interviewee.',
          annotations: []
        },
        {
          name: 'lastName',
          type: 'String',
          modifiers: [DataClassFieldModifier.PERSISTENT],
          comment: 'The last name of the interviewee.',
          annotations: []
        },
        {
          name: 'date',
          type: 'Date',
          modifiers: [DataClassFieldModifier.PERSISTENT],
          comment: 'The date of the interview.',
          annotations: []
        },
        {
          name: 'conversation',
          type: 'String',
          modifiers: [DataClassFieldModifier.PERSISTENT],
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

  onDataChanged: Event<void>;
}
