export const removeEmptyStrings = (array: Array<string>) => {
  return array.filter(value => value.trim() !== '');
};
