import {
  SPECIAL_OFFER_ALIAS,
  VEHICLE_SCENARIO,
  VEHICLE_TYPE,
  VEHICLE_TYPE_ID,
  VehicleNew,
  APPLICATION_TYPE,
} from '@marketplace/ui-kit/types';

export const vehicleMock: VehicleNew & { isBooked: number } = {
  photos: [
    {
      '100':
        'https://cdn.bankauto.ru/catalog/c_generation_color_package/1285/thumb/100/rectangle/502c2bf5-e73a-4df0-99e4-6408bf17d50a.jpeg',
      '750':
        'https://cdn.bankauto.ru/catalog/c_generation_color_package/1285/thumb/750/rectangle/502c2bf5-e73a-4df0-99e4-6408bf17d50a.jpeg',
      max: 'https://cdn.bankauto.ru/catalog/c_generation_color_package/1285/502c2bf5-e73a-4df0-99e4-6408bf17d50a.jpeg',
    },
    {
      '100':
        'https://cdn.bankauto.ru/catalog/c_generation_color_package/1285/thumb/100/rectangle/8cf540fb-252d-4104-8918-172d009f08bf.jpeg',
      '750':
        'https://cdn.bankauto.ru/catalog/c_generation_color_package/1285/thumb/750/rectangle/8cf540fb-252d-4104-8918-172d009f08bf.jpeg',
      max: 'https://cdn.bankauto.ru/catalog/c_generation_color_package/1285/8cf540fb-252d-4104-8918-172d009f08bf.jpeg',
    },
    {
      '100':
        'https://cdn.bankauto.ru/catalog/c_generation_color_package/1285/thumb/100/rectangle/c199c775-5f77-4671-9504-8b4a1ec537b6.jpeg',
      '750':
        'https://cdn.bankauto.ru/catalog/c_generation_color_package/1285/thumb/750/rectangle/c199c775-5f77-4671-9504-8b4a1ec537b6.jpeg',
      max: 'https://cdn.bankauto.ru/catalog/c_generation_color_package/1285/c199c775-5f77-4671-9504-8b4a1ec537b6.jpeg',
    },
  ],
  city: {
    id: 1,
    alias: 'moscow',
    name: 'moscow',
  },
  company: {
    name: '#БАНКАВТО',
    officeAddress: 'Киевская 7',
  },
  date: 0,
  equipmentNode: {
    id: 1,
    alias: '1',
    name: '1',
  },
  totalViews: 0,
  options: {
    Комфорт: ['Воздушный фильтр салона', 'Легкая тонировка стекол', 'Аудиоподготовка', 'Центральный замок'],
    Безопасность: [
      'Подушка безопасности водителя',
      'Крепления для детских сидений ISOFIX',
      'Блокировка задних дверей от открывания детьми',
      'Иммобилайзер',
      'Дневные ходовые огни',
      'Антиблокировочная система с электронным распределением тормозных сил (ABS, EBD)',
      'Система вспомогательного торможения (BAS)',
      'Система экстренного оповещения ЭРА-ГЛОНАСС',
    ],
    Интерьер: ['Розетка 12V'],
    Экстерьер: ['Запасное полноразмерное стальное колесо 14"'],
  },
  videoUrl: 'https://www.youtube.com/embed/X5g3DlhrA1c',
  salesOfficeId: 1787,
  ptsType: 'Не указан',
  ownersNumber: 0,
  id: 121862,
  status: 2,
  year: 2021,
  vin: 'Z94G2811*MR****02',
  mileage: 0,
  brand: {
    id: 25,
    name: 'LADA',
    alias: 'lada',
  },
  model: {
    id: 288,
    name: 'Granta',
    alias: 'granta',
  },
  generation: {
    id: 1626,
    name: 'I Рестайлинг',
    alias: 'i-restajling',
  },
  equipment: 'Standard',
  color: {
    name: 'Сердолик',
    code: '#c32020',
  },
  body: 'Лифтбэк',
  transmission: 'Механика',
  drive: 'Передний',
  engine: {
    engine: 'Бензин',
    engineVolume: '1.6',
    enginePower: 87,
  },
  // engineVolume: '1.6',
  // enginePower: 87,
  price: 425000,
  bookingPrice: 0,
  discounts: {
    market: 10400,
    tradeIn: 0,
    credit: 0,
  },
  gifts: [],
  scenario: VEHICLE_SCENARIO.NEW_BY_CODE,
  type: VEHICLE_TYPE.NEW,
  comment: null,
  contacts: null,
  specialOffer: {
    id: 124,
    percent: 6.5,
    name: 'Специальное предложение',
    link: 'https://bankauto.ru/',
    alias: SPECIAL_OFFER_ALIAS.KIA,
    vehicleType: VEHICLE_TYPE_ID.NEW,
    applicationType: APPLICATION_TYPE.VEHICLE,
    dealerDiscount: 0,
  },
  stickers: undefined,
  isBooked: 0,
  creditInfo: {
    monthlyPayment: 20000,
    initialPayment: 300000,
    creditTerm: 36,
  },
};
