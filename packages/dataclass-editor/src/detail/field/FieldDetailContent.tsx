import { Accordion, AccordionContent, AccordionItem, AccordionTrigger, Flex } from '@axonivy/ui-components';
import { EntityFieldProvider, useField } from '../../context/FieldContext';
import type { Field, EntityClassField } from '@axonivy/dataclass-editor-protocol';
import { AnnotationsTable } from '../AnnotationsTable';
import { FieldEntityAssociation } from './entity/FieldEntityAssociation';
import { FieldEntityDatabaseField } from './entity/FieldEntityDatabaseField';
import { FieldNameTypeComment } from './FieldNameTypeComment';
import { FieldProperties } from './FieldProperties';
import { useFieldProperty } from './useFieldProperty';

export const isEntityField = (field: Field): field is EntityClassField => {
  return !!field.entity && field.modifiers.includes('PERSISTENT');
};

export const FieldDetailContent = () => {
  const { field, setField } = useField();
  const { setProperty } = useFieldProperty();

  return (
    <Accordion type='single' collapsible defaultValue='general' className='field-detail-content'>
      <AccordionItem value='general'>
        <AccordionTrigger>General</AccordionTrigger>
        <AccordionContent>
          <Flex direction='column' gap={4}>
            <FieldNameTypeComment />
            <FieldProperties />
            <AnnotationsTable
              annotations={field.annotations}
              setAnnotations={(annotations: Array<string>) => setProperty('annotations', annotations)}
            />
          </Flex>
        </AccordionContent>
      </AccordionItem>
      {isEntityField(field) && (
        <EntityFieldProvider value={{ field: field, setField }}>
          <AccordionItem value='entity'>
            <AccordionTrigger>Entity</AccordionTrigger>
            <AccordionContent>
              <Flex direction='column' gap={4}>
                <FieldEntityDatabaseField />
                <FieldEntityAssociation />
              </Flex>
            </AccordionContent>
          </AccordionItem>
        </EntityFieldProvider>
      )}
    </Accordion>
  );
};
