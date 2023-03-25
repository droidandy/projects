import { VehicleSortType } from 'types/VehicleSortTypes';
import { SortType } from '../../types/Sort';

function sortParamsMapper(sortValue: VehicleSortType) {
  const result = {
    [VehicleSortType.PRICE_DESC]: {
      'sort[price]': SortType.DESC,
    },
    [VehicleSortType.PRICE_ASC]: {
      'sort[price]': SortType.ASC,
    },
    [VehicleSortType.PRODUCTION_YEAR_DESC]: {
      'sort[production_year]': SortType.DESC,
    },
    [VehicleSortType.PRODUCTION_YEAR_ASC]: {
      'sort[production_year]': SortType.ASC,
    },
    [VehicleSortType.MILEAGE_DESC]: {
      'sort[mileage]': SortType.DESC,
    },
    [VehicleSortType.MILEAGE_ASC]: {
      'sort[mileage]': SortType.ASC,
    },
    [VehicleSortType.CREATED_DESC]: {
      'sort[created_at]': SortType.DESC,
    },
    [VehicleSortType.CREATED_ASC]: {
      'sort[created_at]': SortType.ASC,
    },
  };
  return result[sortValue];
}

export { sortParamsMapper };
