import { getCities } from 'api/cities';
import { defaultCity } from 'constants/defaultCity';
import { AsyncAction } from 'types/AsyncAction';
import { City } from 'types/City';
import { actions as filterActions } from 'store/catalog/vehicles/filter';
import { actions as brandsActions } from 'store/catalog/brands';
import { actions as cityActions } from './reducers';

export const setCurrentCityAction = (city: City): AsyncAction => {
  return (dispatch, getState, { initial }) => {
    dispatch(cityActions.setCurrentCity({ city, initial }));
  };
};

export const fetchCitiesList = (alias?: string): AsyncAction => {
  return (dispatch, getState, { initial }) => {
    dispatch(cityActions.setLoading(true));
    return getCities()
      .then(async ({ data: cities }) => {
        dispatch(cityActions.setCityList({ cities, initial }));
        if (alias) {
          const matchedCity =
            [...cities.primary, ...cities.secondary].find(({ alias: iterableAlias }) => iterableAlias === alias) ||
            defaultCity;

          await dispatch(setCurrentCityAction(matchedCity));
        }
      })
      .catch((err) => {
        dispatch(cityActions.setError(err));
      });
  };
};

export const changeCityModalVisibility = (isCityModalVisible: boolean): AsyncAction => {
  return (dispatch, getState, { initial }) => {
    dispatch(cityActions.setCityModalOpen({ initial, isCityModalOpen: isCityModalVisible }));
  };
};

export const changeExtraCoverageRadius =
  (val: number): AsyncAction =>
  (dispatch, getState) => {
    const {
      vehiclesFilter: { initial: filterInitial },
      brandsNew: { initial: brandsInitial },
    } = getState();
    if (filterInitial) dispatch(filterActions.setInitial(false));
    if (brandsInitial) dispatch(brandsActions.setInitial(false));
    dispatch(cityActions.setExtraCoverageRadius(val));
  };
