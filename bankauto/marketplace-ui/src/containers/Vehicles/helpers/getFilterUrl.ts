import { VEHICLE_TYPE_ID } from '@marketplace/ui-kit/types';
import { VehiclesFilterValues } from 'types/VehiclesFilterValues';
import { initialState } from 'store/initial-state';
import { stringifyFilterQuery } from 'helpers/filter';

// export const getFilterUrl = (props: Partial<VehiclesFilterValues>) =>
//   `/vehicles/?${stringifyFilterQuery({ ...initialState.vehiclesFilter.values, ...props })}`;
export const getFilterUrl = (props: Partial<VehiclesFilterValues>) => {
  const typeId = props.type || VEHICLE_TYPE_ID.NEW;
  const type = typeId === VEHICLE_TYPE_ID.NEW ? 'new' : 'used';
  const base = `/car/${type}`;
  return `${base}/?${stringifyFilterQuery({ ...initialState.vehiclesFilter.values, ...props })}`;
};
