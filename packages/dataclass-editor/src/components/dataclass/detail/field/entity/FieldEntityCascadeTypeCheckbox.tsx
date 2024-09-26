import { BasicCheckbox } from '@axonivy/ui-components';
import { useAppContext } from '../../../../../context/AppContext';
import type { DataClassFieldEntityCascadeType } from '../../../data/dataclass';
import { handleFieldEntityCascadeTypeChange, isEntity } from '../../../data/dataclass-utils';

type FieldEntityCascadeTypeCheckboxProps = {
  label: string;
  cascadeType: DataClassFieldEntityCascadeType;
};

export const FieldEntityCascadeTypeCheckbox = ({ label, cascadeType }: FieldEntityCascadeTypeCheckboxProps) => {
  const { dataClass, setDataClass, selectedField } = useAppContext();
  if (!isEntity(dataClass) || selectedField === undefined) {
    return;
  }

  const field = dataClass.fields[selectedField];

  return (
    <BasicCheckbox
      label={label}
      checked={field.entity.cascadeTypes.includes('ALL') || field.entity.cascadeTypes.includes(cascadeType)}
      onCheckedChange={event => handleFieldEntityCascadeTypeChange(event.valueOf(), cascadeType, dataClass, setDataClass, selectedField)}
      disabled={!field.entity.association}
    />
  );
};
