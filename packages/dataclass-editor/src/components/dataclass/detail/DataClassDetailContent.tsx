import { BasicField, Button, Flex, Textarea, ToggleGroup, ToggleGroupItem } from '@axonivy/ui-components';
import { useState } from 'react';
import { useAppContext } from '../../../context/AppContext';
import { isEntityClass } from '../data/dataclass-utils';
import './DetailContent.css';

export const DataClassDetailContent = () => {
  const { dataClass } = useAppContext();

  const initialClassType = isEntityClass(dataClass) ? 'entity-class' : dataClass.isBusinessCaseData ? 'business-data-class' : 'data-class';

  const [classType, setClassType] = useState(initialClassType);

  const variant = (value: string) => (value === classType ? 'primary' : undefined);

  return (
    <Flex direction='column' gap={4} className='detail-content'>
      <BasicField label='Class type'>
        <ToggleGroup type='single' className='class-type-group' value={classType} onValueChange={setClassType}>
          <ToggleGroupItem value='data-class' asChild>
            <Button variant={variant('data-class')} size='large'>
              Data Class
            </Button>
          </ToggleGroupItem>
          <ToggleGroupItem value='business-data-class' asChild>
            <Button variant={variant('business-data-class')} size='large'>
              Business Data Class
            </Button>
          </ToggleGroupItem>
          <ToggleGroupItem value='entity-class' asChild>
            <Button variant={variant('entity-class')} size='large'>
              Entity Class
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
