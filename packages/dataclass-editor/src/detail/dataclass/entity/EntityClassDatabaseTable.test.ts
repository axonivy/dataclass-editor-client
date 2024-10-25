import { customRenderHook } from '../../../context/test-utils/test-utils';
import type { EntityClass } from '@axonivy/dataclass-editor-protocol';
import { useEntityProperty } from './EntityClassDatabaseTable';

test('useEntityProperty', () => {
  const entityClass = { entity: { tableName: 'tableName' } } as EntityClass;
  let newEntityClass = {} as EntityClass;
  const view = customRenderHook(() => useEntityProperty(), {
    wrapperProps: { entityClassContext: { entityClass, setEntityClass: entityClass => (newEntityClass = entityClass) } }
  });

  const originalEntityClass = structuredClone(entityClass);
  view.result.current('tableName', 'NewTableName');
  expect(entityClass).toEqual(originalEntityClass);

  expect(newEntityClass.entity.tableName).toEqual('NewTableName');
});
