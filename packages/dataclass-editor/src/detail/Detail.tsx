import type { Field } from '@axonivy/dataclass-editor-protocol';
import { Button, Flex, SidebarHeader } from '@axonivy/ui-components';
import { IvyIcons } from '@axonivy/ui-icons';
import { useAppContext } from '../context/AppContext';
import { FieldProvider } from '../context/FieldContext';
import { useAction } from '../context/useAction';
import { useValidation } from '../context/useValidation';
import { messagesByProperty } from '../data/validation-utils';
import { useKnownHotkeys } from '../utils/hotkeys';
import { DataClassDetailContent } from './dataclass/DataClassDetailContent';
import './Detail.css';
import { FieldDetailContent } from './field/FieldDetailContent';

type DetailProps = {
  title: string;
  helpUrl: string;
};

export const Detail = ({ title, helpUrl }: DetailProps) => {
  const { selectedField, dataClass, setDataClass } = useAppContext();

  let field: Field | undefined;
  let setField: (field: Field) => void = () => {};
  if (selectedField !== undefined) {
    field = dataClass.fields[selectedField];
    setField = (field: Field) => {
      setDataClass(old => {
        const newDataClass = structuredClone(old);
        newDataClass.fields[selectedField] = field;
        return newDataClass;
      });
    };
  }
  const validations = useValidation(field);

  const openUrl = useAction('openUrl');
  const { openHelp: helpText } = useKnownHotkeys();

  return (
    <Flex direction='column' className='panel-content-container detail-container'>
      <SidebarHeader icon={IvyIcons.PenEdit} title={title} className='detail-header'>
        <Button icon={IvyIcons.Help} onClick={() => openUrl(helpUrl)} title={helpText.label} aria-label={helpText.label} />
      </SidebarHeader>
      <Flex direction='column' className='detail-content'>
        {!field ? (
          <DataClassDetailContent />
        ) : (
          <FieldProvider value={{ field, setField, messages: messagesByProperty(validations) }}>
            <FieldDetailContent key={selectedField} />
          </FieldProvider>
        )}
      </Flex>
    </Flex>
  );
};
