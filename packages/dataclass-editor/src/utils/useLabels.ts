import type { Association, CascadeType, Modifier } from '@axonivy/dataclass-editor-protocol';
import { useMemo } from 'react';
import { useTranslation } from 'react-i18next';

export const useCascadeTypes = (): { [key in CascadeType]: string } => {
  const { t } = useTranslation();
  return useMemo(
    () => ({
      ALL: t('cascade.all'),
      PERSIST: t('cascade.persist'),
      MERGE: t('cascade.merge'),
      REMOVE: t('cascade.remove'),
      REFRESH: t('cascade.refresh')
    }),
    [t]
  );
};

export const useModifiers = (): { [key in Modifier]: string } => {
  const { t } = useTranslation();
  return useMemo(
    () => ({
      PERSISTENT: t('modifier.persistent'),
      ID: t('modifier.iD'),
      GENERATED: t('modifier.generated'),
      NOT_NULLABLE: t('modifier.notNullable'),
      UNIQUE: t('modifier.unique'),
      NOT_UPDATEABLE: t('modifier.notUpdateable'),
      NOT_INSERTABLE: t('modifier.notInsertable'),
      VERSION: t('modifier.version')
    }),
    [t]
  );
};

export const useCardinalities = (): { [key in Association]: string } => {
  const { t } = useTranslation();
  return useMemo(
    () => ({
      ONE_TO_ONE: t('cardinality.oneToOne'),
      ONE_TO_MANY: t('cardinality.oneToMany'),
      MANY_TO_ONE: t('cardinality.manyToOne')
    }),
    [t]
  );
};
