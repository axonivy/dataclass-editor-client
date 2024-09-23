import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
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
import { classTypeOf } from '../data/dataclass-utils';
import { AnnotationsTable } from './AnnotationsTable';

export const DataClassDetailContent = () => {
  const { dataClass, setDataClass } = useAppContext();

  const classType = classTypeOf(dataClass);

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
    <Accordion type='single' collapsible defaultValue='general'>
      <AccordionItem value='general'>
        <AccordionTrigger>General</AccordionTrigger>
        <AccordionContent>
          <Flex direction='column' gap={4}>
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
                  value={classType}
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
        </AccordionContent>
      </AccordionItem>
      {classType === 'ENTITY' && (
        <AccordionItem value='entity'>
          <AccordionTrigger>Entity</AccordionTrigger>
          <AccordionContent>Coming soon...</AccordionContent>
        </AccordionItem>
      )}
    </Accordion>
  );
};
