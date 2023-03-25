import { getInstalmentBrands } from 'api/instalment';
import { AsyncAction } from 'types/AsyncAction';
import { VEHICLE_TYPE } from '@marketplace/ui-kit/types';
import { actions as brandsActions } from './reducers';

export const fetchBrandsAction = (): AsyncAction => {
  return function (dispatch, getState, { initial }) {
    dispatch(brandsActions.setLoading(true));
    return getInstalmentBrands(VEHICLE_TYPE.USED, {
      cityId: null,
      // cityId: getState().city.current.id ? [getState().city.current.id!] : null,
    })
      .then(({ data }) => {
        dispatch(brandsActions.setVehiclesBrands({ brands: data, initial }));
      })
      .catch((err) => {
        dispatch(brandsActions.setError(err));
      });
  };
};
