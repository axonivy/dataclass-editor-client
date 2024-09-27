import { useAppContext } from '../../../context/AppContext';
import { areArraysIdentical } from '../../../utils/array/array';
import {
  DATA_CLASS_FIELD_ENTITY_CASCADE_TYPES,
  type DataClass,
  type DataClassEntity,
  type DataClassField,
  type DataClassFieldEntity,
  type DataClassFieldEntityAssociation,
  type DataClassFieldEntityCascadeType,
  type DataClassFieldModifier
} from './dataclass';
import { isDataClassIDType, isDataClassVersionType, isEntity } from './dataclass-utils';

export const useDataClassChangeHandlers = () => {
  const { dataClass, setDataClass, selectedField } = useAppContext();

  const handleDataClassPropertyChange = <DKey extends keyof DataClass>(key: DKey, value: DataClass[DKey]) => {
    const newDataClass = structuredClone(dataClass);
    newDataClass[key] = value;
    setDataClass(newDataClass);
  };

  const handleDataClassEntityPropertyChange = <DEKey extends keyof DataClassEntity>(key: DEKey, value: DataClassEntity[DEKey]) => {
    if (!isEntity(dataClass)) {
      return;
    }
    const newEntity = structuredClone(dataClass.entity);
    newEntity[key] = value;
    handleDataClassPropertyChange('entity', newEntity);
  };

  const handleClassTypeChange = (classType: string) => {
    const newDataClass = structuredClone(dataClass);

    newDataClass.isBusinessCaseData = false;
    newDataClass.entity = undefined;
    newDataClass.fields.forEach(field => {
      field.modifiers = field.modifiers.filter(modifier => modifier === 'PERSISTENT');
      field.entity = undefined;
    });

    if (classType === 'BUSINESS_DATA') {
      newDataClass.isBusinessCaseData = true;
    } else if (classType === 'ENTITY') {
      newDataClass.entity = { tableName: '' };
      newDataClass.fields.forEach(
        field =>
          (field.entity = {
            databaseName: '',
            databaseFieldLength: '',
            cascadeTypes: [],
            mappedByFieldName: '',
            orphanRemoval: false
          })
      );
    }

    setDataClass(newDataClass);
  };

  const handleFieldPropertyChange = <FKey extends keyof DataClassField>(key: FKey, value: DataClassField[FKey]) => {
    if (selectedField == undefined) {
      return;
    }
    const newDataClass = structuredClone(dataClass);
    newDataClass.fields[selectedField][key] = value;
    setDataClass(newDataClass);
  };

  const handleFieldTypeChange = (type: string) => {
    if (selectedField == undefined) {
      return;
    }
    const newDataClass = structuredClone(dataClass);
    const newField = newDataClass.fields[selectedField];
    if (!isDataClassIDType(type)) {
      newField.modifiers = updateModifiers(false, newField.modifiers, 'ID');
    }
    if (!isDataClassVersionType(type)) {
      newField.modifiers = updateModifiers(false, newField.modifiers, 'VERSION');
    }
    newField.type = type;
    setDataClass(newDataClass);
  };

  const handleFieldModifierChange = (add: boolean | string, modifier: DataClassFieldModifier) => {
    if (selectedField == undefined) {
      return;
    }
    let newModifiers = structuredClone(dataClass.fields[selectedField].modifiers);
    newModifiers = updateModifiers(add, newModifiers, modifier);
    handleFieldPropertyChange('modifiers', newModifiers);
  };

  const updateModifiers = (add: boolean | string, newModifiers: Array<DataClassFieldModifier>, modifier: DataClassFieldModifier) => {
    if (add) {
      if (modifier === 'ID' || modifier === 'VERSION') {
        newModifiers = newModifiers.filter(mod => mod === 'GENERATED' || mod === 'PERSISTENT');
      }
      newModifiers.push(modifier);
    } else {
      if (modifier === 'ID') {
        newModifiers = newModifiers.filter(mod => mod !== 'GENERATED');
      }
      newModifiers = newModifiers.filter(mod => mod !== modifier);
    }
    return newModifiers;
  };

  const handleFieldEntityPropertyChange = <FEKey extends keyof DataClassFieldEntity>(key: FEKey, value: DataClassFieldEntity[FEKey]) => {
    if (selectedField == undefined || !isEntity(dataClass)) {
      return;
    }
    const newEntity = structuredClone(dataClass.fields[selectedField].entity);
    newEntity[key] = value;
    handleFieldPropertyChange('entity', newEntity);
  };

  const handleFieldEntityCardinalityChange = (association: DataClassFieldEntityAssociation | undefined) => {
    if (selectedField == undefined || !isEntity(dataClass)) {
      return;
    }
    const newDataClass = structuredClone(dataClass);
    const newEntity = newDataClass.fields[selectedField].entity;
    if (!association || association === 'MANY_TO_ONE') {
      newEntity.mappedByFieldName = '';
      newEntity.orphanRemoval = false;
    }
    newEntity.association = association;
    setDataClass(newDataClass);
  };

  const handleFieldEntityCascadeTypeChange = (add: boolean | string, cascadeType: DataClassFieldEntityCascadeType) => {
    if (selectedField == undefined || !isEntity(dataClass)) {
      return;
    }

    if (cascadeType === 'ALL') {
      const newCascadeTypes: Array<DataClassFieldEntityCascadeType> = [];
      if (add) {
        newCascadeTypes.push('ALL');
      }
      handleFieldEntityPropertyChange('cascadeTypes', newCascadeTypes);
      return;
    }

    const allCascadeTypes = [...DATA_CLASS_FIELD_ENTITY_CASCADE_TYPES];

    const newDataClass = structuredClone(dataClass);
    const newFieldEntity = newDataClass.fields[selectedField].entity;
    let newCascadeTypes = newFieldEntity.cascadeTypes;
    if (add) {
      newCascadeTypes.push(cascadeType);
      if (areArraysIdentical(newCascadeTypes, allCascadeTypes)) {
        newCascadeTypes = ['ALL'];
      }
    } else {
      if (newCascadeTypes.includes('ALL')) {
        newCascadeTypes = allCascadeTypes;
      }
      newCascadeTypes.splice(newCascadeTypes.indexOf(cascadeType), 1);
    }
    newFieldEntity.cascadeTypes = newCascadeTypes;
    setDataClass(newDataClass);
  };

  const handleFieldEntityMappedByFieldNameChange = (mappedByFieldName: string) => {
    if (selectedField == undefined || !isEntity(dataClass)) {
      return;
    }
    const newDataClass = structuredClone(dataClass);
    const newField = newDataClass.fields[selectedField];
    newField.modifiers = newField.modifiers.filter(modifier => modifier === 'PERSISTENT');
    newField.entity.mappedByFieldName = mappedByFieldName;
    setDataClass(newDataClass);
  };

  return {
    handleDataClassPropertyChange,
    handleDataClassEntityPropertyChange,
    handleClassTypeChange,
    handleFieldPropertyChange,
    handleFieldTypeChange,
    handleFieldModifierChange,
    handleFieldEntityPropertyChange,
    handleFieldEntityCardinalityChange,
    handleFieldEntityCascadeTypeChange,
    handleFieldEntityMappedByFieldNameChange
  };
};
