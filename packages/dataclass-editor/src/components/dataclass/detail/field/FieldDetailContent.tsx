import { Accordion, AccordionContent, AccordionItem, AccordionTrigger, Flex } from '@axonivy/ui-components';
import { useEffect, useState } from 'react';
import { useAppContext } from '../../../../context/AppContext';
import { FieldProvider } from '../../../../context/FieldContext';
import { useDataClassChangeHandlers } from '../../data/dataclass-change-handlers';
import { isEntityField } from '../../data/dataclass-utils';
import { AnnotationsTable } from '../AnnotationsTable';
import { FieldEntityAssociation } from './entity/FieldEntityAssociation';
import { FieldEntityDatabaseField } from './entity/FieldEntityDatabaseField';
import { FieldNameTypeComment } from './FieldNameTypeComment';
import { FieldProperties } from './FieldProperties';

export const FieldDetailContent = () => {
  const { dataClass, selectedField } = useAppContext();
  const { handleFieldPropertyChange } = useDataClassChangeHandlers();

  const field = selectedField !== undefined && selectedField < dataClass.fields.length ? dataClass.fields[selectedField] : undefined;

  const [renderEntity, setRenderEntity] = useState(false);
  useEffect(() => setRenderEntity(isEntityField(field)), [field]);

  if (!field) {
    return;
  }

  return (
    <FieldProvider value={{ field: field }}>
      <Accordion type='single' collapsible defaultValue='general' className='field-detail-content'>
        <AccordionItem value='general'>
          <AccordionTrigger>General</AccordionTrigger>
          <AccordionContent>
            <Flex direction='column' gap={4}>
              <FieldNameTypeComment />
              <FieldProperties />
              <AnnotationsTable
                annotations={field.annotations}
                setAnnotations={(annotations: Array<string>) => handleFieldPropertyChange('annotations', annotations)}
              />
            </Flex>
          </AccordionContent>
        </AccordionItem>
        {renderEntity && (
          <AccordionItem value='entity'>
            <AccordionTrigger>Entity</AccordionTrigger>
            <AccordionContent>
              <Flex direction='column' gap={4}>
                <FieldEntityDatabaseField />
                <FieldEntityAssociation />
              </Flex>
            </AccordionContent>
          </AccordionItem>
        )}
      </Accordion>
    </FieldProvider>
  );
};
