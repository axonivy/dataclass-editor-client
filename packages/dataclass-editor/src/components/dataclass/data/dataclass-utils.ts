import { type DataClass, type DataClassEntity, type DataClassField, type DataClassFieldEntity } from './dataclass';

export const classTypeOf = (dataClass: DataClass) => {
  if (dataClass.entity) {
    return 'ENTITY';
  }
  if (dataClass.isBusinessCaseData) {
    return 'BUSINESS_DATA';
  }
  return 'DATA';
};

export const isEntity = (
  dataClass: DataClass
): dataClass is DataClass & { entity: DataClassEntity; fields: Array<DataClassField & { entity: DataClassFieldEntity }> } => {
  return !!dataClass.entity;
};

export const isEntityField = (field: DataClassField): field is DataClassField & { entity: DataClassFieldEntity } => {
  return !!field.entity;
};

export const headerTitles = (dataClass: DataClass, selectedField?: number) => {
  let baseTitle = '';
  switch (classTypeOf(dataClass)) {
    case 'DATA':
      baseTitle = 'Data';
      break;
    case 'BUSINESS_DATA':
      baseTitle = 'Business Data';
      break;
    case 'ENTITY':
      baseTitle = 'Entity';
  }
  const masterTitle = `${baseTitle} Editor`;

  const dataClassFields = dataClass.fields;

  let detailTitle = '';
  if (selectedField === undefined) {
    detailTitle = `${baseTitle} - ${dataClass.simpleName}`;
  } else if (selectedField < dataClassFields.length) {
    const selectedDataClassField = dataClassFields[selectedField];
    detailTitle = 'Attribute - ' + selectedDataClassField.name;
  }
  return { masterTitle, detailTitle };
};

export const className = (qualifiedName: string) => {
  const lastDotIndex = qualifiedName.lastIndexOf('.');
  if (lastDotIndex === -1) {
    return qualifiedName;
  }
  return qualifiedName.substring(lastDotIndex + 1);
};
