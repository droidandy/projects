import { City } from 'types/City';
import { seoCitiesIds } from 'constants/seoCities';

export const getFormattedCity = (city: City) => {
  if (city.id === 2) return '';
  const isSeoCase = city.id !== null && city.cases.seo !== null && seoCitiesIds.includes(city.id);
  return city.id !== null ? `\n в ${isSeoCase ? city.cases.seo : city.cases.prepositional}` : '';
};
