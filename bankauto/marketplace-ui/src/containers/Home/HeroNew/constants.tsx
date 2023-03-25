import React, { FC } from 'react';
import { HomeTab } from 'types/Home';
import { useHomeState } from 'store/home';
import { pluralizeCar } from 'constants/pluralizeConstants';
import { IS_STOCK, IS_INSTALLMENT_SPECIAL_PROGRAM, IS_CASHBACK_PROMO } from 'constants/specialConstants';
import { Filter } from '../Filter/Filter';
import { SellFilter } from '../SellFilter/Filter';
import { InstalmentFilter } from '../InstalmentFilter/InstalmentFilter';
import { FEATURE_INSTALLMENT_ON } from 'constants/featureFlags';

export type Section = {
  id: HomeTab;
  name: string;
  link: string;
  title: string;
  subtitle: string | React.ReactNode;
  image: string;
  filter?: React.ReactNode;
};

const CountSubtitle: FC = () => {
  const { meta } = useHomeState();
  return (
    <>
      {meta.vehiclesCount} {pluralizeCar(meta.vehiclesCount)} в наличии от официальных дилеров
    </>
  );
};

const SectionStockBUY = {
  id: HomeTab.BUY,
  name: 'Купить',
  link: '/',
  title: 'Полный бак бензина',
  subtitle: 'При покупке автомобиля на #банкавто',
  image: 'homePageBuyStockBanner.jpg',
  filter: <Filter />,
};
const SectionCashbackPromoBUY = {
  id: HomeTab.BUY,
  name: 'Купить',
  link: '/',
  title: 'Кешбэк на ОСАГО',
  subtitle: 'При покупке автомобиля на #банкавто',
  image: 'homePageCashbackPromoBanner.jpg',
  filter: <Filter />,
};
const SectionBUY = {
  id: HomeTab.BUY,
  name: 'Купить',
  link: '/',
  title: 'Купить автомобиль {{city}}',
  subtitle: <CountSubtitle />,
  image: 'homePageBuyBanner.jpg',
  filter: <Filter />,
};
const SectionSELL = {
  id: HomeTab.SELL,
  name: 'Продать',
  link: '/sell/',
  title: 'Продайте свой автомобиль {{city}}',
  subtitle: 'Оцените и продайте свой автомобиль на самых выгодных условиях',
  image: 'homePageSellBanner.jpg',
  filter: <SellFilter />,
};
const SectionSERVICE = {
  id: HomeTab.SERVICE,
  name: 'Запись на сервис',
  link: '/service/',
  title: 'Запишитесь на сервис через #банкавто',
  subtitle: 'Более 16000 автосервисов будут конкурировать за ремонт Вашего авто',
  image: 'homePageServiceBanner.jpg',
};
const SectionINSURANCE = {
  id: HomeTab.INSURANCE,
  name: 'ОСАГО',
  link: '/osago/',
  title: 'Автострахование ОСАГО {{city}}',
  subtitle: 'Рассчитайте и оформите страховку онлайн не выходя из дома',
  image: 'homePageInsuranseBanner.jpg',
};
const SectionINSTALMENT = {
  id: HomeTab.INSTALLMENT,
  name: 'Рассрочка',
  link: '/installment/',
  title: 'Купить автомобиль в рассрочку {{city}}',
  subtitle: 'Без первоначального взноса и с фиксированным платежом',
  image: 'homePageInstallmentBanner.jpg',
  filter: <InstalmentFilter />,
};

const SectionSpecialProgramINSTALMENT = {
  id: HomeTab.INSTALLMENT,
  name: 'Рассрочка',
  link: '/installment/',
  title: 'Рассрочка без переплаты',
  subtitle: 'На все автомобили Geely Atlas',
  image: 'homePageInstallmentSpecialProgram.jpg',
  filter: <InstalmentFilter />,
};

//TODO убрать SectionSELL_A после того как закончится тест
export const SECTIONS: Section[] = [
  (IS_STOCK && SectionStockBUY) || (IS_CASHBACK_PROMO && SectionCashbackPromoBUY) || SectionBUY,
  ...(FEATURE_INSTALLMENT_ON
    ? [IS_INSTALLMENT_SPECIAL_PROGRAM ? SectionSpecialProgramINSTALMENT : SectionINSTALMENT]
    : []),
  SectionSELL,
  SectionSERVICE,
  SectionINSURANCE,
];

export const MAP_TAB_INDEX = Object.fromEntries(SECTIONS.map(({ id }, index) => [id || 'buy', index]));
