import React from 'react';
import { useGetPromoSlides } from '../Main/BottomSlider';
import { LoaderScreen } from '../../components/Loader/Loader';
import { ErrorScreen } from '../../components/text/Error/Error';
import { DataContainer } from '../layouts/DataContainer/DataContainer';

export const PromoActions = () => {
  const { loading, slides, error } = useGetPromoSlides();

  if (loading) {
    return <LoaderScreen label="Загрузка списка акций" />;
  }

  if (error) {
    return <ErrorScreen text="Не удалось загрузить список акций" />;
  }

  return <DataContainer>{slides}</DataContainer>;
};
