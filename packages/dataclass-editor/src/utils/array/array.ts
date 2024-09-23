export const areArraysIdentical = <T>(array1: Array<T>, array2: Array<T>) => {
  if (array1.length !== array2.length) {
    return false;
  }
  const array1Sorted = [...array1].sort();
  const array2Sorted = [...array2].sort();
  for (let i = 0; i < array1Sorted.length; i++) {
    if (array1Sorted[i] !== array2Sorted[i]) {
      return false;
    }
  }
  return true;
};
