import { Section } from 'types/Section';

export enum SectionName {
  Index = 'index',
  VehicleNew = 'vehicleNew',
  VehicleUsed = 'vehicleUsed',
  Credit = 'credit',
  Insurance = 'insurance',
  Sell = 'sell',
}

export const SECTION_MAP: Record<string, Section> = {
  [SectionName.Index]: {
    imageDesktop: '/images/desktop/heroImageNewCar.jpg',
    imageMobile: '/images/mobile/heroImageNewCarMobile.jpg',
    title: 'Купите новый автомобиль',
    name: SectionName.Index,
  },
  [SectionName.VehicleNew]: {
    imageDesktop: '/images/desktop/heroImageNewCar.jpg',
    imageMobile: '/images/mobile/heroImageNewCarMobile.jpg',
    title: 'Продажа автомобилей в Москве',
    name: SectionName.VehicleNew,
  },
  [SectionName.VehicleUsed]: {
    imageDesktop: '/images/desktop/heroImageUsedCar.jpg',
    imageMobile: '/images/mobile/heroImageUsedCarMobile.jpg',
    title: 'Продажа автомобилей с пробегом в Москве',
    name: SectionName.VehicleUsed,
  },
  [SectionName.Credit]: {
    imageDesktop: '/images/desktop/heroImageCredit.jpg',
    imageMobile: '/images/mobile/heroImageCreditMobile.jpg',
    title: 'Автокредиты в Москве',
    name: SectionName.Credit,
  },
  [SectionName.Insurance]: {
    imageDesktop: '/images/desktop/heroImageInsurance.jpg',
    imageMobile: '/images/mobile/heroImageInsuranceMobile.jpg',
    title: 'Автострахование ОСАГО в Москве',
    name: SectionName.Insurance,
  },
  [SectionName.Sell]: {
    imageDesktop: '/images/desktop/heroImageC2C.jpg',
    imageMobile: '/images/mobile/heroImageC2CMobile.jpg',
    title: 'Разместить объявление о продаже авто в Москве',
    name: SectionName.Sell,
  },
};
