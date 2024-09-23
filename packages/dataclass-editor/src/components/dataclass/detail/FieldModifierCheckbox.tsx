import { BasicCheckbox } from '@axonivy/ui-components';
import { useAppContext } from '../../../context/AppContext';
import type { DataClassFieldModifier } from '../data/dataclass';
import { handleFieldModifierChange } from '../data/dataclass-utils';

type FieldModifierCheckboxProps = {
  label: string;
  modifier: DataClassFieldModifier;
  disabled?: boolean;
};

export const FieldModifierCheckbox = ({ label, modifier, disabled }: FieldModifierCheckboxProps) => {
  const { dataClass, setDataClass, selectedField } = useAppContext();
  if (selectedField === undefined) {
    return;
  }

  return (
    <BasicCheckbox
      label={label}
      checked={dataClass.fields[selectedField].modifiers.includes(modifier)}
      onCheckedChange={event => handleFieldModifierChange(event.valueOf(), modifier, dataClass, setDataClass, selectedField)}
      disabled={disabled}
    />
  );
};
