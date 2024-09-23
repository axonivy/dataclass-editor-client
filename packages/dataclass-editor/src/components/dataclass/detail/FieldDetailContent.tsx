import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
  BasicCheckbox,
  BasicField,
  BasicInput,
  BasicSelect,
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
  Flex,
  Input,
  Textarea
} from '@axonivy/ui-components';
import { useAppContext } from '../../../context/AppContext';
import {
  dataClassIDTypes,
  dataClassVersionTypes,
  type DataClassField,
  type DataClassFieldEntity,
  type DataClassFieldEntityAssociation
} from '../data/dataclass';
import {
  handleFieldEntityAssociationChange,
  handleFieldEntityMappedByFieldNameChange,
  handleFieldEntityPropertyChange,
  handleFieldPropertyChange,
  handleFieldTypeChange,
  isEntity,
  isEntityField
} from '../data/dataclass-utils';
import { AnnotationsTable } from './AnnotationsTable';
import './FieldDetailContent.css';
import { FieldEntityCascadeTypeCheckbox } from './FieldEntityCascadeTypeCheckbox';
import { FieldModifierCheckbox } from './FieldModifierCheckbox';

export const FieldDetailContent = () => {
  const { dataClass, setDataClass, selectedField } = useAppContext();
  if (selectedField === undefined) {
    return;
  }

  const field = selectedField < dataClass.fields.length ? dataClass.fields[selectedField] : undefined;
  if (!field) {
    return;
  }

  const entity = isEntity(dataClass);

  const onPropertyChange = <FKey extends keyof DataClassField>(key: FKey, value: DataClassField[FKey]) =>
    handleFieldPropertyChange(key, value, dataClass, setDataClass, selectedField);

  const onEntityPropertyChange = <FEKey extends keyof DataClassFieldEntity>(key: FEKey, value: DataClassFieldEntity[FEKey]) => {
    if (entity) {
      handleFieldEntityPropertyChange(key, value, dataClass, setDataClass, selectedField);
    }
  };

  let mappedByFieldNameIsSet = false;
  const typeCanHaveDatabaseFieldLength = field.type !== 'String' && field.type !== 'BigInteger' && field.type !== 'BigDecimal';
  let associationCanBeMappedByFieldName = false;
  const modifersContainID = field.modifiers.includes('ID');
  const modifiersContainVersion = field.modifiers.includes('VERSION');
  const modifiersContainIDOrVersion = modifersContainID || modifiersContainVersion;

  if (entity) {
    const fieldEntity = dataClass.fields[selectedField].entity;
    mappedByFieldNameIsSet = fieldEntity.mappedByFieldName !== '';
    associationCanBeMappedByFieldName = fieldEntity.association !== 'ONE_TO_ONE' && fieldEntity.association !== 'ONE_TO_MANY';
  }

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
                    <BasicInput value={field.name} onChange={event => onPropertyChange('name', event.target.value)} />
                  </BasicField>
                  <BasicField label='Type'>
                    <BasicInput
                      value={field.type}
                      onChange={event => handleFieldTypeChange(event.target.value, dataClass, setDataClass, selectedField)}
                    />
                  </BasicField>
                  <BasicField label='Comment'>
                    <Textarea value={field.comment} onChange={event => onPropertyChange('comment', event.target.value)} />
                  </BasicField>
                </Flex>
              </CollapsibleContent>
            </Collapsible>
            <Collapsible defaultOpen={false}>
              <CollapsibleTrigger>Properties</CollapsibleTrigger>
              <CollapsibleContent>
                <FieldModifierCheckbox label='Persistent' modifier='PERSISTENT' />
              </CollapsibleContent>
            </Collapsible>
            <AnnotationsTable
              annotations={field.annotations}
              setAnnotations={(annotations: Array<string>) => onPropertyChange('annotations', annotations)}
            />
          </Flex>
        </AccordionContent>
      </AccordionItem>
      {isEntityField(field) && field.modifiers.includes('PERSISTENT') && (
        <AccordionItem value='entity'>
          <AccordionTrigger>Entity</AccordionTrigger>
          <AccordionContent>
            <Flex direction='column' gap={4}>
              <Collapsible
                defaultOpen={
                  !(mappedByFieldNameIsSet || field.entity.databaseName === '') ||
                  !(typeCanHaveDatabaseFieldLength || field.entity.databaseFieldLength === '') ||
                  field.modifiers.some(modifier => modifier !== 'PERSISTENT')
                }
              >
                <CollapsibleTrigger>Database Field</CollapsibleTrigger>
                <CollapsibleContent>
                  <Flex direction='column' gap={4}>
                    <BasicField label='Name'>
                      <Input
                        value={mappedByFieldNameIsSet ? '' : field.entity.databaseName}
                        onChange={event => onEntityPropertyChange('databaseName', event.target.value)}
                        placeholder={mappedByFieldNameIsSet ? '' : field.name}
                        disabled={mappedByFieldNameIsSet}
                      />
                    </BasicField>
                    <BasicField label='Length'>
                      <Input
                        value={typeCanHaveDatabaseFieldLength ? '' : field.entity.databaseFieldLength}
                        onChange={event => onEntityPropertyChange('databaseFieldLength', event.target.value)}
                        placeholder={
                          field.type === 'String' ? '255' : field.type === 'BigInteger' || field.type === 'BigDecimal' ? '19,2' : ''
                        }
                        disabled={typeCanHaveDatabaseFieldLength}
                      />
                    </BasicField>
                    <BasicField label='Properties'>
                      <FieldModifierCheckbox
                        label='ID'
                        modifier='ID'
                        disabled={modifiersContainVersion || !dataClassIDTypes.includes(field.type) || mappedByFieldNameIsSet}
                      />
                      <FieldModifierCheckbox
                        label='Generated'
                        modifier='GENERATED'
                        disabled={!modifersContainID || mappedByFieldNameIsSet}
                      />
                      <FieldModifierCheckbox
                        label='Not nullable'
                        modifier='NOT_NULLABLE'
                        disabled={modifiersContainIDOrVersion || mappedByFieldNameIsSet}
                      />
                      <FieldModifierCheckbox
                        label='Unique'
                        modifier='UNIQUE'
                        disabled={modifiersContainIDOrVersion || mappedByFieldNameIsSet}
                      />
                      <FieldModifierCheckbox
                        label='Not updateable'
                        modifier='NOT_UPDATEABLE'
                        disabled={modifiersContainIDOrVersion || mappedByFieldNameIsSet}
                      />
                      <FieldModifierCheckbox
                        label='Not insertable'
                        modifier='NOT_INSERTABLE'
                        disabled={modifiersContainIDOrVersion || mappedByFieldNameIsSet}
                      />
                      <FieldModifierCheckbox
                        label='Version'
                        modifier='VERSION'
                        disabled={modifersContainID || !dataClassVersionTypes.includes(field.type) || mappedByFieldNameIsSet}
                      />
                    </BasicField>
                  </Flex>
                </CollapsibleContent>
              </Collapsible>
              <Collapsible>
                <CollapsibleTrigger>Association</CollapsibleTrigger>
                <CollapsibleContent>
                  <Flex direction='column' gap={4}>
                    <BasicField label='Cardinality'>
                      <BasicSelect
                        value={field.entity.association}
                        emptyItem
                        items={[
                          { value: 'ONE_TO_ONE', label: 'One-to-One' },
                          { value: 'ONE_TO_MANY', label: 'One-to-Many' },
                          { value: 'MANY_TO_ONE', label: 'Many-to-One' }
                        ]}
                        onValueChange={value => {
                          if (entity) {
                            handleFieldEntityAssociationChange(
                              value as DataClassFieldEntityAssociation,
                              dataClass,
                              setDataClass,
                              selectedField
                            );
                          }
                        }}
                      />
                    </BasicField>
                    <BasicField label='Cascade' className='cascade-types-container'>
                      <FieldEntityCascadeTypeCheckbox label='All' cascadeType='ALL' />
                      <FieldEntityCascadeTypeCheckbox label='Persist' cascadeType='PERSIST' />
                      <FieldEntityCascadeTypeCheckbox label='Merge' cascadeType='MERGE' />
                      <FieldEntityCascadeTypeCheckbox label='Remove' cascadeType='REMOVE' />
                      <FieldEntityCascadeTypeCheckbox label='Refresh' cascadeType='REFRESH' />
                    </BasicField>
                    <BasicField label='Mapped by'>
                      <Input
                        value={field.entity.mappedByFieldName}
                        onChange={event => {
                          if (entity) {
                            handleFieldEntityMappedByFieldNameChange(event.target.value, dataClass, setDataClass, selectedField);
                          }
                        }}
                        disabled={associationCanBeMappedByFieldName}
                      />
                    </BasicField>
                    <BasicCheckbox
                      label='Remove orphans'
                      checked={field.entity.orphanRemoval}
                      onCheckedChange={event => onEntityPropertyChange('orphanRemoval', event.valueOf() as boolean)}
                      disabled={associationCanBeMappedByFieldName}
                    />
                  </Flex>
                </CollapsibleContent>
              </Collapsible>
            </Flex>
          </AccordionContent>
        </AccordionItem>
      )}
    </Accordion>
  );
};
