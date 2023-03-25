import { getBrand } from 'api';
import { getFilterData } from 'api/catalog';
import { VEHICLE_TYPE } from '@marketplace/ui-kit/types';
import { AsyncAction } from 'types/AsyncAction';
import { actions as brandActions } from './reducers';

export const fetchBrandDataAction =
  (type: VEHICLE_TYPE, alias: string): AsyncAction =>
  async (dispatch, getState, { initial }) => {
    dispatch(brandActions.setLoading(true));
    // TODO remove fetch form data when api could apply alias
    const { data: filterData } = await getFilterData({});
    const brand = filterData.brands.find((item) => item.alias === alias);
    if (!brand) {
      return dispatch(brandActions.setError(new Error('Бренд не найден!')));
    }
    return getBrand(type, brand.id)
      .then(({ data }) => {
        dispatch(brandActions.setBrandData({ brand: { ...data, type }, initial }));
      })
      .catch((err) => {
        dispatch(brandActions.setError(err));
      });
  };
