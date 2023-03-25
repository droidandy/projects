import React, { FC, useMemo } from 'react';
import { Meta } from 'components';
import { useInstalmentMeta } from 'store/instalment/vehicles/meta';
import { usePageContext } from 'helpers/context/PageContext';
import { pluralizeAds } from 'constants/pluralizeConstants';
import { useCity } from 'store/city';
import { getFormattedCity } from 'helpers/getFormattedCity';

export const VehiclesMetaContainer: FC = () => {
  const { canonical, isCanonical } = usePageContext();
  const {
    meta: { count = 0, installmentPayment = 0 },
  } = useInstalmentMeta();
  const { current } = useCity();

  const meta = useMemo(() => {
    const pluralizeCount = `${count} ${pluralizeAds(count!)}`;
    return {
      title: `Купить авто ${getFormattedCity(
        current,
      )} 🚗 в рассрочку от ${installmentPayment} руб в месяц - продажа новых автомобилей от официального дилера`,
      description: `Купить авто ${getFormattedCity(
        current,
      )} 🚗 в рассрочку от ${installmentPayment} руб в месяц. Продажа автомобилей от официального дилера – более ${pluralizeCount}! Заходите и выбирайте!`,
    };
  }, [current, installmentPayment, count]);

  return <Meta canonical={!isCanonical ? canonical : undefined} {...meta} />;
};
