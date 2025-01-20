import { Accordion, AccordionContent, AccordionItem, AccordionTrigger, Flex, type UpdateConsumer } from '@axonivy/ui-components';
import { EntityClassProvider, useAppContext } from '../../context/AppContext';
import { isEntity } from '../../data/dataclass-utils';
import { AnnotationsTable } from '../AnnotationsTable';
import { DataClassNameDescription } from './DataClassNameDescription';
import { DataClassType } from './DataClassType';
import { EntityClassDatabaseTable } from './entity/EntityClassDatabaseTable';
import { useDataClassProperty } from './useDataClassProperty';
import type { EntityDataClass } from '@axonivy/dataclass-editor-protocol';

export const DataClassDetailContent = () => {
  const { dataClass, setDataClass, isHdData } = useAppContext();
  const { setProperty } = useDataClassProperty();

  return (
    <Accordion type='single' collapsible defaultValue='general' className='dataclass-detail-content'>
      <AccordionItem value='general'>
        <AccordionTrigger>General</AccordionTrigger>
        <AccordionContent>
          <Flex direction='column' gap={4}>
            <DataClassNameDescription />
            <AnnotationsTable
              annotations={dataClass.annotations}
              setAnnotations={(newAnnotations: Array<string>) => setProperty('annotations', newAnnotations)}
            />
            {!isHdData && <DataClassType />}
          </Flex>
        </AccordionContent>
      </AccordionItem>
      {isEntity(dataClass) && (
        <EntityClassProvider value={{ entityClass: dataClass, setEntityClass: setDataClass as UpdateConsumer<EntityDataClass> }}>
          <AccordionItem value='entity'>
            <AccordionTrigger>Entity</AccordionTrigger>
            <AccordionContent>
              <Flex direction='column' gap={4}>
                <EntityClassDatabaseTable />
              </Flex>
            </AccordionContent>
          </AccordionItem>
        </EntityClassProvider>
      )}
    </Accordion>
  );
};
