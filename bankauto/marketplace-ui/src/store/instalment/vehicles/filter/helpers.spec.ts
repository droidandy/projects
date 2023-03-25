import { VehiclesFilterData } from '@marketplace/ui-kit/types';
import { VehiclesFilterValues } from 'types/VehiclesFilterValues';
import { getValuesToFlush } from './helpers';

describe('getValuesToFlush', () => {
  it('should return brands', () => {
    const data: Partial<VehiclesFilterData> = {
      brands: [
        { id: 2, name: 'BMW', status: null },
        { id: 3, name: 'Skoda', status: null },
      ],
    };
    const values: VehiclesFilterValues = {
      brands: [{ id: 1, name: 'Audi', status: null }],
    };
    const valuesToFlush = {
      brands: null,
    };

    expect(getValuesToFlush(data, values)).toEqual(valuesToFlush);
  });

  it('should return brands and models', () => {
    const data: Partial<VehiclesFilterData> = {
      brands: [
        { id: 2, name: 'BMW', status: null },
        { id: 3, name: 'Skoda', status: null },
      ],
      models: [
        { id: 4, name: 'X5', status: null, brandId: 2 },
        { id: 5, name: 'Octavia', status: null, brandId: 3 },
      ],
    };
    const values: VehiclesFilterValues = {
      brands: [{ id: 1, name: 'Audi', status: null }],
      models: [{ id: 1, name: 'A4', status: null, brandId: 1 }],
    };
    const valuesToFlush = {
      brands: null,
      models: null,
    };

    expect(getValuesToFlush(data, values)).toEqual(valuesToFlush);
  });

  it('should return yearTo and powerTo', () => {
    const data: Partial<VehiclesFilterData> = {
      yearTo: 2016,
      powerTo: 152,
    };
    const values: VehiclesFilterValues = {
      yearTo: 2021,
      powerTo: 220,
    };
    const valuesToFlush = {
      yearTo: null,
      powerTo: null,
    };

    expect(getValuesToFlush(data, values)).toEqual(valuesToFlush);
  });

  it('should not return yearFrom but return volumeFrom', () => {
    const data: Partial<VehiclesFilterData> = {
      yearFrom: 2019,
      yearTo: 2021,
      volumeFrom: 1.4,
      volumeTo: 1.8,
    };
    const values: VehiclesFilterValues = {
      yearFrom: 2019,
      volumeFrom: 2.0,
    };
    const valuesToFlush = {
      volumeFrom: null,
    };

    expect(getValuesToFlush(data, values)).toEqual(valuesToFlush);
  });

  it('should return colors', () => {
    const data: Partial<VehiclesFilterData> = {
      colors: [
        { id: 3, code: '#000', name: 'Black', status: null },
        { id: 4, code: '#fff', name: 'White', status: null },
        { id: 5, code: '#f0f', name: 'Pink', status: null },
      ],
    };
    const values: VehiclesFilterValues = {
      colors: [1, 2],
    };
    const valuesToFlush = {
      colors: null,
    };

    expect(getValuesToFlush(data, values)).toEqual(valuesToFlush);
  });
});
