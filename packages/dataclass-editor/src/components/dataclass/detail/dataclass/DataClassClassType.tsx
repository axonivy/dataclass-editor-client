import { BasicSelect, Collapsible, CollapsibleContent, CollapsibleTrigger } from '@axonivy/ui-components';
import { useAppContext } from '../../../../context/AppContext';
import { classTypeOf, handleClassTypeChange } from '../../data/dataclass-utils';

export const DataClassClassType = () => {
  const { dataClass, setDataClass } = useAppContext();

  const classType = classTypeOf(dataClass);

  return (
    <Collapsible>
      <CollapsibleTrigger>Class type</CollapsibleTrigger>
      <CollapsibleContent>
        <BasicSelect
          value={classType}
          items={[
            { value: 'DATA', label: 'Data' },
            { value: 'BUSINESS_DATA', label: 'Business Data' },
            { value: 'ENTITY', label: 'Entity' }
          ]}
          onValueChange={classType => handleClassTypeChange(classType, dataClass, setDataClass)}
        />
      </CollapsibleContent>
    </Collapsible>
  );
};
