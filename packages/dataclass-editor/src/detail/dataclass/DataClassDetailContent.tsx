import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionState,
  AccordionTrigger,
  Flex,
  type UpdateConsumer
} from '@axonivy/ui-components';
import { EntityClassProvider, useAppContext } from '../../context/AppContext';
import { isEntity } from '../../data/dataclass-utils';
import { AnnotationsTable } from '../AnnotationsTable';
import { DataClassNameDescription } from './DataClassNameDescription';
import { DataClassType } from './DataClassType';
import { EntityClassDatabaseTable } from './entity/EntityClassDatabaseTable';
import { useDataClassProperty } from './useDataClassProperty';
import type { EntityDataClass } from '@axonivy/dataclass-editor-protocol';
import { combineMessagesOfProperties } from '../../data/validation-utils';
import { useDetail } from '../../context/DetailContext';
import { useTranslation } from 'react-i18next';

export const DataClassDetailContent = () => {
  const { dataClass, setDataClass, isHdData } = useAppContext();
  const { messages } = useDetail();
  const { setProperty } = useDataClassProperty();
  const { t } = useTranslation();

  return (
    <Accordion type='single' collapsible defaultValue='general' className='dataclass-editor-dataclass-detail'>
      <AccordionItem value='general'>
        <AccordionTrigger state={<AccordionState messages={combineMessagesOfProperties(messages, 'NAMESPACE', 'ANNOTATION')} />}>
          {t('common.label.general')}
        </AccordionTrigger>
        <AccordionContent>
          <Flex direction='column' gap={4}>
            <DataClassNameDescription />
            <AnnotationsTable
              annotations={dataClass.annotations}
              setAnnotations={(newAnnotations: Array<string>) => setProperty('annotations', newAnnotations)}
              message={messages.ANNOTATION}
            />
            {!isHdData && <DataClassType />}
          </Flex>
        </AccordionContent>
      </AccordionItem>
      {isEntity(dataClass) && (
        <EntityClassProvider value={{ entityClass: dataClass, setEntityClass: setDataClass as UpdateConsumer<EntityDataClass> }}>
          <AccordionItem value='entity'>
            <AccordionTrigger>{t('label.entity')}</AccordionTrigger>
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
