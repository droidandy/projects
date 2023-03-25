import React from 'react';
import { useCity } from 'store/city';
import { ChooseCityModal } from './components/ChooseCityModal/ChooseCityModal';

export const ChooseCityContainer = () => {
  const { isCityModalOpen, changeCityModalVisibility } = useCity();

  return <ChooseCityModal opened={isCityModalOpen} handleOpened={changeCityModalVisibility} />;
};
