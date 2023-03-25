import { GetServerSidePropsContext } from 'next';
import { AnyAction, Dispatch } from 'redux';
import { DispatchType, ReduxExtraArgument, StateModel, StoreType } from 'store/types';
import { fetchCitiesList, setCurrentCityAction } from 'store/city';
import { City } from 'types/City';
import { VALID_DOMAINS } from 'constants/validDomains';
import { CITY_COOKIE, getCityCookie } from './cookies/city';

export const checkAndSetCurrentCity = async (
  store: StoreType<StateModel, ReduxExtraArgument, AnyAction>,
  dispatch: Dispatch<AnyAction> & DispatchType<StateModel, ReduxExtraArgument, AnyAction>,
  context?: GetServerSidePropsContext<any>,
) => {
  let city = ((context ? (context.req.cookies || (context.req as any).cookie || {})[CITY_COOKIE] : getCityCookie()) ||
    {}) as City;

  if (typeof city === 'string') {
    city = JSON.parse(city);
  }

  const urlCityAlias = (
    (context
      ? (context.req.headers['x-forwarded-host'] as string) || context.req.headers.host
      : window.location.host) || ''
  ).split('.')[0];

  const isValidDomain = VALID_DOMAINS.some((item) => urlCityAlias.includes(item));

  if (city.alias === urlCityAlias || (isValidDomain && (city.alias === 'moskva' || city.alias === 'russia'))) {
    await dispatch(setCurrentCityAction(city));
    return true;
  }

  await dispatch(fetchCitiesList(urlCityAlias));
  const isIssetCity = isValidDomain || store.getState().city.current.alias === urlCityAlias;

  return isIssetCity;
};
