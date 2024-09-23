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
import {
  classTypeOf,
  handleClassTypeChange,
  handleDataClassEntityPropertyChange,
  handleDataClassPropertyChange,
  isEntity
} from '../data/dataclass-utils';
import { AnnotationsTable } from './AnnotationsTable';

export const DataClassDetailContent = () => {
  const { dataClass, setDataClass } = useAppContext();

  const classType = classTypeOf(dataClass);

  const onPropertyChange = <DKey extends keyof DataClass>(key: DKey, value: DataClass[DKey]) =>
    handleDataClassPropertyChange(key, value, dataClass, setDataClass);

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
                    <Textarea value={dataClass.comment} onChange={event => onPropertyChange('comment', event.target.value)} />
                  </BasicField>
                </Flex>
              </CollapsibleContent>
            </Collapsible>
            <AnnotationsTable
              annotations={dataClass.annotations}
              setAnnotations={(newAnnotations: Array<string>) => onPropertyChange('annotations', newAnnotations)}
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
                  onValueChange={classType => handleClassTypeChange(classType, dataClass, setDataClass)}
                />
              </CollapsibleContent>
            </Collapsible>
          </Flex>
        </AccordionContent>
      </AccordionItem>
      {isEntity(dataClass) && (
        <AccordionItem value='entity'>
          <AccordionTrigger>Entity</AccordionTrigger>
          <AccordionContent>
            <Flex direction='column' gap={4}>
              <Collapsible defaultOpen={dataClass.entity.tableName !== ''}>
                <CollapsibleTrigger>Database Table</CollapsibleTrigger>
                <CollapsibleContent>
                  <Flex direction='column' gap={4}>
                    <BasicField label='Name'>
                      <Input
                        value={dataClass.entity.tableName}
                        onChange={event => handleDataClassEntityPropertyChange('tableName', event.target.value, dataClass, setDataClass)}
                      />
                    </BasicField>
                  </Flex>
                </CollapsibleContent>
              </Collapsible>
            </Flex>
          </AccordionContent>
        </AccordionItem>
      )}
    </Accordion>
  );
};
