import {
  BasicField,
  BasicInput,
  Collapsible,
  CollapsibleContent,
  CollapsibleState,
  CollapsibleTrigger,
  Flex,
  type MessageData
} from '@axonivy/ui-components';
import { combineMessagesOfProperties } from '../../../data/validation-utils';
import { FieldModifierCheckbox } from '../FieldModifierCheckbox';
import { useFieldEntityProperty } from './useFieldEntityProperty';

const DATABASE_TYPE_LENGHTS = {
  String: '255',
  BigInteger: '19,2',
  BigDecimal: '19,2'
} as const;
export const typeCanHaveDatabaseLength = (type: string) => Object.hasOwn(DATABASE_TYPE_LENGHTS, type);
export const defaultLengthOfType = (type: string) => DATABASE_TYPE_LENGHTS[type as keyof typeof DATABASE_TYPE_LENGHTS] || '';

type FieldEntityDatabaseFieldProps = {
  messagesByProperty: Record<string, MessageData>;
};

export const FieldEntityDatabaseField = ({ messagesByProperty }: FieldEntityDatabaseFieldProps) => {
  const { field, setProperty } = useFieldEntityProperty();

  const mappedByFieldNameIsSet = field.entity.mappedByFieldName !== '';
  const canHaveDatabaseLength = typeCanHaveDatabaseLength(field.type);

  return (
    <Collapsible
      defaultOpen={
        (!mappedByFieldNameIsSet && field.entity.databaseName !== '') ||
        (canHaveDatabaseLength && field.entity.databaseFieldLength !== '') ||
        field.modifiers.some(modifier => modifier !== 'PERSISTENT')
      }
    >
      <CollapsibleTrigger
        state={
          <CollapsibleState
            messages={combineMessagesOfProperties(messagesByProperty, 'DB_FIELD_NAME', 'DB_FIELD_LENGTH', 'PROPERTIES_ENTITY')}
          />
        }
      >
        Database Field
      </CollapsibleTrigger>
      <CollapsibleContent>
        <Flex direction='column' gap={4}>
          <BasicField label='Name' message={messagesByProperty.DB_FIELD_NAME}>
            <BasicInput
              value={mappedByFieldNameIsSet ? '' : field.entity.databaseName}
              onChange={event => setProperty('databaseName', event.target.value)}
              placeholder={mappedByFieldNameIsSet ? '' : field.name}
              disabled={mappedByFieldNameIsSet}
            />
          </BasicField>
          <BasicField label='Length' message={messagesByProperty.DB_FIELD_LENGTH}>
            <BasicInput
              value={canHaveDatabaseLength ? field.entity.databaseFieldLength : ''}
              onChange={event => setProperty('databaseFieldLength', event.target.value)}
              placeholder={defaultLengthOfType(field.type)}
              disabled={!canHaveDatabaseLength}
            />
          </BasicField>
          <BasicField label='Properties' message={messagesByProperty.PROPERTIES_ENTITY} data-testid='database-field-properties'>
            <FieldModifierCheckbox label='ID' modifier='ID' />
            <FieldModifierCheckbox label='Generated' modifier='GENERATED' />
            <FieldModifierCheckbox label='Not nullable' modifier='NOT_NULLABLE' />
            <FieldModifierCheckbox label='Unique' modifier='UNIQUE' />
            <FieldModifierCheckbox label='Not updateable' modifier='NOT_UPDATEABLE' />
            <FieldModifierCheckbox label='Not insertable' modifier='NOT_INSERTABLE' />
            <FieldModifierCheckbox label='Version' modifier='VERSION' />
          </BasicField>
        </Flex>
      </CollapsibleContent>
    </Collapsible>
  );
};
