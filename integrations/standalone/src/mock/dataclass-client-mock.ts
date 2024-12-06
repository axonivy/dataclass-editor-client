import type { DataActionArgs, DataClassData, FieldContext, ValidationResult } from '@axonivy/dataclass-editor-protocol/src/editor';
import type {
  Client,
  Event,
  FunctionRequestTypes,
  MappedByFieldsContext,
  MetaRequestTypes
} from '@axonivy/dataclass-editor-protocol/src/types';

export class DataClassClientMock implements Client {
  private dataClassData: DataClassData = {
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
        },
        {
          name: 'entity',
          type: 'mock.Entity',
          modifiers: ['PERSISTENT'],
          comment: 'An entity.',
          annotations: []
        },
        {
          name: 'entities',
          type: 'List<mock.Entity>',
          modifiers: ['PERSISTENT'],
          comment: 'A list of entities.',
          annotations: []
        }
      ]
    },
    helpUrl: 'https://dev.axonivy.com'
  };

  data(): Promise<DataClassData> {
    return Promise.resolve(this.dataClassData);
  }

  saveData(saveData: DataClassData): Promise<Array<ValidationResult>> {
    this.dataClassData.data = saveData.data;
    return Promise.resolve([]);
  }

  validate(): Promise<Array<ValidationResult>> {
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

  meta<TMeta extends keyof MetaRequestTypes>(path: TMeta, args: MetaRequestTypes[TMeta][0]): Promise<MetaRequestTypes[TMeta][1]> {
    switch (path) {
      case 'meta/scripting/ivyTypes':
        return Promise.resolve([]);
      case 'meta/scripting/dataClasses':
        return Promise.resolve([]);
      case 'meta/scripting/cardinalities': {
        return Promise.resolve(cardinalities(args as FieldContext));
      }
      case 'meta/scripting/mappedByFields': {
        return Promise.resolve(mappedByFields(args as MappedByFieldsContext));
      }
      default:
        throw Error('mock meta path not programmed');
    }
  }

  action(action: DataActionArgs): void {
    console.log(action);
  }

  onDataChanged: Event<void>;
}

const cardinalities = (context: FieldContext) => {
  const cardinalities = [];
  if (context.field.startsWith('entity')) {
    cardinalities.push('ONE_TO_ONE', 'MANY_TO_ONE');
  }
  if (context.field.startsWith('entities')) {
    cardinalities.push('ONE_TO_MANY');
  }
  return cardinalities;
};

const mappedByFields = (context: MappedByFieldsContext) => {
  const mappedByFields = [];
  if (context.cardinality === 'ONE_TO_ONE') {
    mappedByFields.push('MappedByFieldName');
  }
  return mappedByFields;
};
