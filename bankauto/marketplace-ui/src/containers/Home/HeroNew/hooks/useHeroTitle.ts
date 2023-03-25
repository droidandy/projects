import { useMemo } from 'react';
import { HomeTab } from 'types/Home';
import { City } from 'types/City';
import { useVehicleCreateValues } from 'store/catalog/create/values';
import { useCity } from 'store/city';
import { getFormattedCity } from 'helpers/getFormattedCity';

export const useHeroTitle = (title: string, activeTab: HomeTab) => {
  const { current, list } = useCity();
  const {
    state: {
      values: { city },
    },
  } = useVehicleCreateValues();

  const currentCity = useMemo(() => {
    if (activeTab === HomeTab.SELL || activeTab === HomeTab.SERVICE) {
      const selectedCity = [...list.primary, ...list.secondary].find(({ id }: City) => id === city);
      return selectedCity || current;
    } else {
      return current;
    }
  }, [city, list, current, activeTab]);

  return title.replace('{{city}}', getFormattedCity(currentCity));
};
