import { VehiclesFilterValues } from 'types/VehiclesFilterValues';

export const convertFormToFilterValues = (values: VehiclesFilterValues, fieldsToConvert: string[]) =>
  fieldsToConvert.reduce(
    (acc, fieldName) => {
      const value = acc[fieldName] as unknown;

      const updatedValues = acc;
      let valueToAssign = null;

      if (Array.isArray(value)) {
        valueToAssign = value;
      } else if (typeof value === 'object' && value !== null) {
        valueToAssign = [value];
      }

      if (typeof value === 'number' || typeof value === 'string') {
        valueToAssign = [{ value }];
      }

      updatedValues[fieldName] = valueToAssign;
      return updatedValues;
    },
    { ...values },
  );
