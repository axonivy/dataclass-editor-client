import { Accordion, AccordionContent, AccordionItem, AccordionTrigger, Flex } from '@axonivy/ui-components';
import { useAppContext } from '../../../../context/AppContext';
import { useDataClassChangeHandlers } from '../../data/dataclass-change-handlers';
import { isEntity } from '../../data/dataclass-utils';
import { AnnotationsTable } from '../AnnotationsTable';
import { DataClassClassType } from './DataClassClassType';
import { DataClassNameDescription } from './DataClassNameDescription';
import { EntityClassDatabaseTable } from './entity/EntityClassDatabaseTable';

export const DataClassDetailContent = () => {
  const { dataClass } = useAppContext();
  const { handleDataClassPropertyChange } = useDataClassChangeHandlers();

  return (
    <Accordion type='single' collapsible defaultValue='general'>
      <AccordionItem value='general'>
        <AccordionTrigger>General</AccordionTrigger>
        <AccordionContent>
          <Flex direction='column' gap={4}>
            <DataClassNameDescription />
            <AnnotationsTable
              annotations={dataClass.annotations}
              setAnnotations={(newAnnotations: Array<string>) => handleDataClassPropertyChange('annotations', newAnnotations)}
            />
            <DataClassClassType />
          </Flex>
        </AccordionContent>
      </AccordionItem>
      {isEntity(dataClass) && (
        <AccordionItem value='entity'>
          <AccordionTrigger>Entity</AccordionTrigger>
          <AccordionContent>
            <Flex direction='column' gap={4}>
              <EntityClassDatabaseTable />
            </Flex>
          </AccordionContent>
        </AccordionItem>
      )}
    </Accordion>
  );
};
