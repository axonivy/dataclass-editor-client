import { BasicField, Collapsible, CollapsibleContent, CollapsibleTrigger, Flex, Input } from '@axonivy/ui-components';
import { useAppContext } from '../../../../../context/AppContext';
import { useFieldContext } from '../../../../../context/FieldContext';
import { dataClassIDTypes, dataClassVersionTypes } from '../../../data/dataclass';
import { handleFieldEntityPropertyChange, isEntity, isEntityField } from '../../../data/dataclass-utils';
import { FieldModifierCheckbox } from '../FieldModifierCheckbox';

export const FieldEntityDatabaseField = () => {
  const { dataClass, setDataClass } = useAppContext();
  const { field, selectedField } = useFieldContext();
  if (!isEntity(dataClass) || !isEntityField(field)) {
    return;
  }

  const mappedByFieldNameIsSet = field.entity.mappedByFieldName !== '';
  const typeCanHaveDatabaseFieldLength = field.type !== 'String' && field.type !== 'BigInteger' && field.type !== 'BigDecimal';

  const modifersContainID = field.modifiers.includes('ID');
  const modifiersContainVersion = field.modifiers.includes('VERSION');
  const modifiersContainIDOrVersion = modifersContainID || modifiersContainVersion;

  return (
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
              onChange={event =>
                handleFieldEntityPropertyChange('databaseName', event.target.value, dataClass, setDataClass, selectedField)
              }
              placeholder={mappedByFieldNameIsSet ? '' : field.name}
              disabled={mappedByFieldNameIsSet}
            />
          </BasicField>
          <BasicField label='Length'>
            <Input
              value={typeCanHaveDatabaseFieldLength ? '' : field.entity.databaseFieldLength}
              onChange={event =>
                handleFieldEntityPropertyChange('databaseFieldLength', event.target.value, dataClass, setDataClass, selectedField)
              }
              placeholder={field.type === 'String' ? '255' : field.type === 'BigInteger' || field.type === 'BigDecimal' ? '19,2' : ''}
              disabled={typeCanHaveDatabaseFieldLength}
            />
          </BasicField>
          <BasicField label='Properties'>
            <FieldModifierCheckbox
              label='ID'
              modifier='ID'
              disabled={modifiersContainVersion || !dataClassIDTypes.includes(field.type) || mappedByFieldNameIsSet}
            />
            <FieldModifierCheckbox label='Generated' modifier='GENERATED' disabled={!modifersContainID || mappedByFieldNameIsSet} />
            <FieldModifierCheckbox
              label='Not nullable'
              modifier='NOT_NULLABLE'
              disabled={modifiersContainIDOrVersion || mappedByFieldNameIsSet}
            />
            <FieldModifierCheckbox label='Unique' modifier='UNIQUE' disabled={modifiersContainIDOrVersion || mappedByFieldNameIsSet} />
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
  );
};
