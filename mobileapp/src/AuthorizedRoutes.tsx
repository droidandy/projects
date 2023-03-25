import React, { useEffect, useRef } from 'react';
import { Linking, Notifications } from 'expo';
import { Platform, StyleSheet, View } from 'react-native';
import {
  createAppContainer,
  NavigationContainerComponent,
  NavigationRoute,
  NavigationRouteConfigMap,
  SafeAreaView,
} from 'react-navigation';
import { createStackNavigator } from 'react-navigation-stack';

import { theme } from './helpers/theme';

import { Authorized } from './containers/layouts/Authorized/Authorized';
import { Main, MainHeader } from './containers/Main/Main';
import { Catalog } from './containers/catalog/Catalog/Catalog';
import { MainMenu } from './containers/MainMenu/MainMenu';
import { Category } from './containers/catalog/Category/Category';
import { Products } from './containers/catalog/Products/Products';
import { Product } from './containers/catalog/Product/Product';
import { Favourites } from './containers/Favourites/Favourites';
import { Pharmacies } from './containers/Pharmacies/Pharmacies';
import { Settings } from './containers/Settings/Settings';
import { SettingsPersonal } from './containers/SettingsPersonal/SettingsPersonal';
import { SettingsNotifications } from './containers/SettingsNotifications/SettingsNotifications';

import { HeaderRight } from './components/HeaderRight/HeaderRight';
import { Logout } from './components/Logout/Logout';

import {
  cartStepOnePath,
  cartStepTwoPath,
  childrenCatalogPath,
  favouritesPath,
  locationChangePath,
  logoutPath,
  mainCatalogPath,
  mainPath,
  mainProfilePath,
  menuPath,
  orderListPath,
  orderPath,
  pharmacyPath,
  productPath,
  productsCatalogPath,
  profileSettingsNotificationsPath,
  profileSettingsPersonalPath,
  promoActionPath,
  searchPath,
} from './configs/paths';
import {
  cartStepOneRoute,
  cartStepTwoRoute,
  catalogRoute,
  categoryProductsRoute,
  childrenCategoriesRoute,
  favouritesRoute,
  locationChangeRoute,
  logoutRoute,
  mainRoute,
  menuRoute,
  orderListRoute,
  orderRoute,
  pharmacyRoute,
  productRoute,
  profileRoute,
  ROUTES,
  searchRoute,
  settingsNotificationsRoute,
  settingsPersonalRoute,
} from './configs/routeName';
import { Search } from './containers/catalog/Search/Search';
import { SearchHeader } from './containers/catalog/Search/SearchHeader';
import { OrderList } from './containers/orders/OrderList/OrderList';
import { Order } from './containers/orders/Order/Order';
import { StepOne } from './containers/cart/StepOne/StepOne';
import { LocationChange } from './containers/LocationChange/LocationChange';
import { StepTwo } from './containers/cart/StepTwo/StepTwo';
import {
  NavigationStackOptions,
  NavigationStackProp,
} from 'react-navigation-stack/lib/typescript/types';
import { PromoAction } from './containers/PromoActions/PromoAction';
import { PromoActions } from './containers/PromoActions/PromoActions';
import { registerForPushNotificationsAsync } from './helpers/push';
import { client } from './configs/apollo';
import { handleAppLink } from './helpers/app-link';

interface AppStyleOptions {
  headerForceInset?: React.ComponentProps<typeof SafeAreaView>['forceInset'];
  headerTitleStyle: StyleSheet.NamedStyles<{}>;
  headerBackTitleStyle: StyleSheet.NamedStyles<{}>;
  headerLeftContainerStyle?: StyleSheet.NamedStyles<{}>;
  headerStyle?: StyleSheet.NamedStyles<{}>;
  headerTintColor: string;
  headerRight: JSX.Element;
  headerTitle?: React.ReactNode | React.ComponentType;
  headerBackTitle?: string;
  headerTruncatedBackTitle?: string;
}

const Empty = (): null => null;

