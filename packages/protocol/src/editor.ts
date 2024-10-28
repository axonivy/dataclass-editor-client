/* eslint-disable */
// prettier-ignore
/**
 * This file was automatically generated by json-schema-to-typescript.
 * DO NOT MODIFY IT BY HAND. Instead, modify the source JSONSchema file,
 * and run json-schema-to-typescript to regenerate this file.
 */

export type Association = ("ONE_TO_ONE" | "ONE_TO_MANY" | "MANY_TO_ONE")
export type CascadeType = "ALL" | "PERSIST" | "MERGE" | "REMOVE" | "REFRESH";
export type Modifier =
  | "PERSISTENT"
  | "ID"
  | "GENERATED"
  | "NOT_NULLABLE"
  | "UNIQUE"
  | "NOT_UPDATEABLE"
  | "NOT_INSERTABLE"
  | "VERSION";
export type Severity = "INFO" | "WARNING" | "ERROR";

export interface DataClasses {
  dataActionArgs: DataActionArgs;
  dataClassCombineArgs: DataClassCombineArgs;
  dataClassData: DataClassData;
  dataClassEditorDataContext: DataClassEditorDataContext;
  dataClassModel: DataClassModel;
  dataClassSaveDataArgs: DataClassSaveDataArgs;
  dataclassType: DataclassType[];
  javaType: JavaType[];
  typeSearchRequest: TypeSearchRequest;
  validationResult: ValidationResult[];
  void: Void;
  [k: string]: unknown;
}
export interface DataActionArgs {
  actionId: "openForm" | "openProcess";
  context: DataClassEditorDataContext;
  payload: JsonNode;
}
export interface DataClassEditorDataContext {
  app: string;
  file: string;
  pmv: string;
}
export interface JsonNode {}
export interface DataClassCombineArgs {
  context: DataClassEditorDataContext;
  fieldNames: string[];
}
export interface DataClassData {
  context: DataClassEditorDataContext;
  data: DataClassModel;
}
export interface DataClassModel {
  $schema: string;
  simpleName: string;
  namespace: string;
  comment: string;
  annotations: string[];
  isBusinessCaseData: boolean;
  entity: EntityClass;
  fields: Field[];
}
export interface EntityClass {
  tableName: string;
}
export interface Field {
  annotations: string[];
  comment: string;
  entity: EntityField;
  modifiers: Modifier[];
  name: string;
  type: string;
}
export interface EntityField {
  association: Association;
  cascadeTypes: CascadeType[];
  databaseFieldLength: string;
  databaseName: string;
  mappedByFieldName: string;
  orphanRemoval: boolean;
}
export interface DataClassSaveDataArgs {
  context: DataClassEditorDataContext;
  data: DataClassModel;
}
export interface DataclassType {
  fullQualifiedName: string;
  name: string;
  packageName: string;
  path: string;
}
export interface JavaType {
  fullQualifiedName: string;
  packageName: string;
  simpleName: string;
}
export interface TypeSearchRequest {
  context: DataClassEditorDataContext;
  limit: number;
  type: string;
}
export interface ValidationResult {
  message: string;
  path: string;
  severity: Severity;
}
export interface Void {}