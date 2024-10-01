import { BasicCheckbox } from '@axonivy/ui-components';
import { useFieldContext } from '../../../context/FieldContext';
import type { DataClassFieldEntityCascadeType } from '../../../data/dataclass';
import { useDataClassChangeHandlers } from '../../../data/dataclass-change-handlers';
import { isEntityField } from '../../../data/dataclass-utils';

type FieldEntityCascadeTypeCheckboxProps = {
  label: string;
  cascadeType: DataClassFieldEntityCascadeType;
};

export const FieldEntityCascadeTypeCheckbox = ({ label, cascadeType }: FieldEntityCascadeTypeCheckboxProps) => {
  const { field } = useFieldContext();
  const { handleFieldEntityCascadeTypeChange } = useDataClassChangeHandlers();
  if (!isEntityField(field)) {
    return;
  }

  return (
    <BasicCheckbox
      label={label}
      checked={field.entity.cascadeTypes.includes('ALL') || field.entity.cascadeTypes.includes(cascadeType)}
      onCheckedChange={event => handleFieldEntityCascadeTypeChange(event.valueOf(), cascadeType)}
      disabled={!field.entity.association}
    />
  );
};
