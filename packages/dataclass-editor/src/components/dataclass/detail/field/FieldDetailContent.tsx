import { Accordion, AccordionContent, AccordionItem, AccordionTrigger, Flex } from '@axonivy/ui-components';
import { useAppContext } from '../../../../context/AppContext';
import { FieldProvider } from '../../../../context/FieldContext';
import { handleFieldPropertyChange, isEntityField } from '../../data/dataclass-utils';
import { AnnotationsTable } from '../AnnotationsTable';
import { FieldEntityAssociation } from './entity/FieldEntityAssociation';
import { FieldEntityDatabaseField } from './entity/FieldEntityDatabaseField';
import './FieldDetailContent.css';
import { FieldNameTypeComment } from './FieldNameTypeComment';
import { FieldProperties } from './FieldProperties';

export const FieldDetailContent = () => {
  const { dataClass, setDataClass, selectedField } = useAppContext();
  if (selectedField === undefined) {
    return;
  }

  const field = selectedField < dataClass.fields.length ? dataClass.fields[selectedField] : undefined;
  if (!field) {
    return;
  }

  return (
    <FieldProvider value={{ field: field, selectedField: selectedField }}>
      <Accordion type='single' collapsible defaultValue='general'>
        <AccordionItem value='general'>
          <AccordionTrigger>General</AccordionTrigger>
          <AccordionContent>
            <Flex direction='column' gap={4}>
              <FieldNameTypeComment />
              <FieldProperties />
              <AnnotationsTable
                annotations={field.annotations}
                setAnnotations={(annotations: Array<string>) =>
                  handleFieldPropertyChange('annotations', annotations, dataClass, setDataClass, selectedField)
                }
              />
            </Flex>
          </AccordionContent>
        </AccordionItem>
        {isEntityField(field) && field.modifiers.includes('PERSISTENT') && (
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
