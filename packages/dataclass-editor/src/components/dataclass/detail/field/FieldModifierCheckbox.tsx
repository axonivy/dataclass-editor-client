import { BasicCheckbox } from '@axonivy/ui-components';
import { useFieldContext } from '../../../../context/FieldContext';
import type { DataClassFieldModifier } from '../../data/dataclass';
import { useDataClassChangeHandlers } from '../../data/dataclass-change-handlers';

type FieldModifierCheckboxProps = {
  label: string;
  modifier: DataClassFieldModifier;
  disabled?: boolean;
};

export const FieldModifierCheckbox = ({ label, modifier, disabled }: FieldModifierCheckboxProps) => {
  const { field } = useFieldContext();
  const { handleFieldModifierChange } = useDataClassChangeHandlers();

  return (
    <BasicCheckbox
      label={label}
      checked={field.modifiers.includes(modifier)}
      onCheckedChange={event => handleFieldModifierChange(event.valueOf(), modifier)}
      disabled={disabled}
    />
  );
};
