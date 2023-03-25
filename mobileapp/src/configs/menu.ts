import { NavigationSwitchScreenProps } from 'react-navigation';
import { ImageSourcePropType } from 'react-native';
import {
  cartStepOneRoute,
  catalogRoute,
  favouritesRoute,
  logoutRoute,
  mainRoute,
  orderListRoute,
  pharmacyRoute,
  profileRoute,
  ROUTES,
  searchRoute,
  settingsNotificationsRoute,
  settingsPersonalRoute,
} from './routeName';

export interface Menu<T = {}> {
  [key: string]: {
    path: string;
    title: string;
    navigationOptions?(params?: T): void | string | object;
  };
}

export interface BottomMenuIcons {
  active: ImageSourcePropType;
  default: ImageSourcePropType;
}

export const mainMenuConfig: Menu<NavigationSwitchScreenProps> = {
  [mainRoute]: {
    path: mainRoute,
    title: 'Главная',
  },
  [orderListRoute]: {
    path: orderListRoute,
    title: 'Заказы',
  },
  [ROUTES.promoActions]: {
    path: ROUTES.promoActions,
    title: 'Акции',
  },
  [searchRoute]: {
    path: searchRoute,
    title: 'Поиск',
  },
  [catalogRoute]: {
    path: catalogRoute,
    title: 'Каталог',
  },
  [cartStepOneRoute]: {
    path: cartStepOneRoute,
    title: 'Корзина',
  },
  [pharmacyRoute]: {
    path: pharmacyRoute,
    title: 'Аптеки',
  },
  [favouritesRoute]: {
    path: favouritesRoute,
    title: 'Избранное',
  },
  [profileRoute]: {
    path: profileRoute,
    title: 'Настройки',
  },
  [logoutRoute]: {
    path: logoutRoute,
    title: 'Выйти из системы',
  },
};

export const settingsMenuConfig: Menu<NavigationSwitchScreenProps> = {
  [settingsPersonalRoute]: {
    path: settingsPersonalRoute,
    title: 'Личные данные',
  },
  [settingsNotificationsRoute]: {
    path: settingsNotificationsRoute,
    title: 'Уведомления',
  },
};
