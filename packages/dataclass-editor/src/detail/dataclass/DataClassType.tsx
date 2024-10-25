import { BasicSelect, Collapsible, CollapsibleContent, CollapsibleTrigger } from '@axonivy/ui-components';
import { useAppContext } from '../../context/AppContext';
import type { DataClassType as ClassType, DataClass } from '@axonivy/dataclass-editor-protocol';
import { classTypeOf } from '../../data/dataclass-utils';

export const useClassType = () => {
  const { dataClass, setDataClass } = useAppContext();
  const setClassType = (classType: ClassType) => {
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
      changeToEntityClass(newDataClass);
    }

    setDataClass(newDataClass);
  };
  return { classType: classTypeOf(dataClass), setClassType };
};

const changeToEntityClass = (newDataClass: DataClass) => {
  newDataClass.entity = { tableName: '' };
  newDataClass.fields.forEach(
    field =>
      (field.entity = {
        databaseName: '',
        databaseFieldLength: '',
        cascadeTypes: ['PERSIST', 'MERGE'],
        mappedByFieldName: '',
        orphanRemoval: false
      })
  );
  if (!newDataClass.fields.some(field => field.name === 'id')) {
    newDataClass.fields.unshift({
      name: 'id',
      type: 'Integer',
      comment: 'Identifier',
      modifiers: ['PERSISTENT', 'ID', 'GENERATED'],
      annotations: [],
      entity: {
        databaseName: '',
        databaseFieldLength: '',
        cascadeTypes: ['PERSIST', 'MERGE'],
        mappedByFieldName: '',
        orphanRemoval: false
      }
    });
  }
};

const dataClassTypeItems: Array<{ value: ClassType; label: string }> = [
  { value: 'DATA', label: 'Data' },
  { value: 'BUSINESS_DATA', label: 'Business Data' },
  { value: 'ENTITY', label: 'Entity' }
] as const;

export const DataClassType = () => {
  const { classType, setClassType } = useClassType();

  return (
    <Collapsible>
      <CollapsibleTrigger>Class type</CollapsibleTrigger>
      <CollapsibleContent>
        <BasicSelect value={classType} items={dataClassTypeItems} onValueChange={setClassType} />
      </CollapsibleContent>
    </Collapsible>
  );
};
