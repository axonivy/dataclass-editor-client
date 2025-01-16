import { Accordion, AccordionContent, AccordionItem, AccordionState, AccordionTrigger, Flex } from '@axonivy/ui-components';
import { useAppContext } from '../../context/AppContext';
import { EntityFieldProvider, useField } from '../../context/FieldContext';
import { useValidation } from '../../context/useValidation';
import { isEntityField } from '../../data/dataclass-utils';
import { combineMessagesOfProperties, messagesByProperty } from '../../data/validation-utils';
import { AnnotationsTable } from '../AnnotationsTable';
import { FieldEntityAssociation } from './entity/FieldEntityAssociation';
import { FieldEntityDatabaseField } from './entity/FieldEntityDatabaseField';
import { FieldNameTypeComment } from './FieldNameTypeComment';
import { FieldProperties } from './FieldProperties';
import { useFieldProperty } from './useFieldProperty';

export const FieldDetailContent = () => {
  const { isHdData } = useAppContext();
  const { field, setField } = useField();
  const { setProperty } = useFieldProperty();

  const validations = useValidation(field);
  const messages = messagesByProperty(validations);

  return (
    <Accordion type='single' collapsible defaultValue='general' className='field-detail-content'>
      <AccordionItem value='general'>
        <AccordionTrigger state={<AccordionState messages={combineMessagesOfProperties(messages, 'NAME', 'TYPE', 'PROPERTIES_GENERAL')} />}>
          General
        </AccordionTrigger>
        <AccordionContent>
          <Flex direction='column' gap={4}>
            <FieldNameTypeComment messagesByProperty={messages} />
            {!isHdData && <FieldProperties message={messages.PROPERTIES_GENERAL} />}
            <AnnotationsTable
              annotations={field.annotations}
              setAnnotations={(annotations: Array<string>) => setProperty('annotations', annotations)}
            />
          </Flex>
        </AccordionContent>
      </AccordionItem>
      {isEntityField(field) && (
        <EntityFieldProvider value={{ field, setField }}>
          <AccordionItem value='entity'>
            <AccordionTrigger
              state={
                <AccordionState
                  messages={combineMessagesOfProperties(
                    messages,
                    'DB_FIELD_NAME',
                    'DB_FIELD_LENGTH',
                    'PROPERTIES_ENTITY',
                    'CARDINALITY',
                    'MAPPED_BY'
                  )}
                />
              }
            >
              Entity
            </AccordionTrigger>
            <AccordionContent>
              <Flex direction='column' gap={4}>
                <FieldEntityDatabaseField messagesByProperty={messages} />
                <FieldEntityAssociation messagesByProperty={messages} />
              </Flex>
            </AccordionContent>
          </AccordionItem>
        </EntityFieldProvider>
      )}
    </Accordion>
  );
};
