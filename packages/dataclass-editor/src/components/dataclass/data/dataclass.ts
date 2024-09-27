export interface DataClass {
  $schema: string;
  simpleName: string;
  namespace: string;
  comment: string;
  annotations: Array<string>;
  isBusinessCaseData: boolean;
  entity?: DataClassEntity;
  fields: Array<DataClassField>;
}

export interface DataClassEntity {
  tableName: string;
}

export interface DataClassField {
  name: string;
  type: string;
  comment: string;
  modifiers: Array<DataClassFieldModifier>;
  annotations: Array<string>;
  entity?: DataClassFieldEntity;
}

export interface DataClassFieldEntity {
  databaseName: string;
  databaseFieldLength: string;
  association?: DataClassFieldEntityAssociation;
  cascadeTypes: Array<DataClassFieldEntityCascadeType>;
  mappedByFieldName: string;
  orphanRemoval: boolean;
}

export type DataClassFieldModifier =
  | 'PERSISTENT'
  | 'ID'
  | 'GENERATED'
  | 'NOT_NULLABLE'
  | 'UNIQUE'
  | 'NOT_UPDATEABLE'
  | 'NOT_INSERTABLE'
  | 'VERSION';

export type DataClassFieldEntityAssociation = 'ONE_TO_ONE' | 'ONE_TO_MANY' | 'MANY_TO_ONE';

export const DATA_CLASS_FIELD_TYPE_DATABASE_LENGTHS = {
  String: '255',
  BigInteger: '19,2',
  BigDecimal: '19,2'
} as const;
export type DataClassFieldLengthType = keyof typeof DATA_CLASS_FIELD_TYPE_DATABASE_LENGTHS;

export const DATA_CLASS_FIELD_ENTITY_CASCADE_TYPES = ['PERSIST', 'MERGE', 'REMOVE', 'REFRESH'] as const;
export type DataClassFieldEntityCascadeType = (typeof DATA_CLASS_FIELD_ENTITY_CASCADE_TYPES)[number] | 'ALL';

export const DATA_CLASS_FIELD_ID_TYPES = ['String', 'Integer', 'Long'] as const;
export type DataClassFieldIDType = (typeof DATA_CLASS_FIELD_ID_TYPES)[number];

export const DATA_CLASS_FIELD_VERSION_TYPES = ['Short', 'Integer', 'Long', 'java.sql.Timestamp'] as const;
export type DataClassFieldVersionType = (typeof DATA_CLASS_FIELD_VERSION_TYPES)[number];
