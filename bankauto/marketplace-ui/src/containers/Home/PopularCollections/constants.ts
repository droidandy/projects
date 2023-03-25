import { PopularCollectionsItemProps } from './components/PopularCollectionItem';

export const POPULAR_COLLECTIONS = [
  {
    title: 'Автомобили с автоматом',
    subTitle: 'до 500 000 ₽',
    src: '/images/vehiclesTypes/sedan.png',
    href: '/car/?priceTo=500000&transmission=1',
  },
  {
    title: 'Универсалы',
    subTitle: 'до 1 000 000 ₽',
    src: '/images/vehiclesTypes/stationWagon.png',
    href: '/car/?bodyType=4&priceTo=1000000',
  },
  {
    title: 'Кроссоверы',
    subTitle: 'до 1 500 000 ₽',
    src: '/images/vehiclesTypes/crossover.png',
    href: '/car/?bodyType=11&priceTo=1500000',
  },
  {
    title: 'Дизельные',
    subTitle: 'автомобили',
    src: '/images/vehiclesTypes/dieselEngine.png',
    href: '/car/?engineType=2',
  },
  {
    title: 'Автомобили',
    subTitle: 'для всей семьи',
    src: '/images/vehiclesTypes/family.png',
    href: '/car/?bodyType=13',
  },
  {
    title: 'Автомобили',
    subTitle: 'для новичков',
    src: '/images/vehiclesTypes/forBeginners.png',
    href: '/car/?bodyType=19&priceTo=700000&transmission=1',
  },
  {
    title: 'Пикапы',
    src: '/images/vehiclesTypes/pickUp.png',
    href: '/car/?bodyType=10',
  },
  {
    title: 'Полный привод',
    src: '/images/vehiclesTypes/fullDrive.png',
    href: '/car/?driveType=3',
  },
] as PopularCollectionsItemProps[];
