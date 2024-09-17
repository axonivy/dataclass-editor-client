import { BasicField, Button, Flex, Textarea, ToggleGroup, ToggleGroupItem } from '@axonivy/ui-components';
import { useAppContext } from '../../../context/AppContext';
import type { DataClass } from '../data/dataclass';
import { classType } from '../data/dataclass-utils';
import './DetailContent.css';

export const DataClassDetailContent = () => {
  const { dataClass, setDataClass } = useAppContext();

  const initialClassType = classType(dataClass);

  const variant = (value: string) => (value === initialClassType ? 'primary' : undefined);

  const handleClassTypeChange = (classType: string) => {
    const newDataClass = structuredClone(dataClass);
newDataClass.isBusinessCaseData = false;
newDataClass.entity = undefined;
if (classType === 'BUSINESS_DATA') {
  newDataClass.isBusinessCaseData = true;
}        
if (classType === 'ENTITY') {
  newDataClass.entity = { tableName: '' };
}
    setDataClass(newDataClass);
  };

  const handleDataClassPropertyChange = <DKey extends keyof DataClass>(key: DKey, value: DataClass[DKey]) => {
    const newDataClass = structuredClone(dataClass);
    newDataClass[key] = value;
    setDataClass(newDataClass);
  };

  return (
    <Flex direction='column' gap={4} className='detail-content'>
      <BasicField label='Class type'>
        <ToggleGroup type='single' className='class-type-group' value={initialClassType} onValueChange={handleClassTypeChange}>
          <ToggleGroupItem value='DATA' asChild>
            <Button variant={variant('DATA')} size='large'>
              Data
            </Button>
          </ToggleGroupItem>
          <ToggleGroupItem value='BUSINESS_DATA' asChild>
            <Button variant={variant('BUSINESS_DATA')} size='large'>
              Business Data
            </Button>
          </ToggleGroupItem>
          <ToggleGroupItem value='ENTITY' asChild>
            <Button variant={variant('ENTITY')} size='large'>
              Entity
            </Button>
          </ToggleGroupItem>
        </ToggleGroup>
      </BasicField>
      <BasicField label='Description'>
        <Textarea value={dataClass.comment} onChange={event => handleDataClassPropertyChange('comment', event.target.value)} />
      </BasicField>
      <BasicField label='Annotations'>
        <Textarea
          value={dataClass.annotations.join('\n')}
          onChange={event => handleDataClassPropertyChange('annotations', event.target.value.split('\n'))}
        />
      </BasicField>
    </Flex>
  );
};
