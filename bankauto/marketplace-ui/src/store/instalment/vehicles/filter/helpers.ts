import { AutocompleteOption } from 'components/Autocomplete/types';
import { Node, VehiclesFilterData } from '@marketplace/ui-kit/types';
import difference from 'lodash/difference';
import { VehiclesFilterValues } from 'types/VehiclesFilterValues';

function hasDiff<Type extends Node>(data: Type[], values: AutocompleteOption[]): boolean {
  const dataItems = data.map(({ id }) => id);
  const valueItems = values.map(({ value }) => value) ?? [];

  return !!difference(valueItems, dataItems).length;
}

function getValuesToFlush(data: VehiclesFilterData, values: VehiclesFilterValues): Partial<VehiclesFilterValues> {
  const FROM_PART = 'From';
  const TO_PART = 'To';
  const arrayFields = ['brands', 'models', 'bodyTypes', 'transmissions', 'engines', 'drives'] as const;
  const fromFields = ['powerFrom', 'yearFrom', 'volumeFrom'] as const;
  const toFields = ['powerTo', 'yearTo', 'volumeTo'] as const;
  const valuesToFlush: Partial<VehiclesFilterValues> = {};

  Object.keys(data).forEach((value) => {
    if (arrayFields.includes(value as typeof arrayFields[number])) {
      const field = value as typeof arrayFields[number];

      const dataItems = data[field] ?? [];
      const valueItems = values[field] ?? [];

      if (hasDiff(dataItems, valueItems)) {
        valuesToFlush[field] = null;
      }
    }

    if ([...fromFields, ...toFields].includes(value as typeof fromFields[number] | typeof toFields[number])) {
      const field = value as typeof fromFields[number] | typeof toFields[number];
      const commonFieldName =
        field.indexOf(FROM_PART) !== -1 ? field.replace(FROM_PART, '') : field.replace(TO_PART, '');
      const toField = `${commonFieldName}${TO_PART}` as typeof toFields[number];

      if (data[toField] < +values[field]!) {
        valuesToFlush[field] = null;
      }
    }

    if (value === 'colors') {
      if (difference(values.colors ?? [], data.colors?.map(({ id }) => id) ?? []).length) {
        valuesToFlush.colors = null;
      }
    }
  });

  return valuesToFlush;
}

export { getValuesToFlush };