const defaultOptions: AppStyleOptions = {
  headerForceInset:
    Platform.OS === 'ios' || Platform.OS === 'macos'
      ? { top: 'never', bottom: 'never' }
      : undefined,
  headerTitleStyle: {
    color: theme.green,
    fontSize: 14,
    paddingLeft: 8,
    paddingRight: 8,
  },
  headerBackTitleStyle: {
    fontSize: 12,
    color: theme.green,
  },
  headerLeftContainerStyle: {
    marginLeft: Platform.OS === 'android' ? 0 : theme.sizing(0.5),
  },
  headerTintColor: theme.green,
  headerRight: (
    <View style={{ display: 'flex', flexDirection: 'row' }}>
      <Empty />
    </View>
  ),
};

export const routeConfigMap: NavigationRouteConfigMap<
  NavigationStackOptions,
  NavigationStackProp<NavigationRoute, any>
> = {
  [mainRoute]: {
    screen: Main,
    path: mainPath,
    navigationOptions: {
      ...defaultOptions,
      headerStyle: {
        height: theme.sizing(12),
      },
      headerRight: undefined,
      headerTitle: <MainHeader />,
    },
  },

  [profileRoute]: {
    screen: Settings,
    path: mainProfilePath,
    navigationOptions: {
      ...defaultOptions,
      headerTitle: 'Настройки',
      headerRight: <HeaderRight key="header-right" />,
    },
  },

  [settingsPersonalRoute]: {
    screen: SettingsPersonal,
    path: profileSettingsPersonalPath,
    navigationOptions: {
      ...defaultOptions,
      headerTitle: 'Личные данные',
      headerRight: <HeaderRight key="header-right" />,
    },
  },

  [settingsNotificationsRoute]: {
    screen: SettingsNotifications,
    path: profileSettingsNotificationsPath,
    navigationOptions: {
      ...defaultOptions,
      headerTitle: 'Уведомления',
      headerRight: <HeaderRight key="header-right" />,
    },
  },

  [searchRoute]: {
    screen: Search,
    path: searchPath,
    navigationOptions: {
      ...defaultOptions,
      headerBackTitleStyle: {
        display: 'none' as const,
      },
      headerStyle: {
        height: theme.sizing(9),
      },
      headerTitle: <SearchHeader />,
    },
  },

  [catalogRoute]: {
    screen: Catalog,
    path: mainCatalogPath,
    navigationOptions: (): AppStyleOptions => ({
      ...defaultOptions,
      headerTitle: 'Каталог',
      headerBackTitle: 'Каталог',
      headerTruncatedBackTitle: 'Каталог',
      headerRight: <HeaderRight key="header-right" />,
    }),
  },

  [childrenCategoriesRoute]: {
    screen: Category,
    path: childrenCatalogPath,
    navigationOptions: ({ navigation }): AppStyleOptions => ({
      ...defaultOptions,
      headerTitle: navigation.state.params.title || 'Категория',
      headerBackTitle: navigation.state.params.title || 'Категория',
      headerTruncatedBackTitle: 'Назад',
      headerRight: <HeaderRight key="header-right" />,
    }),
  },

  [categoryProductsRoute]: {
    screen: Products,
    path: productsCatalogPath,
    navigationOptions: ({ navigation }): AppStyleOptions => ({
      ...defaultOptions,
      headerTitle: navigation.state.params.title || 'Товары категории',
      headerBackTitle: navigation.state.params.title || 'Товары категории',
      headerTruncatedBackTitle: 'Назад',
      headerRight: <HeaderRight key="header-right" />,
    }),
  },

  [pharmacyRoute]: {
    screen: Pharmacies,
    path: pharmacyPath,
    navigationOptions: (): AppStyleOptions => ({
      ...defaultOptions,
      headerTitle: 'Аптеки',
      headerRight: <HeaderRight key="header-right" hideSearch={true} />,
    }),
  },
  [favouritesRoute]: {
    screen: Favourites,
    path: favouritesPath,
    navigationOptions: (): AppStyleOptions => ({
      ...defaultOptions,
      headerTitle: 'Избранное',
      headerRight: <HeaderRight key="header-right" hideSearch={true} />,
    }),
  },
  [menuRoute]: {
    screen: MainMenu,
    path: menuPath,
    navigationOptions: (): AppStyleOptions => ({
      ...defaultOptions,
      headerTitle: 'Меню',
      headerRight: <HeaderRight key="header-right" />,
    }),
  },
  [productRoute]: {
    screen: Product,
    path: productPath,
    navigationOptions: ({ navigation }): AppStyleOptions => ({
      ...defaultOptions,
      headerTitle: navigation.state.params.title
        ? decodeURIComponent(navigation.state.params.title)
        : 'Товар',
      headerRight: <HeaderRight key="header-right" />,
    }),
  },
  [orderRoute]: {
    screen: Order,
    path: orderPath,
    navigationOptions: ({ navigation }): AppStyleOptions => ({
      ...defaultOptions,
      headerTitle: navigation.state.params.title || 'Заказ',
    }),
  },
  [orderListRoute]: {
    screen: OrderList,
    path: orderListPath,
    navigationOptions: {
      ...defaultOptions,
      headerTitle: 'Заказы',
    },
  },
  [cartStepOneRoute]: {
    screen: StepOne,
    path: cartStepOnePath,
    navigationOptions: {
      ...defaultOptions,
      headerTitle: 'Корзина',
      headerRight: <HeaderRight key="header-right" hideBasket={true} hideSearch={true} />,
    },
  },
  [cartStepTwoRoute]: {
    screen: StepTwo,
    path: cartStepTwoPath,
    navigationOptions: ({ navigation }): AppStyleOptions => ({
      ...defaultOptions,
      headerTitle: navigation?.state?.params?.title || 'Выбор аптеки',
      headerRight: <HeaderRight key="header-right" hideBasket={true} hideSearch={true} />,
    }),
  },
  [locationChangeRoute]: {
    screen: LocationChange,
    path: locationChangePath,
    navigationOptions: {
      ...defaultOptions,
      headerTitle: 'Сменить город',
      headerRight: <HeaderRight key="header-right" />,
    },
  },
  [logoutRoute]: {
    screen: Logout,
    path: logoutPath,
    navigationOptions: {
      ...defaultOptions,
      headerTitle: 'Выход из системы',
    },
  },
  [ROUTES.promoActions]: {
    screen: PromoActions,
    path: promoActionPath,
    navigationOptions: ({ navigation }): AppStyleOptions => ({
      ...defaultOptions,
      headerTitle: navigation.state?.params?.title || 'Акции',
      headerRight: <HeaderRight key="header-right" />,
    }),
  },
  [ROUTES.promoAction]: {
    screen: PromoAction,
    path: promoActionPath,
    navigationOptions: ({ navigation }): AppStyleOptions => ({
      ...defaultOptions,
      headerTitle: navigation.state.params.title || 'Акция',
      headerRight: <HeaderRight key="header-right" />,
    }),
  },
};

// const prefix = Expo.Linking.makeUrl('/');

const AppContainer = createAppContainer(
  createStackNavigator(routeConfigMap, {
    initialRouteName: mainRoute,
    headerLayoutPreset: 'center',
    defaultNavigationOptions: {
      headerTruncatedBackTitle: 'Назад',
      title: 'На главную',
    },
  }),
);

const prefix = Linking.makeUrl('/');
console.log(prefix);

export const AuthorizedRoutes: React.FC = () => {
  const nav = useRef<NavigationContainerComponent>(null);

  useEffect(() => {
    const subscription = Notifications.addListener(notification => {
      const { link } = notification.data;

      console.log('notification data', link);
      handleAppLink(link);
    });

    return () => subscription.remove();
  }, []);

  useEffect(() => {
    registerForPushNotificationsAsync(client).catch(console.error);
  }, []);

  return (
    <Authorized key="authorized-layout">
      <AppContainer uriPrefix={prefix} ref={nav} key="authorized-routes" />
    </Authorized>
  );
};
