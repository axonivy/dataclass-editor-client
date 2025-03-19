export default {
  defaultNamespace: 'dataclass-editor',
  defaultValue: '__MISSING_TRANSLATION__',
  keepRemoved: false,
  locales: ['en', 'de'],
  output: 'src/translation/$NAMESPACE/$LOCALE.json',
  pluralSeparator: '_',
  input: ['src/**/*.ts', 'src/**/*.tsx'],
  verbose: false,
  sort: true
};
