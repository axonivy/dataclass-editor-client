import { Accordion, AccordionContent, AccordionItem, AccordionTrigger, Flex } from '@axonivy/ui-components';
import { EntityFieldProvider, useField } from '../../context/FieldContext';
import { isEntityField } from '../../data/dataclass-utils';
import { AnnotationsTable } from '../AnnotationsTable';
import { FieldEntityAssociation } from './entity/FieldEntityAssociation';
import { FieldEntityDatabaseField } from './entity/FieldEntityDatabaseField';
import { FieldNameTypeComment } from './FieldNameTypeComment';
import { FieldProperties } from './FieldProperties';
import { useFieldProperty } from './useFieldProperty';
import { useAppContext } from '../../context/AppContext';

export const FieldDetailContent = () => {
  const { isHdData } = useAppContext();
  const { field, setField } = useField();
  const { setProperty } = useFieldProperty();

  return (
    <Accordion type='single' collapsible defaultValue='general' className='field-detail-content'>
      <AccordionItem value='general'>
        <AccordionTrigger>General</AccordionTrigger>
        <AccordionContent>
          <Flex direction='column' gap={4}>
            <FieldNameTypeComment />
            {!isHdData && <FieldProperties />}
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
