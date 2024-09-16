import { BasicField, Button, Flex, Textarea, ToggleGroup, ToggleGroupItem } from '@axonivy/ui-components';
import { useState } from 'react';
import { useAppContext } from '../../../context/AppContext';
import { classType as getClassType } from '../data/dataclass-utils';
import './DetailContent.css';

export const DataClassDetailContent = () => {
  const { dataClass } = useAppContext();

  const initialClassType = getClassType(dataClass);

  const [classType, setClassType] = useState(initialClassType);

  const variant = (value: string) => (value === classType ? 'primary' : undefined);

  return (
    <Flex direction='column' gap={4} className='detail-content'>
      <BasicField label='Class type'>
        <ToggleGroup type='single' className='class-type-group' value={classType} onValueChange={setClassType}>
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
        <Textarea value={dataClass.comment} />
      </BasicField>
      <BasicField label='Annotations'>
        <Textarea value={dataClass.annotations.join('\n')} />
      </BasicField>
    </Flex>
  );
};
