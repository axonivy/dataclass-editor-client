import {
  BasicField,
  BasicSelect,
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
  Flex,
  Input,
  Textarea
} from '@axonivy/ui-components';
import { useAppContext } from '../../../context/AppContext';
import type { DataClass } from '../data/dataclass';
import { classType } from '../data/dataclass-utils';
import { AnnotationsTable } from './AnnotationsTable';
import './DetailContent.css';

export const DataClassDetailContent = () => {
  const { dataClass, setDataClass } = useAppContext();

  const initialClassType = classType(dataClass);

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
          <BasicSelect
            value={initialClassType}
            items={[
              { value: 'DATA', label: 'Data' },
              { value: 'BUSINESS_DATA', label: 'Business Data' },
              { value: 'ENTITY', label: 'Entity' }
            ]}
            onValueChange={handleClassTypeChange}
          />
        </CollapsibleContent>
      </Collapsible>
    </Flex>
  );
};
