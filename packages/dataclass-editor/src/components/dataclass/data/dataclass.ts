export const dataClassFieldNameAttribute = 'name';
export const dataClassFieldTypeAttribute = 'type';
export const dataClassFieldCommentAttribute = 'comment';

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

export enum DataClassFieldModifier {
  PERSISTENT,
  ID,
  GENERATED,
  NOT_NULLABLE,
  UNIQUE,
  NOT_UPDATEABLE,
  NOT_INSERTABLE,
  VERSION
}

export enum DataClassFieldEntityAssociation {
  ONE_TO_ONE,
  ONE_TO_MANY,
  MANY_TO_ONE
}

export enum DataClassFieldEntityCascadeType {
  ALL,
  PERSIST,
  MERGE,
  REMOVE,
  REFRESH
}
