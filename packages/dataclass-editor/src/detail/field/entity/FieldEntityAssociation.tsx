import type { Association } from '@axonivy/dataclass-editor-protocol';
import { BasicCheckbox, BasicField, BasicSelect, Collapsible, CollapsibleContent, CollapsibleTrigger, Flex } from '@axonivy/ui-components';
import { useAppContext } from '../../../context/AppContext';
import { useEntityField } from '../../../context/FieldContext';
import { useMeta } from '../../../context/useMeta';
import './FieldEntityAssociation.css';
import { FieldEntityCascadeTypeCheckbox } from './FieldEntityCascadeTypeCheckbox';
import { useFieldEntityProperty } from './useFieldEntityProperty';

export const useMappedByFieldName = () => {
  const { field, setField } = useEntityField();
  const setMappedByFieldName = (mappedByFieldName: string) => {
    const newField = structuredClone(field);
    newField.modifiers = newField.modifiers.filter(modifier => modifier === 'PERSISTENT');
    newField.entity.mappedByFieldName = mappedByFieldName;
    setField(newField);
  };
  const isDisabled = field.entity.association !== 'ONE_TO_ONE' && field.entity.association !== 'ONE_TO_MANY';
  return { mappedByFieldName: field.entity.mappedByFieldName, setMappedByFieldName, isDisabled };
};

export const useCardinality = () => {
  const { field, setField } = useEntityField();
  const setCardinality = (association: Association) => {
    const newField = structuredClone(field);
    if (!association || association === 'MANY_TO_ONE') {
      newField.entity.mappedByFieldName = '';
      newField.entity.orphanRemoval = false;
    }
    newField.entity.association = association;
    setField(newField);
  };
  return { cardinality: field.entity.association, setCardinality };
};

const cardinalityItems: Array<{ value: Association; label: string }> = [
  { value: 'ONE_TO_ONE', label: 'One-to-One' },
  { value: 'ONE_TO_MANY', label: 'One-to-Many' },
  { value: 'MANY_TO_ONE', label: 'Many-to-One' }
] as const;

export const FieldEntityAssociation = () => {
  const { context } = useAppContext();
  const { field, setProperty } = useFieldEntityProperty();
  const { mappedByFieldName, setMappedByFieldName, isDisabled: mappedByFieldNameIsDisabled } = useMappedByFieldName();
  const { cardinality, setCardinality } = useCardinality();

  const fieldContext = { ...context, field: field.name };

  const possibleCardinalities = useMeta('meta/scripting/cardinalities', fieldContext, []).data;
  const cardinalities = cardinalityItems.filter(cardinality => possibleCardinalities.includes(cardinality.value));

  const mappedByFields = useMeta('meta/scripting/mappedByFields', fieldContext, []).data.map(mappedByField => ({
    value: mappedByField,
    label: mappedByField
  }));

  return (
    <Collapsible>
      <CollapsibleTrigger>Association</CollapsibleTrigger>
      <CollapsibleContent>
        <Flex direction='column' gap={4}>
          <BasicField label='Cardinality'>
            <BasicSelect value={cardinality} emptyItem items={cardinalities} onValueChange={setCardinality} />
          </BasicField>
          <BasicField label='Cascade'>
            <FieldEntityCascadeTypeCheckbox label='All' cascadeType='ALL' />
            <Flex direction='column' gap={1} className='cascade-types-container'>
              <FieldEntityCascadeTypeCheckbox label='Persist' cascadeType='PERSIST' />
              <FieldEntityCascadeTypeCheckbox label='Merge' cascadeType='MERGE' />
              <FieldEntityCascadeTypeCheckbox label='Remove' cascadeType='REMOVE' />
              <FieldEntityCascadeTypeCheckbox label='Refresh' cascadeType='REFRESH' />
            </Flex>
          </BasicField>
          <BasicField label='Mapped by'>
            <BasicSelect
              value={mappedByFieldName}
              emptyItem
              items={mappedByFields}
              onValueChange={setMappedByFieldName}
              disabled={mappedByFieldNameIsDisabled}
            />
          </BasicField>
          <BasicCheckbox
            label='Remove orphans'
            checked={field.entity.orphanRemoval}
            onCheckedChange={event => setProperty('orphanRemoval', event.valueOf() as boolean)}
            disabled={mappedByFieldNameIsDisabled}
          />
        </Flex>
      </CollapsibleContent>
    </Collapsible>
  );
};
