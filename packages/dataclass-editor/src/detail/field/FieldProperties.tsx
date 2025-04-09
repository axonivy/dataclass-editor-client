import { BasicField, Collapsible, CollapsibleContent, CollapsibleState, CollapsibleTrigger } from '@axonivy/ui-components';
import { useField } from '../../context/DetailContext';
import { combineMessagesOfProperties } from '../../data/validation-utils';
import { FieldModifierCheckbox } from './FieldModifierCheckbox';
import { useTranslation } from 'react-i18next';

export const FieldProperties = () => {
  const { field, messages } = useField();
  const { t } = useTranslation();

  return (
    <Collapsible defaultOpen={field.modifiers.includes('PERSISTENT')}>
      <CollapsibleTrigger state={<CollapsibleState messages={combineMessagesOfProperties(messages, 'PROPERTIES_GENERAL')} />}>
        {t('common.label.properties')}
      </CollapsibleTrigger>
      <CollapsibleContent>
        <BasicField message={messages.PROPERTIES_GENERAL}>
          <FieldModifierCheckbox label={t('label.persistent')} modifier='PERSISTENT' />
        </BasicField>
      </CollapsibleContent>
    </Collapsible>
  );
};
