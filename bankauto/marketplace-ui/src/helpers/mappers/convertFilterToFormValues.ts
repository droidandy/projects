import { VehiclesFilterValues } from 'types/VehiclesFilterValues';

export const convertFilterToFormValues = (
  values: VehiclesFilterValues,
  autocompleteFields: string[] = [],
  selectFields: string[] = [],
) => {
  return [...autocompleteFields, ...selectFields].reduce(
    (acc, fieldName, i) => {
      const value = acc[fieldName] as unknown;

      const updatedValues = acc;
      let valueToAssign = null;
      const isAutocomplete = i < autocompleteFields.length;

      if (Array.isArray(value)) {
        valueToAssign = isAutocomplete ? value[0] : value[0]?.value;
      } else if (typeof value === 'object' && value !== null) {
        valueToAssign = isAutocomplete ? value : (value as any).value;
      }

      if (typeof value === 'number' || typeof value === 'string') {
        valueToAssign = isAutocomplete ? { value } : value;
      }

      updatedValues[fieldName] = valueToAssign;
      return updatedValues;
    },
    { ...values },
  );
};
