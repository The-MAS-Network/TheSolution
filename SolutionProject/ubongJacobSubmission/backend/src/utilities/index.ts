export const omitValuesFromObj = <T extends object, K extends keyof T>(
  param: T,
  keysToRemove: K[]
): Omit<T, K> => {
  return Object.entries(param).reduce((acc, [key, value]) => {
    return keysToRemove.includes(key as K) ? acc : { ...acc, [key]: value };
  }, {} as Omit<T, K>);
};
