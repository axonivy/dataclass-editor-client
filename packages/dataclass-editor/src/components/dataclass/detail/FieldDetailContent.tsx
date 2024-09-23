import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
  BasicCheckbox,
  BasicField,
  BasicInput,
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
  Flex,
  Textarea
} from '@axonivy/ui-components';
import { useAppContext } from '../../../context/AppContext';
import type { DataClassField } from '../data/dataclass';
import { classTypeOf } from '../data/dataclass-utils';
import { AnnotationsTable } from './AnnotationsTable';

export const FieldDetailContent = () => {
  const { dataClass, setDataClass, selectedField } = useAppContext();
  const field = selectedField !== undefined && selectedField < dataClass.fields.length ? dataClass.fields[selectedField] : undefined;

  if (!field) {
    return;
  }

  const handleFieldPropertyChange = <FKey extends keyof DataClassField>(key: FKey, value: DataClassField[FKey]) => {
    const newDataClass = structuredClone(dataClass);
    newDataClass.fields[selectedField!][key] = value;
    setDataClass(newDataClass);
  };

  return (
    <Accordion type='single' collapsible defaultValue='general'>
      <AccordionItem value='general'>
        <AccordionTrigger>General</AccordionTrigger>
        <AccordionContent>
          <Flex direction='column' gap={4}>
            <Collapsible defaultOpen={true}>
              <CollapsibleTrigger>Name / Type / Comment</CollapsibleTrigger>
              <CollapsibleContent>
                <Flex direction='column' gap={4}>
                  <BasicField label='Name'>
                    <BasicInput value={field.name} onChange={event => handleFieldPropertyChange('name', event.target.value)} />
                  </BasicField>
                  <BasicField label='Type'>
                    <BasicInput value={field.type} onChange={event => handleFieldPropertyChange('type', event.target.value)} />
                  </BasicField>
                  <BasicField label='Comment'>
                    <Textarea value={field.comment} onChange={event => handleFieldPropertyChange('comment', event.target.value)} />
                  </BasicField>
                </Flex>
              </CollapsibleContent>
            </Collapsible>
            <Collapsible defaultOpen={false}>
              <CollapsibleTrigger>Properties</CollapsibleTrigger>
              <CollapsibleContent>
                <BasicCheckbox
                  label='Persistent'
                  checked={field.modifiers.includes('PERSISTENT')}
                  onCheckedChange={event => {
                    let newModifiers = structuredClone(field.modifiers);
                    if (event.valueOf()) {
                      newModifiers.push('PERSISTENT');
                    } else {
                      newModifiers = newModifiers.filter(modifier => modifier !== 'PERSISTENT');
                    }
                    handleFieldPropertyChange('modifiers', newModifiers);
                  }}
                />
              </CollapsibleContent>
            </Collapsible>
            <AnnotationsTable
              annotations={field.annotations}
              setAnnotations={(annotations: Array<string>) => handleFieldPropertyChange('annotations', annotations)}
            />
          </Flex>
        </AccordionContent>
      </AccordionItem>
      {classTypeOf(dataClass) === 'ENTITY' && field.modifiers.includes('PERSISTENT') && (
        <AccordionItem value='entity'>
          <AccordionTrigger>Entity</AccordionTrigger>
          <AccordionContent>Coming soon...</AccordionContent>
        </AccordionItem>
      )}
    </Accordion>
  );
};
