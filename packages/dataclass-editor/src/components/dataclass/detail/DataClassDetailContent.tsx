import {
  BasicField,
  Button,
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
  Flex,
  Input,
  Textarea,
  ToggleGroup,
  ToggleGroupItem
} from '@axonivy/ui-components';
import { useAppContext } from '../../../context/AppContext';
import type { DataClass } from '../data/dataclass';
import { classType } from '../data/dataclass-utils';
import { AnnotationsTable } from './AnnotationsTable';
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
    } else if (classType === 'ENTITY') {
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
      <Collapsible defaultOpen={true}>
        <CollapsibleTrigger>Name / Description</CollapsibleTrigger>
        <CollapsibleContent>
          <Flex direction='column' gap={4}>
            <BasicField label='Name'>
              <Input value={dataClass.simpleName} disabled={true} />
            </BasicField>
            <BasicField label='Description'>
              <Textarea value={dataClass.comment} onChange={event => handleDataClassPropertyChange('comment', event.target.value)} />
            </BasicField>
          </Flex>
        </CollapsibleContent>
      </Collapsible>
      <AnnotationsTable
        annotations={dataClass.annotations}
        setAnnotations={(annotations: Array<string>) => handleDataClassPropertyChange('annotations', annotations)}
      />
      <Collapsible>
        <CollapsibleTrigger>Class type</CollapsibleTrigger>
        <CollapsibleContent>
          <ToggleGroup
            type='single'
            className='class-type-group'
            value={initialClassType}
            onValueChange={handleClassTypeChange}
            style={{ display: 'flex' }}
          >
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
        </CollapsibleContent>
      </Collapsible>
    </Flex>
  );
};
