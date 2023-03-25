import { ReactComponent as IconDefaultAccount } from '@marketplace/ui-kit/icons/icon-account';
import { FEATURE_INSTALLMENT_ON } from './featureFlags';

export const MenuItems = {
  Home: { href: '/', text: 'Главная' },
  About: { href: '/about', text: 'О сервисе', parentId: 'Information' },
  Information: { href: '/about', text: 'ИНФОРМАЦИЯ' },
  Finance: { href: '/finance', text: 'БАНК ДЛЯ АВТОМОБИЛИСТОВ' },
  Service: { href: '/service', text: 'Cервис', parentId: 'Vehicles' },
  FinanceCredit: {
    href: '/finance/credit',
    text: 'Кредиты',
    parentId: 'Finance',
  },
  FinanceDebitCard: {
    href: '/finance/debit-cards/dorozhnaya/',
    text: 'Дебетовая карта',
    parentId: 'Finance',
  },
  FinanceSavingsAccount: {
    href: '/finance/savings-account',
    text: 'Накопительный счет',
    parentId: 'Finance',
  },
  FinanceDeposit: {
    href: '/finance/deposit',
    text: 'Вклады',
    parentId: 'Finance',
  },
  Vehicles: { href: '/', text: 'АВТОМАРКЕТ' },
  AllVehicles: { href: '/car', text: 'Автомаркет', parentId: 'Vehicles' }, // Для подсветки 'Автомаркет', когда выбран фильтр все автомобили
  VehiclesBuy: { href: '/car', text: 'Купить', parentId: 'Vehicles' },
  Insurance: {
    href: '/osago',
    text: 'ОСАГО',
    parentId: 'Vehicles',
    id: 'insurance',
  },
  Remont: { href: '/profile/service', text: 'Запись на сервис' },
  Policies: { href: '/profile/insurances', text: 'ОСАГО' },
  Profile: { href: '/profile/', text: 'Кабинет', icon: IconDefaultAccount },
  Applications: { href: '/profile/applications', text: 'Заявки' },
  PersonalInfo: { href: '/profile/common-info', text: 'Профиль' },
  Offers: { href: '/profile/offers', text: 'Объявления' },
  Favorites: { href: '/profile/favorites', text: 'Избранное' },
  Reviews: { href: '/profile/reviews', text: 'Отзывы' },
  Comparison: { href: '/profile/comparison', text: 'Сравнения' },
  Inspections: { href: '/profile/inspections', text: 'Заявки на осмотр' },
  Contacts: { href: '/contacts', text: 'Контакты' },
  Faq: { href: '/faq', text: 'Вопросы и ответы' },
  'Vehicles used tab': { href: '/car-used', parentId: 'Vehicles' }, // что б указать parentId для подсветки
  Blog: {
    href: 'https://blog.bankauto.ru/',
    text: '#блог',
    parentId: 'Information',
  },
  Sell: { href: '/sell/', text: 'Продать', parentId: 'Vehicles' },
  SellCreate: { href: '/sell/create', text: 'Продать', parentId: 'Vehicles' },
  ...(FEATURE_INSTALLMENT_ON
    ? {
        Instalment: {
          href: '/installment/vehicles',
          text: 'Рассрочка',
          parentId: 'Vehicles',
        },
      }
    : {}),
  UserAgreement: {
    href: '/docs/agreement-1.pdf',
    text: 'Пользовательское соглашение',
  },
  Contract: { href: '/contract/', text: 'Договор купли-продажи' },
  Integration: { href: '/integration', text: 'Вместе - к общей цели' },
};
