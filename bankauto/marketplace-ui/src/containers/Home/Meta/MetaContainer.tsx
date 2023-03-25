import React, { memo, useMemo } from 'react';
import { usePageContext } from 'helpers/context/PageContext';
import { pluralizeAds, pluralizeOffer } from 'constants/pluralizeConstants';
import { useVehiclesMeta } from 'store/catalog/vehicles/meta';
import { useHomeState } from 'store/home';
import { HomeTab } from 'types/Home';
import { Meta } from 'components/Meta';
import { useInstalmentMeta } from 'store/instalment/vehicles/meta';
import { useCity } from 'store/city';
import { getFormattedCity } from 'helpers/getFormattedCity';

export const MetaContainer = memo(() => {
  const { canonical, isCanonical } = usePageContext();
  const { current } = useCity();
  const {
    meta: { count: carsCount = 0, minPrice = 0 },
  } = useVehiclesMeta();
  const {
    meta: { count: offersCount, minPrice: installmentMonthlyPayment },
  } = useInstalmentMeta();
  const { activeTab } = useHomeState();
  const metaTags = useMemo(() => {
    if (activeTab === HomeTab.BUY) {
      const pluralizeCount = `${carsCount} ${pluralizeAds(carsCount)}`;
      return {
        title: `Банкавто - купить авто ${getFormattedCity(
          current,
        )} онлайн 🚗 Цена от ${minPrice} руб - маркетплейс продажи автомобилей от официального дилера`,
        description: `Купить авто ${getFormattedCity(
          current,
        )} на #банкавто 🚗 Цена от ${minPrice} руб. Продажа автомобилей от официального дилера – более ${pluralizeCount}! Заходите и выбирайте!`,
      };
    }
    if (activeTab === HomeTab.SELL) {
      return {
        title: `Разместить объявление о продаже авто ${getFormattedCity(current)} - продать автомобиль на bankauto.ru`,
        description: `Выгодно и быстро продать автомобиль на #банкавто, легко разместить объявление о продаже авто ${getFormattedCity(
          current,
        )}.`,
      };
    }
    if (activeTab === HomeTab.SERVICE) {
      return {
        title: `Запись на сервис ${getFormattedCity(current)}`,
        description: 'Размести заявку на сервис и получи выгодное предложение',
      };
    }
    if (activeTab === HomeTab.INSURANCE) {
      return {
        title: `Автострахование ОСАГО ${getFormattedCity(current)} - купить страховку автомобиля онлайн`,
        // prettier-ignore
        description: `Автострахование ОСАГО ${getFormattedCity(
          current,
        )}. Выгодные условия страхования автомобиля онлайн - зайдите и убедитесь!`,
      };
    }
    if (activeTab === HomeTab.INSTALLMENT) {
      const pluralizeCount = `${offersCount} ${pluralizeOffer(offersCount)}`;
      return {
        title: `Купить авто в рассрочку ${getFormattedCity(
          current,
        )} на БанкАвто.ру - цены от ${installmentMonthlyPayment}р. в месяц`,
        description: `Выгодные предложения по покупке авто в рассрочку на БанкАвто.ру - цены от ${installmentMonthlyPayment}р. в месяц! ${pluralizeCount}!`,
      };
    }
    const pluralizeCount = `${carsCount} ${pluralizeAds(carsCount)}`;
    return {
      title: `Купить авто ${getFormattedCity(
        current,
      )} 🚗 Цена от ${minPrice} руб - продажа новых автомобилей от официального дилера`,
      description: `Купить авто ${getFormattedCity(
        current,
      )} 🚗 Цена от ${minPrice} руб. Продажа автомобилей от официального дилера – более ${pluralizeCount}! Заходите и выбирайте!`,
    };
  }, [activeTab, carsCount, current, installmentMonthlyPayment, minPrice, offersCount]);

  return <Meta canonical={!isCanonical ? canonical : undefined} {...metaTags} />;
});
