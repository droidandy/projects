import { City } from 'types/City';
import { cookies } from './cookies';
import { getCookieRootDomain } from './getCookieRootDomain';

export const CITY_COOKIE = 'current_city';

export const getCityCookie = () => {
  const cookie = cookies.get(CITY_COOKIE);

  if (cookie) {
    const { id, name, alias } = cookie;

    return { id, name, alias };
  }

  return null;
};

export const setCityCookie = (city: City) => {
  cookies.set(CITY_COOKIE, city, {
    path: '/',
    domain: getCookieRootDomain(),
  });
};
