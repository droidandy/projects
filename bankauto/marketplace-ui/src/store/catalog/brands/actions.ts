import { VEHICLE_TYPE } from '@marketplace/ui-kit/types';
import { AsyncAction } from 'types/AsyncAction';
import { getCatalogBrands } from 'api/car';
import { actions as brandsActions } from './reducers';

export const fetchBrandsAction = (type?: VEHICLE_TYPE | null): AsyncAction => {
  return function (dispatch, getState, { initial }) {
    dispatch(brandsActions.setLoading(true));
    const {
      city: { current, extraCoverageRadius },
    } = getState();

    const preparedParams = {
      cityId: current.id ? [current.id!] : null,
      distance: extraCoverageRadius,
    };

    return getCatalogBrands(preparedParams, type)
      .then(({ data }) => {
        dispatch(brandsActions.setVehiclesBrands({ type: type || 'all', brands: data, initial }));
      })
      .catch((err) => {
        dispatch(brandsActions.setError(err));
      });
  };
};
