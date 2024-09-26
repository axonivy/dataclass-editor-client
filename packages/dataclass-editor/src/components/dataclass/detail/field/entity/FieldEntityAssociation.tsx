import {
  BasicCheckbox,
  BasicField,
  BasicSelect,
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
  Flex,
  Input
} from '@axonivy/ui-components';
import { useAppContext } from '../../../../../context/AppContext';
import { useFieldContext } from '../../../../../context/FieldContext';
import type { DataClassFieldEntityAssociation } from '../../../data/dataclass';
import {
  handleFieldEntityAssociationChange,
  handleFieldEntityMappedByFieldNameChange,
  handleFieldEntityPropertyChange,
  isEntity,
  isEntityField
} from '../../../data/dataclass-utils';
import { FieldEntityCascadeTypeCheckbox } from './FieldEntityCascadeTypeCheckbox';

export const FieldEntityAssociation = () => {
  const { dataClass, setDataClass } = useAppContext();
  const { field, selectedField } = useFieldContext();
  if (!isEntity(dataClass) || !isEntityField(field)) {
    return;
  }

  const associationCanBeMappedByFieldName = field.entity.association !== 'ONE_TO_ONE' && field.entity.association !== 'ONE_TO_MANY';

  return (
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
              onValueChange={value =>
                handleFieldEntityAssociationChange(value as DataClassFieldEntityAssociation, dataClass, setDataClass, selectedField)
              }
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
              onChange={event => handleFieldEntityMappedByFieldNameChange(event.target.value, dataClass, setDataClass, selectedField)}
              disabled={associationCanBeMappedByFieldName}
            />
          </BasicField>
          <BasicCheckbox
            label='Remove orphans'
            checked={field.entity.orphanRemoval}
            onCheckedChange={event =>
              handleFieldEntityPropertyChange('orphanRemoval', event.valueOf() as boolean, dataClass, setDataClass, selectedField)
            }
            disabled={associationCanBeMappedByFieldName}
          />
        </Flex>
      </CollapsibleContent>
    </Collapsible>
  );
};
