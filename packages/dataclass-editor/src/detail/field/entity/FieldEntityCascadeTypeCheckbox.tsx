import { DATA_CLASS_FIELD_ENTITY_CASCADE_TYPES, type CascadeType } from '@axonivy/dataclass-editor-protocol';
import { BasicCheckbox, deepEqual } from '@axonivy/ui-components';
import { useEntityField } from '../../../context/DetailContext';

type FieldEntityCascadeTypeCheckboxProps = {
  label: string;
  cascadeType: CascadeType;
};

export const useCascadeType = (cascadeType: CascadeType) => {
  const { field, setField } = useEntityField();
  const setCascadeType = (add: boolean) => {
    const newField = structuredClone(field);
    if (cascadeType === 'ALL') {
      newField.entity.cascadeTypes = [];
      if (add) {
        newField.entity.cascadeTypes.push('ALL');
      }
      setField(newField);
      return;
    }

    const allCascadeTypes = [...DATA_CLASS_FIELD_ENTITY_CASCADE_TYPES.filter(cascadeType => cascadeType !== 'ALL')];
    let newCascadeTypes = newField.entity.cascadeTypes;
    if (add) {
      newCascadeTypes.push(cascadeType);
      if (deepEqual([...newCascadeTypes].sort(), [...allCascadeTypes].sort())) {
        newCascadeTypes = ['ALL'];
      }
    } else {
      if (newCascadeTypes.includes('ALL')) {
        newCascadeTypes = allCascadeTypes;
      }
      newCascadeTypes.splice(newCascadeTypes.indexOf(cascadeType), 1);
    }
    newField.entity.cascadeTypes = newCascadeTypes;
    setField(newField);
  };
  return {
    checked: field.entity.cascadeTypes.includes('ALL') || field.entity.cascadeTypes.includes(cascadeType),
    setCascadeType,
    isDisabled: !field.entity.association
  };
};

export const FieldEntityCascadeTypeCheckbox = ({ label, cascadeType }: FieldEntityCascadeTypeCheckboxProps) => {
  const { checked, setCascadeType, isDisabled } = useCascadeType(cascadeType);

  return (
    <BasicCheckbox
      label={label}
      checked={checked}
      onCheckedChange={event => setCascadeType(event.valueOf() as boolean)}
      disabled={isDisabled}
    />
  );
};
