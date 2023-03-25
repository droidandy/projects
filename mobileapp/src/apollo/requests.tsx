import { GraphQLResolveInfo, GraphQLScalarType, GraphQLScalarTypeConfig } from 'graphql';
import { ResolverCtx } from './ResolverCtx';
import gql from 'graphql-tag';
import * as React from 'react';
import * as ApolloReactCommon from '@apollo/react-common';
import * as ApolloReactComponents from '@apollo/react-components';
import * as ApolloReactHooks from '@apollo/react-hooks';
export type Maybe<T> = T | null;
export type Exact<T extends { [key: string]: unknown }> = { [K in keyof T]: T[K] };
export type RequireFields<T, K extends keyof T> = { [X in Exclude<keyof T, K>]?: T[X] } & { [P in K]-?: NonNullable<T[P]> };
export type Omit<T, K extends keyof T> = Pick<T, Exclude<keyof T, K>>;
/** All built-in and custom scalars, mapped to their actual values */
export type Scalars = {
  ID: string;
  String: string;
  Boolean: boolean;
  Int: number;
  Float: number;
  /** The javascript `Date` as string. Type represents date and time as the ISO Date string. */
  DateTime: any;
};


/** Баннеры на главной */
export type BannerModel = {
  __typename?: 'BannerModel';
  /** Id категории */
  id: Scalars['Int'];
  name: Scalars['String'];
  /** Ссылка на картинку с баннером */
  preview: Scalars['String'];
  /** Ссылка для переадресации */
  link: Scalars['String'];
  location: Scalars['String'];
  /** Ссылка внутри приложения */
  appLink?: Maybe<Scalars['String']>;
};

/** позиция в корзине */
export type CartItemModel = {
  __typename?: 'CartItemModel';
  id: Scalars['Int'];
  productId: Scalars['Int'];
  quantity: Scalars['Int'];
  price: Scalars['Float'];
  oldPrice: Scalars['Float'];
  /** Товар */
  product: ProductModel;
};

/** Позиция корщины или заказа id => количество */
export type CartModel = {
  __typename?: 'CartModel';
  items: Array<CartItemModel>;
  /** общая кол-во товаров */
  quantity: Scalars['Float'];
  /** общая сумма заказа */
  price: Scalars['Float'];
  coupon: Scalars['String'];
  coupons: Array<CouponListItem>;
  id: Scalars['Int'];
  /** id товаров */
  productIds: Array<Scalars['Int']>;
  /** Подарки */
  gifts: Array<ProductModel>;
};

/** Категория товаров */
export type CategoryModel = {
  __typename?: 'CategoryModel';
  /** Id категории */
  id: Scalars['Int'];
  /** Название категории товаров */
  name: Scalars['String'];
  /** Картинка категории */
  image?: Maybe<Scalars['String']>;
};

/** гео координаты */
export type CityModel = {
  __typename?: 'CityModel';
  /** Id города */
  id: Scalars['Int'];
  /** Название города */
  name: Scalars['String'];
  /** Код города */
  code?: Maybe<Scalars['String']>;
  /** Id склада */
  storageId: Scalars['Int'];
  /** Заголовок склада */
  storeTitle?: Maybe<Scalars['String']>;
};

export type CouponListItem = {
  __typename?: 'CouponListItem';
  id: Scalars['ID'];
  discountName: Scalars['String'];
  active: Scalars['Boolean'];
  discountActive: Scalars['Boolean'];
  statusText: Scalars['String'];
};


/** Действия изменения корзины */
export enum EditCartAction {
  AddProduct = 'ADD_PRODUCT',
  UpdateQuantity = 'UPDATE_QUANTITY',
  DeleteProduct = 'DELETE_PRODUCT'
}

/** Действия с списокм избранных товаров */
export enum EditFavoritesProductsActions {
  Add = 'ADD',
  Delete = 'DELETE',
  DeleteAll = 'DELETE_ALL'
}

export type ForgotTokenInputModel = {
  login: Scalars['String'];
};

/** гео координаты */
export type GeoCoordsModel = {
  __typename?: 'GeoCoordsModel';
  id: Scalars['Int'];
  /** долгота */
  latitude: Scalars['Float'];
  /** широта */
  longitude: Scalars['Float'];
};

export type LoginInputModel = {
  emailOrPhone: Scalars['String'];
  password: Scalars['String'];
};

export type Mutation = {
  __typename?: 'Mutation';
  changeCity: Scalars['Boolean'];
  login: Scalars['String'];
  register: Scalars['String'];
  createForgotToken: Scalars['Int'];
  resetPassword: Scalars['Int'];
  updateUserData: Scalars['Int'];
  setUserPhoto: Scalars['String'];
  updateCityByLocation: UserModel;
  /** Редактирование списока избранных аптек */
  editFavoritesPharmacy: Array<Scalars['Int']>;
  /** Редактирование списока избранных товаров */
  editFavoritesProducts: Array<Scalars['Int']>;
  toggleProductInWishlist: ProductModel;
  /** Отмена заказа */
  cancelOrder: Scalars['Float'];
  /** Создание заказа */
  createOrder: Scalars['Int'];
  /** Повтор заказа */
  reOrder: Scalars['Int'];
  /** Обновление корзины */
  updateCart: CartModel;
  /** Добавить промокод */
  addPromoCode: CartModel;
  /** Удалить промокод */
  deletePromoCode: CartModel;
  /** Обновление статусов уведомлений */
  updateNotifications: NotificationModel;
  /** Добавление push токена */
  addPushToken: Scalars['Boolean'];
};


export type MutationChangeCityArgs = {
  newCityId: Scalars['Int'];
};


export type MutationLoginArgs = {
  data: LoginInputModel;
};


export type MutationRegisterArgs = {
  data: RegisterInputModel;
};


export type MutationCreateForgotTokenArgs = {
  data: ForgotTokenInputModel;
};


export type MutationResetPasswordArgs = {
  data: ResetPasswordInputModel;
};


export type MutationUpdateUserDataArgs = {
  data: UpdateUserDataInputModel;
};


export type MutationSetUserPhotoArgs = {
  photo?: Maybe<Scalars['String']>;
};


export type MutationUpdateCityByLocationArgs = {
  longitude: Scalars['Float'];
  latitude: Scalars['Float'];
};


export type MutationEditFavoritesPharmacyArgs = {
  pharmacyId?: Maybe<Scalars['Int']>;
  action: EditFavoritesProductsActions;
};


export type MutationEditFavoritesProductsArgs = {
  productId?: Maybe<Scalars['Int']>;
  action: EditFavoritesProductsActions;
};


export type MutationToggleProductInWishlistArgs = {
  id: Scalars['Int'];
};


export type MutationCancelOrderArgs = {
  message?: Maybe<Scalars['String']>;
  orderId: Scalars['Int'];
};


export type MutationCreateOrderArgs = {
  pharmacyId: Scalars['Int'];
};


export type MutationReOrderArgs = {
  orderId: Scalars['Int'];
};


export type MutationUpdateCartArgs = {
  quantity?: Maybe<Scalars['Int']>;
  productId: Scalars['Int'];
  editAction: EditCartAction;
};


export type MutationAddPromoCodeArgs = {
  coupon: Scalars['String'];
};


export type MutationDeletePromoCodeArgs = {
  coupon: Scalars['String'];
};


export type MutationUpdateNotificationsArgs = {
  status: Scalars['Boolean'];
  stocks: Scalars['Boolean'];
};


export type MutationAddPushTokenArgs = {
  token: Scalars['String'];
};

/** Статусы уведомлений */
export type NotificationModel = {
  __typename?: 'NotificationModel';
  /** Акция */
  stocks: Scalars['Boolean'];
  /** Статус заказа */
  status: Scalars['Boolean'];
};

/** Заказ */
export type OrderModel = {
  __typename?: 'OrderModel';
  /** id заказа */
  id: Scalars['Int'];
  /** дата и время заказа */
  dateInsert: Scalars['String'];
  /** id юзера */
  userId: Scalars['Float'];
  /** полная стоимость заказа */
  price: Scalars['Float'];
  /** валюта */
  currency: Scalars['String'];
  /** флаг отмены заказа */
  isPossibleCancel: Scalars['Boolean'];
  /** форматированная итоговая цена */
  priceFormat: Scalars['String'];
  /** Название статуса */
  statusName: Scalars['String'];
  /** цвет статуса */
  statusColor: Scalars['String'];
  /** форматированная итоговая цена */
  basket: Array<CartItemModel>;
};

/** Заказ */
export type OrdersModel = {
  __typename?: 'OrdersModel';
  /** заказы */
  orders: Array<OrderModel>;
  /** всего страниц заказов */
  allPage: Scalars['Float'];
};

/** Аптека */
export type PharmacyModel = {
  __typename?: 'PharmacyModel';
  address: Scalars['String'];
  city: Scalars['String'];
  /** Гео координаты */
  coordinate?: Maybe<GeoCoordsModel>;
  description: Scalars['String'];
  id: Scalars['Int'];
  /** Находится ли аптека в списке избранных */
  isFavourite: Scalars['Boolean'];
  latitude: Scalars['String'];
  longitude: Scalars['String'];
  metro: Scalars['String'];
  metroTime: Scalars['String'];
  phone: Scalars['String'];
  schedule: Scalars['String'];
  sort: Scalars['Float'];
  store: Scalars['Float'];
  title: Scalars['String'];
  workFriday: Scalars['String'];
  workMonday: Scalars['String'];
  workSaturday: Scalars['String'];
  workSunday: Scalars['String'];
  workThursday: Scalars['String'];
  workTuesday: Scalars['String'];
  workWednesda: Scalars['String'];
  /** id аптеки */
  xmlId: Scalars['ID'];
};

/** Товар (препарат) */
export type ProductModel = {
  __typename?: 'ProductModel';
  /** Действующие вещества */
  activeIngredients?: Maybe<Scalars['String']>;
  /** Описание */
  description?: Maybe<Scalars['String']>;
  /** Относительный путь на сайте */
  detailPageUrl: Scalars['String'];
  expirationDate: Scalars['String'];
  /** Форма выпуска */
  form?: Maybe<Scalars['String']>;
  /** Id товара */
  id: Scalars['Int'];
  inWishlist: Scalars['Boolean'];
  /** Находится ли товар в списке избранных */
  isFavourite: Scalars['Boolean'];
  /** Находится ли товар в корзине */
  isInBasket: Scalars['Boolean'];
  /** Производитель */
  manufacturer?: Maybe<Scalars['String']>;
  /** Название товара */
  name?: Maybe<Scalars['String']>;
  /** Нужен рецепт */
  needReceipt: Scalars['Boolean'];
  /** Старая цена */
  oldPrice: Scalars['Float'];
  /** Большая картинка */
  picture?: Maybe<Scalars['String']>;
  /** Маленькая картинка */
  preview?: Maybe<Scalars['String']>;
  /** Цена */
  price: Scalars['Float'];
  /** Акция */
  promotional: Scalars['Boolean'];
  /** Наличие товара в аптеке */
  quantity: Scalars['Float'];
  /** Артикул товара */
  vendorCode?: Maybe<Scalars['String']>;
};

/** Акции */
export type PromoActionModel = {
  __typename?: 'PromoActionModel';
  /** Id акции */
  id: Scalars['Int'];
  name: Scalars['String'];
  /** Ссылка на картинку с баннером */
  preview: Scalars['String'];
  previewText: Scalars['String'];
  detailText: Scalars['String'];
  products: Array<ProductModel>;
};

export type Query = {
  __typename?: 'Query';
  user: UserModel;
  /** категории */
  categories: Array<CategoryModel>;
  /** категория по Id */
  category: CategoryModel;
  /** Список аптек */
  pharmacies: Array<PharmacyModel>;
  /** поиск товаров */
  search: SearchModel;
  /** товар по Id */
  product: ProductModel;
  /** список товаров категории */
  products: Array<ProductModel>;
  /** Список рекомендованных товаров (главная) */
  recommended: Array<ProductModel>;
  /** Баннеры на главную */
  banners: Array<BannerModel>;
  /** Акции */
  promoActions: Array<PromoActionModel>;
  /** Получение информации по городу */
  city: CityModel;
  /** Получение информации по городу */
  cities: Array<CityModel>;
  /** Список заказов */
  orders: OrdersModel;
  /** Заказ */
  order: OrderModel;
  /** Список товаров в корзине */
  cart: CartModel;
  /** Уведомления */
  notification: NotificationModel;
};


export type QueryCategoriesArgs = {
  id?: Maybe<Scalars['Int']>;
};


export type QueryCategoryArgs = {
  id: Scalars['Int'];
};


export type QuerySearchArgs = {
  limit: Scalars['Int'];
  page: Scalars['Int'];
  query?: Maybe<Scalars['String']>;
};


export type QueryProductArgs = {
  id: Scalars['Int'];
};


export type QueryProductsArgs = {
  categoryId: Scalars['Int'];
};


export type QueryCityArgs = {
  longitude: Scalars['Float'];
  latitude: Scalars['Float'];
};


export type QueryOrdersArgs = {
  page: Scalars['Int'];
  limit: Scalars['Int'];
};


export type QueryOrderArgs = {
  orderId: Scalars['Int'];
};

export type RegisterInputModel = {
  name: Scalars['String'];
  email: Scalars['String'];
  personal_phone: Scalars['String'];
  password: Scalars['String'];
};

export type ResetPasswordInputModel = {
  login: Scalars['String'];
  password: Scalars['String'];
  token: Scalars['String'];
};

/** Товары в поиске */
export type SearchModel = {
  __typename?: 'SearchModel';
  /** товары */
  products: Array<ProductModel>;
  /** товары */
  allPage?: Maybe<Scalars['Float']>;
};

/** Пол пользователя */
export enum Sex {
  Male = 'MALE',
  Female = 'FEMALE'
}

export type UpdateUserDataInputModel = {
  login: Scalars['String'];
  email: Scalars['String'];
  name?: Maybe<Scalars['String']>;
  second_name?: Maybe<Scalars['String']>;
  last_name?: Maybe<Scalars['String']>;
  personal_phone?: Maybe<Scalars['String']>;
  personal_birthday?: Maybe<Scalars['DateTime']>;
  personal_gender?: Maybe<Sex>;
  personal_photo?: Maybe<Scalars['String']>;
  personal_photo_del?: Maybe<Scalars['Boolean']>;
  password?: Maybe<Scalars['String']>;
};

export type UserInputModel = {
  userId: Scalars['Float'];
};

/** Пользователь */
export type UserModel = {
  __typename?: 'UserModel';
  /** id пользователя */
  id: Scalars['Int'];
  /** Логин */
  login: Scalars['String'];
  /** Email */
  email: Scalars['String'];
  /** Имя */
  name?: Maybe<Scalars['String']>;
  /** Фамилия */
  secondName?: Maybe<Scalars['String']>;
  /** Отчество */
  lastName?: Maybe<Scalars['String']>;
  /** Номер телефона */
  personalPhone?: Maybe<Scalars['String']>;
  /** Дата рождения */
  personalBirthday?: Maybe<Scalars['String']>;
  /** Пол */
  personalGender?: Maybe<Scalars['String']>;
  /** Ссылка на фото */
  personalPhoto?: Maybe<Scalars['String']>;
  favoriteProducts: Array<ProductModel>;
  favoritePharmacies: Array<PharmacyModel>;
  /** Список id избранных аптек */
  favoritePharmaciesIds: Array<Scalars['Int']>;
  /** Список id избранных товаров */
  favoriteProductsIds: Array<Scalars['Int']>;
  /** Город пользователя */
  city: CityModel;
  /** Город пользователя выбран? */
  citySelected: Scalars['Boolean'];
};

export type CartItemFragment = (
  { __typename?: 'CartItemModel' }
  & Pick<CartItemModel, 'id' | 'productId' | 'quantity'>
);

export type CartItemWithProductFragment = (
  { __typename?: 'CartItemModel' }
  & Pick<CartItemModel, 'id' | 'productId' | 'price' | 'oldPrice' | 'quantity'>
  & { product: (
    { __typename?: 'ProductModel' }
    & ListProductFragment
  ) }
);

export type CartFragment = (
  { __typename?: 'CartModel' }
  & Pick<CartModel, 'id' | 'price' | 'quantity'>
  & { items: Array<(
    { __typename?: 'CartItemModel' }
    & CartItemFragment
  )> }
);

export type CartWithProductsFragment = (
  { __typename?: 'CartModel' }
  & Pick<CartModel, 'id' | 'price' | 'quantity'>
  & { items: Array<(
    { __typename?: 'CartItemModel' }
    & CartItemWithProductFragment
  )>, gifts: Array<(
    { __typename?: 'ProductModel' }
    & ListProductFragment
  )>, coupons: Array<(
    { __typename?: 'CouponListItem' }
    & Pick<CouponListItem, 'id' | 'active' | 'discountActive' | 'statusText' | 'discountName'>
  )> }
);

export type GetCartQueryVariables = Exact<{ [key: string]: never; }>;


export type GetCartQuery = (
  { __typename?: 'Query' }
  & { cart: (
    { __typename?: 'CartModel' }
    & CartFragment
  ) }
);

export type GetCartWithProductsQueryVariables = Exact<{ [key: string]: never; }>;


export type GetCartWithProductsQuery = (
  { __typename?: 'Query' }
  & { cart: (
    { __typename?: 'CartModel' }
    & CartWithProductsFragment
  ) }
);

export type AddToCartMutationVariables = Exact<{
  productId: Scalars['Int'];
  quantity: Scalars['Int'];
}>;


export type AddToCartMutation = (
  { __typename?: 'Mutation' }
  & { updateCart: (
    { __typename?: 'CartModel' }
    & CartFragment
  ) }
);

export type UpdateCartMutationVariables = Exact<{
  quantity?: Maybe<Scalars['Int']>;
  productId: Scalars['Int'];
  editAction: EditCartAction;
}>;


export type UpdateCartMutation = (
  { __typename?: 'Mutation' }
  & { updateCart: (
    { __typename?: 'CartModel' }
    & CartWithProductsFragment
  ) }
);

export type AddPromoCodeMutationVariables = Exact<{
  coupon: Scalars['String'];
}>;


export type AddPromoCodeMutation = (
  { __typename?: 'Mutation' }
  & { addPromoCode: (
    { __typename?: 'CartModel' }
    & CartWithProductsFragment
  ) }
);

export type DeletePromoCodeMutationVariables = Exact<{
  coupon: Scalars['String'];
}>;


export type DeletePromoCodeMutation = (
  { __typename?: 'Mutation' }
  & { deletePromoCode: (
    { __typename?: 'CartModel' }
    & CartWithProductsFragment
  ) }
);

export type GetBannersQueryVariables = Exact<{ [key: string]: never; }>;


export type GetBannersQuery = (
  { __typename?: 'Query' }
  & { banners: Array<(
    { __typename?: 'BannerModel' }
    & Pick<BannerModel, 'id' | 'location' | 'preview' | 'appLink'>
  )> }
);

export type GetPromoActionsQueryVariables = Exact<{ [key: string]: never; }>;


export type GetPromoActionsQuery = (
  { __typename?: 'Query' }
  & { promoActions: Array<(
    { __typename?: 'PromoActionModel' }
    & Pick<PromoActionModel, 'id' | 'name' | 'preview' | 'previewText' | 'detailText'>
    & { products: Array<(
      { __typename?: 'ProductModel' }
      & ListProductFragment
    )> }
  )> }
);

export type GetCatalogRootQueryVariables = Exact<{ [key: string]: never; }>;


export type GetCatalogRootQuery = (
  { __typename?: 'Query' }
  & { categories: Array<(
    { __typename?: 'CategoryModel' }
    & Pick<CategoryModel, 'id' | 'name' | 'image'>
  )> }
);

export type GetCategoriesQueryVariables = Exact<{
  id: Scalars['Int'];
}>;


export type GetCategoriesQuery = (
  { __typename?: 'Query' }
  & { categories: Array<(
    { __typename?: 'CategoryModel' }
    & Pick<CategoryModel, 'id' | 'name'>
  )> }
);

export type GetRecommendedQueryVariables = Exact<{ [key: string]: never; }>;


export type GetRecommendedQuery = (
  { __typename?: 'Query' }
  & { recommended: Array<(
    { __typename?: 'ProductModel' }
    & ListProductFragment
  )> }
);

export type CityFragment = (
  { __typename?: 'CityModel' }
  & Pick<CityModel, 'id' | 'code' | 'name' | 'storageId' | 'storeTitle'>
);

export type GetCitiesQueryVariables = Exact<{ [key: string]: never; }>;


export type GetCitiesQuery = (
  { __typename?: 'Query' }
  & { cities: Array<(
    { __typename?: 'CityModel' }
    & CityFragment
  )> }
);

export type GetCityQueryVariables = Exact<{
  longitude: Scalars['Float'];
  latitude: Scalars['Float'];
}>;


export type GetCityQuery = (
  { __typename?: 'Query' }
  & { city: (
    { __typename?: 'CityModel' }
    & CityFragment
  ) }
);

export type ChangeCityMutationVariables = Exact<{
  id: Scalars['Int'];
}>;


export type ChangeCityMutation = (
  { __typename?: 'Mutation' }
  & Pick<Mutation, 'changeCity'>
);

export type AddPushTokenMutationVariables = Exact<{
  token: Scalars['String'];
}>;


export type AddPushTokenMutation = (
  { __typename?: 'Mutation' }
  & Pick<Mutation, 'addPushToken'>
);

export type UpdateNotificationsSettingsMutationVariables = Exact<{
  status: Scalars['Boolean'];
  stocks: Scalars['Boolean'];
}>;


export type UpdateNotificationsSettingsMutation = (
  { __typename?: 'Mutation' }
  & { updateNotifications: (
    { __typename?: 'NotificationModel' }
    & Pick<NotificationModel, 'status' | 'stocks'>
  ) }
);

export type GetNotificationSettingsQueryVariables = Exact<{ [key: string]: never; }>;


export type GetNotificationSettingsQuery = (
  { __typename?: 'Query' }
  & { notification: (
    { __typename?: 'NotificationModel' }
    & Pick<NotificationModel, 'status' | 'stocks'>
  ) }
);

export type GetOrderQueryVariables = Exact<{
  orderId: Scalars['Int'];
}>;


export type GetOrderQuery = (
  { __typename?: 'Query' }
  & { order: (
    { __typename?: 'OrderModel' }
    & Pick<OrderModel, 'id' | 'dateInsert' | 'userId' | 'price' | 'currency' | 'isPossibleCancel' | 'priceFormat' | 'statusName' | 'statusColor'>
    & { basket: Array<(
      { __typename?: 'CartItemModel' }
      & CartItemWithProductFragment
    )> }
  ) }
);

export type GetOrdersQueryVariables = Exact<{
  page: Scalars['Int'];
  limit: Scalars['Int'];
}>;


export type GetOrdersQuery = (
  { __typename?: 'Query' }
  & { orders: (
    { __typename?: 'OrdersModel' }
    & Pick<OrdersModel, 'allPage'>
    & { orders: Array<(
      { __typename?: 'OrderModel' }
      & Pick<OrderModel, 'id' | 'dateInsert' | 'isPossibleCancel' | 'statusName' | 'statusColor'>
    )> }
  ) }
);

export type CancelOrderMutationVariables = Exact<{
  orderId: Scalars['Int'];
}>;


export type CancelOrderMutation = (
  { __typename?: 'Mutation' }
  & Pick<Mutation, 'cancelOrder'>
);

export type CreateOrderMutationVariables = Exact<{
  pharmacyId: Scalars['Int'];
}>;


export type CreateOrderMutation = (
  { __typename?: 'Mutation' }
  & Pick<Mutation, 'createOrder'>
);

export type ReOrderMutationVariables = Exact<{
  orderId: Scalars['Int'];
}>;


export type ReOrderMutation = (
  { __typename?: 'Mutation' }
  & Pick<Mutation, 'reOrder'>
);

export type ListPharmacyFragment = (
  { __typename?: 'PharmacyModel' }
  & Pick<PharmacyModel, 'id' | 'xmlId' | 'title' | 'address' | 'metro' | 'latitude' | 'longitude' | 'schedule' | 'store' | 'workSunday' | 'workMonday' | 'workTuesday' | 'workWednesda' | 'workThursday' | 'workFriday' | 'workSaturday' | 'phone' | 'city' | 'isFavourite'>
  & { coordinate?: Maybe<(
    { __typename?: 'GeoCoordsModel' }
    & Pick<GeoCoordsModel, 'id' | 'latitude' | 'longitude'>
  )> }
);

export type EditFavouritePharmacyMutationVariables = Exact<{
  action: EditFavoritesProductsActions;
  id?: Maybe<Scalars['Int']>;
}>;


export type EditFavouritePharmacyMutation = (
  { __typename?: 'Mutation' }
  & Pick<Mutation, 'editFavoritesPharmacy'>
);

export type GetPharmaciesQueryVariables = Exact<{ [key: string]: never; }>;


export type GetPharmaciesQuery = (
  { __typename?: 'Query' }
  & { pharmacies: Array<(
    { __typename?: 'PharmacyModel' }
    & ListPharmacyFragment
  )> }
);

export type ProductInBasketFragment = (
  { __typename?: 'ProductModel' }
  & Pick<ProductModel, 'isInBasket'>
);

export type ProductIsFavoriteFragment = (
  { __typename?: 'ProductModel' }
  & Pick<ProductModel, 'isFavourite'>
);

export type ListProductFragment = (
  { __typename?: 'ProductModel' }
  & Pick<ProductModel, 'id' | 'name' | 'preview' | 'picture' | 'oldPrice' | 'price' | 'quantity' | 'needReceipt' | 'promotional' | 'detailPageUrl' | 'inWishlist' | 'isInBasket' | 'isFavourite'>
);

export type ProductDataFragment = (
  { __typename?: 'ProductModel' }
  & Pick<ProductModel, 'id' | 'name' | 'picture' | 'oldPrice' | 'price' | 'quantity' | 'vendorCode' | 'activeIngredients' | 'form' | 'manufacturer' | 'description' | 'needReceipt' | 'promotional' | 'detailPageUrl' | 'inWishlist' | 'expirationDate' | 'isInBasket' | 'isFavourite'>
);

export type EditFavouriteProductMutationVariables = Exact<{
  action: EditFavoritesProductsActions;
  id?: Maybe<Scalars['Int']>;
}>;


export type EditFavouriteProductMutation = (
  { __typename?: 'Mutation' }
  & Pick<Mutation, 'editFavoritesProducts'>
);

export type ToggleProductInWishlistMutationVariables = Exact<{
  id: Scalars['Int'];
}>;


export type ToggleProductInWishlistMutation = (
  { __typename?: 'Mutation' }
  & { toggleProductInWishlist: (
    { __typename?: 'ProductModel' }
    & Pick<ProductModel, 'id' | 'inWishlist'>
  ) }
);

export type GetFavouriteProductsQueryVariables = Exact<{ [key: string]: never; }>;


export type GetFavouriteProductsQuery = (
  { __typename?: 'Query' }
  & { user: (
    { __typename?: 'UserModel' }
    & Pick<UserModel, 'id'>
    & { favoriteProducts: Array<(
      { __typename?: 'ProductModel' }
      & ListProductFragment
    )> }
  ) }
);

export type GetProductQueryVariables = Exact<{
  id: Scalars['Int'];
}>;


export type GetProductQuery = (
  { __typename?: 'Query' }
  & { product: (
    { __typename?: 'ProductModel' }
    & ProductDataFragment
  ) }
);

export type GetProductsQueryVariables = Exact<{
  categoryId: Scalars['Int'];
}>;


export type GetProductsQuery = (
  { __typename?: 'Query' }
  & { products: Array<(
    { __typename?: 'ProductModel' }
    & ListProductFragment
  )> }
);

export type GetSearchProductsQueryVariables = Exact<{
  query?: Maybe<Scalars['String']>;
  page: Scalars['Int'];
  limit: Scalars['Int'];
}>;


export type GetSearchProductsQuery = (
  { __typename?: 'Query' }
  & { search: (
    { __typename?: 'SearchModel' }
    & Pick<SearchModel, 'allPage'>
    & { products: Array<(
      { __typename?: 'ProductModel' }
      & ListProductFragment
    )> }
  ) }
);

export type UserFragment = (
  { __typename?: 'UserModel' }
  & Pick<UserModel, 'id' | 'login' | 'email' | 'name' | 'secondName' | 'lastName' | 'personalPhoto' | 'personalBirthday' | 'personalGender' | 'personalPhone' | 'favoritePharmaciesIds' | 'favoriteProductsIds' | 'citySelected'>
  & { city: (
    { __typename?: 'CityModel' }
    & CityFragment
  ) }
);

export type GetUserQueryVariables = Exact<{ [key: string]: never; }>;


export type GetUserQuery = (
  { __typename?: 'Query' }
  & { user: (
    { __typename?: 'UserModel' }
    & UserFragment
  ) }
);

export type UpdateUserMutationVariables = Exact<{
  login: Scalars['String'];
  email: Scalars['String'];
  name?: Maybe<Scalars['String']>;
  second_name?: Maybe<Scalars['String']>;
  last_name?: Maybe<Scalars['String']>;
  personal_phone?: Maybe<Scalars['String']>;
  personal_birthday?: Maybe<Scalars['DateTime']>;
  personal_gender?: Maybe<Sex>;
  password?: Maybe<Scalars['String']>;
}>;


export type UpdateUserMutation = (
  { __typename?: 'Mutation' }
  & Pick<Mutation, 'updateUserData'>
);

export type RegisterMutationVariables = Exact<{
  name: Scalars['String'];
  email: Scalars['String'];
  personalPhone: Scalars['String'];
  password: Scalars['String'];
}>;


export type RegisterMutation = (
  { __typename?: 'Mutation' }
  & Pick<Mutation, 'register'>
);

export type LoginMutationVariables = Exact<{
  emailOrPhone: Scalars['String'];
  password: Scalars['String'];
}>;


export type LoginMutation = (
  { __typename?: 'Mutation' }
  & Pick<Mutation, 'login'>
);

export type CreateForgotTokenMutationVariables = Exact<{
  login: Scalars['String'];
}>;


export type CreateForgotTokenMutation = (
  { __typename?: 'Mutation' }
  & Pick<Mutation, 'createForgotToken'>
);

export type ResetPasswordMutationVariables = Exact<{
  login: Scalars['String'];
  token: Scalars['String'];
  password: Scalars['String'];
}>;


export type ResetPasswordMutation = (
  { __typename?: 'Mutation' }
  & Pick<Mutation, 'resetPassword'>
);

export type UpdateCityByLocationMutationVariables = Exact<{
  latitude: Scalars['Float'];
  longitude: Scalars['Float'];
}>;


export type UpdateCityByLocationMutation = (
  { __typename?: 'Mutation' }
  & { updateCityByLocation: (
    { __typename?: 'UserModel' }
    & Pick<UserModel, 'id' | 'citySelected'>
    & { city: (
      { __typename?: 'CityModel' }
      & CityFragment
    ) }
  ) }
);

export type UpdateUserPhotoMutationVariables = Exact<{
  photo?: Maybe<Scalars['String']>;
}>;


export type UpdateUserPhotoMutation = (
  { __typename?: 'Mutation' }
  & Pick<Mutation, 'setUserPhoto'>
);



export type ResolverTypeWrapper<T> = Promise<T> | T;


export type LegacyStitchingResolver<TResult, TParent, TContext, TArgs> = {
  fragment: string;
  resolve: ResolverFn<TResult, TParent, TContext, TArgs>;
};

export type NewStitchingResolver<TResult, TParent, TContext, TArgs> = {
  selectionSet: string;
  resolve: ResolverFn<TResult, TParent, TContext, TArgs>;
};
export type StitchingResolver<TResult, TParent, TContext, TArgs> = LegacyStitchingResolver<TResult, TParent, TContext, TArgs> | NewStitchingResolver<TResult, TParent, TContext, TArgs>;
export type Resolver<TResult, TParent = {}, TContext = {}, TArgs = {}> =
  | ResolverFn<TResult, TParent, TContext, TArgs>
  | StitchingResolver<TResult, TParent, TContext, TArgs>;

export type ResolverFn<TResult, TParent, TContext, TArgs> = (
  parent: TParent,
  args: TArgs,
  context: TContext,
  info: GraphQLResolveInfo
) => Promise<TResult> | TResult;

export type SubscriptionSubscribeFn<TResult, TParent, TContext, TArgs> = (
  parent: TParent,
  args: TArgs,
  context: TContext,
  info: GraphQLResolveInfo
) => AsyncIterator<TResult> | Promise<AsyncIterator<TResult>>;

export type SubscriptionResolveFn<TResult, TParent, TContext, TArgs> = (
  parent: TParent,
  args: TArgs,
  context: TContext,
  info: GraphQLResolveInfo
) => TResult | Promise<TResult>;

export interface SubscriptionSubscriberObject<TResult, TKey extends string, TParent, TContext, TArgs> {
  subscribe: SubscriptionSubscribeFn<{ [key in TKey]: TResult }, TParent, TContext, TArgs>;
  resolve?: SubscriptionResolveFn<TResult, { [key in TKey]: TResult }, TContext, TArgs>;
}

export interface SubscriptionResolverObject<TResult, TParent, TContext, TArgs> {
  subscribe: SubscriptionSubscribeFn<any, TParent, TContext, TArgs>;
  resolve: SubscriptionResolveFn<TResult, any, TContext, TArgs>;
}

export type SubscriptionObject<TResult, TKey extends string, TParent, TContext, TArgs> =
  | SubscriptionSubscriberObject<TResult, TKey, TParent, TContext, TArgs>
  | SubscriptionResolverObject<TResult, TParent, TContext, TArgs>;

export type SubscriptionResolver<TResult, TKey extends string, TParent = {}, TContext = {}, TArgs = {}> =
  | ((...args: any[]) => SubscriptionObject<TResult, TKey, TParent, TContext, TArgs>)
  | SubscriptionObject<TResult, TKey, TParent, TContext, TArgs>;

export type TypeResolveFn<TTypes, TParent = {}, TContext = {}> = (
  parent: TParent,
  context: TContext,
  info: GraphQLResolveInfo
) => Maybe<TTypes> | Promise<Maybe<TTypes>>;

export type IsTypeOfResolverFn<T = {}> = (obj: T, info: GraphQLResolveInfo) => boolean | Promise<boolean>;

export type NextResolverFn<T> = () => Promise<T>;

export type DirectiveResolverFn<TResult = {}, TParent = {}, TContext = {}, TArgs = {}> = (
  next: NextResolverFn<TResult>,
  parent: TParent,
  args: TArgs,
  context: TContext,
  info: GraphQLResolveInfo
) => TResult | Promise<TResult>;

/** Mapping between all available schema types and the resolvers types */
export type ResolversTypes = {
  Query: ResolverTypeWrapper<{}>;
  UserModel: ResolverTypeWrapper<UserModel>;
  Int: ResolverTypeWrapper<Scalars['Int']>;
  String: ResolverTypeWrapper<Scalars['String']>;
  ProductModel: ResolverTypeWrapper<ProductModel>;
  Boolean: ResolverTypeWrapper<Scalars['Boolean']>;
  Float: ResolverTypeWrapper<Scalars['Float']>;
  PharmacyModel: ResolverTypeWrapper<PharmacyModel>;
  GeoCoordsModel: ResolverTypeWrapper<GeoCoordsModel>;
  ID: ResolverTypeWrapper<Scalars['ID']>;
  CityModel: ResolverTypeWrapper<CityModel>;
  CategoryModel: ResolverTypeWrapper<CategoryModel>;
  SearchModel: ResolverTypeWrapper<SearchModel>;
  BannerModel: ResolverTypeWrapper<BannerModel>;
  PromoActionModel: ResolverTypeWrapper<PromoActionModel>;
  OrdersModel: ResolverTypeWrapper<OrdersModel>;
  OrderModel: ResolverTypeWrapper<OrderModel>;
  CartItemModel: ResolverTypeWrapper<CartItemModel>;
  CartModel: ResolverTypeWrapper<CartModel>;
  CouponListItem: ResolverTypeWrapper<CouponListItem>;
  NotificationModel: ResolverTypeWrapper<NotificationModel>;
  Mutation: ResolverTypeWrapper<{}>;
  LoginInputModel: LoginInputModel;
  RegisterInputModel: RegisterInputModel;
  ForgotTokenInputModel: ForgotTokenInputModel;
  ResetPasswordInputModel: ResetPasswordInputModel;
  UpdateUserDataInputModel: UpdateUserDataInputModel;
  DateTime: ResolverTypeWrapper<Scalars['DateTime']>;
  Sex: Sex;
  EditFavoritesProductsActions: EditFavoritesProductsActions;
  EditCartAction: EditCartAction;
  UserInputModel: UserInputModel;
};

/** Mapping between all available schema types and the resolvers parents */
export type ResolversParentTypes = {
  Query: {};
  UserModel: UserModel;
  Int: Scalars['Int'];
  String: Scalars['String'];
  ProductModel: ProductModel;
  Boolean: Scalars['Boolean'];
  Float: Scalars['Float'];
  PharmacyModel: PharmacyModel;
  GeoCoordsModel: GeoCoordsModel;
  ID: Scalars['ID'];
  CityModel: CityModel;
  CategoryModel: CategoryModel;
  SearchModel: SearchModel;
  BannerModel: BannerModel;
  PromoActionModel: PromoActionModel;
  OrdersModel: OrdersModel;
  OrderModel: OrderModel;
  CartItemModel: CartItemModel;
  CartModel: CartModel;
  CouponListItem: CouponListItem;
  NotificationModel: NotificationModel;
  Mutation: {};
  LoginInputModel: LoginInputModel;
  RegisterInputModel: RegisterInputModel;
  ForgotTokenInputModel: ForgotTokenInputModel;
  ResetPasswordInputModel: ResetPasswordInputModel;
  UpdateUserDataInputModel: UpdateUserDataInputModel;
  DateTime: Scalars['DateTime'];
  UserInputModel: UserInputModel;
};

export type ClientDirectiveArgs = {   always?: Maybe<Scalars['Boolean']>; };

export type ClientDirectiveResolver<Result, Parent, ContextType = ResolverCtx, Args = ClientDirectiveArgs> = DirectiveResolverFn<Result, Parent, ContextType, Args>;

export type BannerModelResolvers<ContextType = ResolverCtx, ParentType extends ResolversParentTypes['BannerModel'] = ResolversParentTypes['BannerModel']> = {
  id?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
  name?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  preview?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  link?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  location?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  appLink?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType>;
};

export type CartItemModelResolvers<ContextType = ResolverCtx, ParentType extends ResolversParentTypes['CartItemModel'] = ResolversParentTypes['CartItemModel']> = {
  id?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
  productId?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
  quantity?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
  price?: Resolver<ResolversTypes['Float'], ParentType, ContextType>;
  oldPrice?: Resolver<ResolversTypes['Float'], ParentType, ContextType>;
  product?: Resolver<ResolversTypes['ProductModel'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType>;
};

export type CartModelResolvers<ContextType = ResolverCtx, ParentType extends ResolversParentTypes['CartModel'] = ResolversParentTypes['CartModel']> = {
  items?: Resolver<Array<ResolversTypes['CartItemModel']>, ParentType, ContextType>;
  quantity?: Resolver<ResolversTypes['Float'], ParentType, ContextType>;
  price?: Resolver<ResolversTypes['Float'], ParentType, ContextType>;
  coupon?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  coupons?: Resolver<Array<ResolversTypes['CouponListItem']>, ParentType, ContextType>;
  id?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
  productIds?: Resolver<Array<ResolversTypes['Int']>, ParentType, ContextType>;
  gifts?: Resolver<Array<ResolversTypes['ProductModel']>, ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType>;
};

export type CategoryModelResolvers<ContextType = ResolverCtx, ParentType extends ResolversParentTypes['CategoryModel'] = ResolversParentTypes['CategoryModel']> = {
  id?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
  name?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  image?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType>;
};

export type CityModelResolvers<ContextType = ResolverCtx, ParentType extends ResolversParentTypes['CityModel'] = ResolversParentTypes['CityModel']> = {
  id?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
  name?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  code?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  storageId?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
  storeTitle?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType>;
};

export type CouponListItemResolvers<ContextType = ResolverCtx, ParentType extends ResolversParentTypes['CouponListItem'] = ResolversParentTypes['CouponListItem']> = {
  id?: Resolver<ResolversTypes['ID'], ParentType, ContextType>;
  discountName?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  active?: Resolver<ResolversTypes['Boolean'], ParentType, ContextType>;
  discountActive?: Resolver<ResolversTypes['Boolean'], ParentType, ContextType>;
  statusText?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType>;
};

export interface DateTimeScalarConfig extends GraphQLScalarTypeConfig<ResolversTypes['DateTime'], any> {
  name: 'DateTime';
}

export type GeoCoordsModelResolvers<ContextType = ResolverCtx, ParentType extends ResolversParentTypes['GeoCoordsModel'] = ResolversParentTypes['GeoCoordsModel']> = {
  id?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
  latitude?: Resolver<ResolversTypes['Float'], ParentType, ContextType>;
  longitude?: Resolver<ResolversTypes['Float'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType>;
};

export type MutationResolvers<ContextType = ResolverCtx, ParentType extends ResolversParentTypes['Mutation'] = ResolversParentTypes['Mutation']> = {
  changeCity?: Resolver<ResolversTypes['Boolean'], ParentType, ContextType, RequireFields<MutationChangeCityArgs, 'newCityId'>>;
  login?: Resolver<ResolversTypes['String'], ParentType, ContextType, RequireFields<MutationLoginArgs, 'data'>>;
  register?: Resolver<ResolversTypes['String'], ParentType, ContextType, RequireFields<MutationRegisterArgs, 'data'>>;
  createForgotToken?: Resolver<ResolversTypes['Int'], ParentType, ContextType, RequireFields<MutationCreateForgotTokenArgs, 'data'>>;
  resetPassword?: Resolver<ResolversTypes['Int'], ParentType, ContextType, RequireFields<MutationResetPasswordArgs, 'data'>>;
  updateUserData?: Resolver<ResolversTypes['Int'], ParentType, ContextType, RequireFields<MutationUpdateUserDataArgs, 'data'>>;
  setUserPhoto?: Resolver<ResolversTypes['String'], ParentType, ContextType, RequireFields<MutationSetUserPhotoArgs, never>>;
  updateCityByLocation?: Resolver<ResolversTypes['UserModel'], ParentType, ContextType, RequireFields<MutationUpdateCityByLocationArgs, 'longitude' | 'latitude'>>;
  editFavoritesPharmacy?: Resolver<Array<ResolversTypes['Int']>, ParentType, ContextType, RequireFields<MutationEditFavoritesPharmacyArgs, 'action'>>;
  editFavoritesProducts?: Resolver<Array<ResolversTypes['Int']>, ParentType, ContextType, RequireFields<MutationEditFavoritesProductsArgs, 'action'>>;
  toggleProductInWishlist?: Resolver<ResolversTypes['ProductModel'], ParentType, ContextType, RequireFields<MutationToggleProductInWishlistArgs, 'id'>>;
  cancelOrder?: Resolver<ResolversTypes['Float'], ParentType, ContextType, RequireFields<MutationCancelOrderArgs, 'orderId'>>;
  createOrder?: Resolver<ResolversTypes['Int'], ParentType, ContextType, RequireFields<MutationCreateOrderArgs, 'pharmacyId'>>;
  reOrder?: Resolver<ResolversTypes['Int'], ParentType, ContextType, RequireFields<MutationReOrderArgs, 'orderId'>>;
  updateCart?: Resolver<ResolversTypes['CartModel'], ParentType, ContextType, RequireFields<MutationUpdateCartArgs, 'productId' | 'editAction'>>;
  addPromoCode?: Resolver<ResolversTypes['CartModel'], ParentType, ContextType, RequireFields<MutationAddPromoCodeArgs, 'coupon'>>;
  deletePromoCode?: Resolver<ResolversTypes['CartModel'], ParentType, ContextType, RequireFields<MutationDeletePromoCodeArgs, 'coupon'>>;
  updateNotifications?: Resolver<ResolversTypes['NotificationModel'], ParentType, ContextType, RequireFields<MutationUpdateNotificationsArgs, 'status' | 'stocks'>>;
  addPushToken?: Resolver<ResolversTypes['Boolean'], ParentType, ContextType, RequireFields<MutationAddPushTokenArgs, 'token'>>;
};

export type NotificationModelResolvers<ContextType = ResolverCtx, ParentType extends ResolversParentTypes['NotificationModel'] = ResolversParentTypes['NotificationModel']> = {
  stocks?: Resolver<ResolversTypes['Boolean'], ParentType, ContextType>;
  status?: Resolver<ResolversTypes['Boolean'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType>;
};

export type OrderModelResolvers<ContextType = ResolverCtx, ParentType extends ResolversParentTypes['OrderModel'] = ResolversParentTypes['OrderModel']> = {
  id?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
  dateInsert?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  userId?: Resolver<ResolversTypes['Float'], ParentType, ContextType>;
  price?: Resolver<ResolversTypes['Float'], ParentType, ContextType>;
  currency?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  isPossibleCancel?: Resolver<ResolversTypes['Boolean'], ParentType, ContextType>;
  priceFormat?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  statusName?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  statusColor?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  basket?: Resolver<Array<ResolversTypes['CartItemModel']>, ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType>;
};

export type OrdersModelResolvers<ContextType = ResolverCtx, ParentType extends ResolversParentTypes['OrdersModel'] = ResolversParentTypes['OrdersModel']> = {
  orders?: Resolver<Array<ResolversTypes['OrderModel']>, ParentType, ContextType>;
  allPage?: Resolver<ResolversTypes['Float'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType>;
};

export type PharmacyModelResolvers<ContextType = ResolverCtx, ParentType extends ResolversParentTypes['PharmacyModel'] = ResolversParentTypes['PharmacyModel']> = {
  address?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  city?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  coordinate?: Resolver<Maybe<ResolversTypes['GeoCoordsModel']>, ParentType, ContextType>;
  description?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  id?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
  isFavourite?: Resolver<ResolversTypes['Boolean'], ParentType, ContextType>;
  latitude?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  longitude?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  metro?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  metroTime?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  phone?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  schedule?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  sort?: Resolver<ResolversTypes['Float'], ParentType, ContextType>;
  store?: Resolver<ResolversTypes['Float'], ParentType, ContextType>;
  title?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  workFriday?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  workMonday?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  workSaturday?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  workSunday?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  workThursday?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  workTuesday?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  workWednesda?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  xmlId?: Resolver<ResolversTypes['ID'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType>;
};

export type ProductModelResolvers<ContextType = ResolverCtx, ParentType extends ResolversParentTypes['ProductModel'] = ResolversParentTypes['ProductModel']> = {
  activeIngredients?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  description?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  detailPageUrl?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  expirationDate?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  form?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  id?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
  inWishlist?: Resolver<ResolversTypes['Boolean'], ParentType, ContextType>;
  isFavourite?: Resolver<ResolversTypes['Boolean'], ParentType, ContextType>;
  isInBasket?: Resolver<ResolversTypes['Boolean'], ParentType, ContextType>;
  manufacturer?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  name?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  needReceipt?: Resolver<ResolversTypes['Boolean'], ParentType, ContextType>;
  oldPrice?: Resolver<ResolversTypes['Float'], ParentType, ContextType>;
  picture?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  preview?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  price?: Resolver<ResolversTypes['Float'], ParentType, ContextType>;
  promotional?: Resolver<ResolversTypes['Boolean'], ParentType, ContextType>;
  quantity?: Resolver<ResolversTypes['Float'], ParentType, ContextType>;
  vendorCode?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType>;
};

export type PromoActionModelResolvers<ContextType = ResolverCtx, ParentType extends ResolversParentTypes['PromoActionModel'] = ResolversParentTypes['PromoActionModel']> = {
  id?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
  name?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  preview?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  previewText?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  detailText?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  products?: Resolver<Array<ResolversTypes['ProductModel']>, ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType>;
};

export type QueryResolvers<ContextType = ResolverCtx, ParentType extends ResolversParentTypes['Query'] = ResolversParentTypes['Query']> = {
  user?: Resolver<ResolversTypes['UserModel'], ParentType, ContextType>;
  categories?: Resolver<Array<ResolversTypes['CategoryModel']>, ParentType, ContextType, RequireFields<QueryCategoriesArgs, never>>;
  category?: Resolver<ResolversTypes['CategoryModel'], ParentType, ContextType, RequireFields<QueryCategoryArgs, 'id'>>;
  pharmacies?: Resolver<Array<ResolversTypes['PharmacyModel']>, ParentType, ContextType>;
  search?: Resolver<ResolversTypes['SearchModel'], ParentType, ContextType, RequireFields<QuerySearchArgs, 'limit' | 'page'>>;
  product?: Resolver<ResolversTypes['ProductModel'], ParentType, ContextType, RequireFields<QueryProductArgs, 'id'>>;
  products?: Resolver<Array<ResolversTypes['ProductModel']>, ParentType, ContextType, RequireFields<QueryProductsArgs, 'categoryId'>>;
  recommended?: Resolver<Array<ResolversTypes['ProductModel']>, ParentType, ContextType>;
  banners?: Resolver<Array<ResolversTypes['BannerModel']>, ParentType, ContextType>;
  promoActions?: Resolver<Array<ResolversTypes['PromoActionModel']>, ParentType, ContextType>;
  city?: Resolver<ResolversTypes['CityModel'], ParentType, ContextType, RequireFields<QueryCityArgs, 'longitude' | 'latitude'>>;
  cities?: Resolver<Array<ResolversTypes['CityModel']>, ParentType, ContextType>;
  orders?: Resolver<ResolversTypes['OrdersModel'], ParentType, ContextType, RequireFields<QueryOrdersArgs, 'page' | 'limit'>>;
  order?: Resolver<ResolversTypes['OrderModel'], ParentType, ContextType, RequireFields<QueryOrderArgs, 'orderId'>>;
  cart?: Resolver<ResolversTypes['CartModel'], ParentType, ContextType>;
  notification?: Resolver<ResolversTypes['NotificationModel'], ParentType, ContextType>;
};

export type SearchModelResolvers<ContextType = ResolverCtx, ParentType extends ResolversParentTypes['SearchModel'] = ResolversParentTypes['SearchModel']> = {
  products?: Resolver<Array<ResolversTypes['ProductModel']>, ParentType, ContextType>;
  allPage?: Resolver<Maybe<ResolversTypes['Float']>, ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType>;
};

export type UserModelResolvers<ContextType = ResolverCtx, ParentType extends ResolversParentTypes['UserModel'] = ResolversParentTypes['UserModel']> = {
  id?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
  login?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  email?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  name?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  secondName?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  lastName?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  personalPhone?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  personalBirthday?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  personalGender?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  personalPhoto?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  favoriteProducts?: Resolver<Array<ResolversTypes['ProductModel']>, ParentType, ContextType>;
  favoritePharmacies?: Resolver<Array<ResolversTypes['PharmacyModel']>, ParentType, ContextType>;
  favoritePharmaciesIds?: Resolver<Array<ResolversTypes['Int']>, ParentType, ContextType>;
  favoriteProductsIds?: Resolver<Array<ResolversTypes['Int']>, ParentType, ContextType>;
  city?: Resolver<ResolversTypes['CityModel'], ParentType, ContextType>;
  citySelected?: Resolver<ResolversTypes['Boolean'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType>;
};

export type Resolvers<ContextType = ResolverCtx> = {
  BannerModel?: BannerModelResolvers<ContextType>;
  CartItemModel?: CartItemModelResolvers<ContextType>;
  CartModel?: CartModelResolvers<ContextType>;
  CategoryModel?: CategoryModelResolvers<ContextType>;
  CityModel?: CityModelResolvers<ContextType>;
  CouponListItem?: CouponListItemResolvers<ContextType>;
  DateTime?: GraphQLScalarType;
  GeoCoordsModel?: GeoCoordsModelResolvers<ContextType>;
  Mutation?: MutationResolvers<ContextType>;
  NotificationModel?: NotificationModelResolvers<ContextType>;
  OrderModel?: OrderModelResolvers<ContextType>;
  OrdersModel?: OrdersModelResolvers<ContextType>;
  PharmacyModel?: PharmacyModelResolvers<ContextType>;
  ProductModel?: ProductModelResolvers<ContextType>;
  PromoActionModel?: PromoActionModelResolvers<ContextType>;
  Query?: QueryResolvers<ContextType>;
  SearchModel?: SearchModelResolvers<ContextType>;
  UserModel?: UserModelResolvers<ContextType>;
};


/**
 * @deprecated
 * Use "Resolvers" root object instead. If you wish to get "IResolvers", add "typesPrefix: I" to your config.
 */
export type IResolvers<ContextType = ResolverCtx> = Resolvers<ContextType>;
export type DirectiveResolvers<ContextType = ResolverCtx> = {
  client?: ClientDirectiveResolver<any, any, ContextType>;
};


/**
 * @deprecated
 * Use "DirectiveResolvers" root object instead. If you wish to get "IDirectiveResolvers", add "typesPrefix: I" to your config.
 */
export type IDirectiveResolvers<ContextType = ResolverCtx> = DirectiveResolvers<ContextType>;
export const CartItemFragmentDoc = gql`
    fragment CartItem on CartItemModel {
  id
  productId
  quantity
}
    `;
export const CartFragmentDoc = gql`
    fragment Cart on CartModel {
  id
  items {
    ...CartItem
  }
  price
  quantity
}
    ${CartItemFragmentDoc}`;
export const ListProductFragmentDoc = gql`
    fragment ListProduct on ProductModel {
  id
  name
  preview
  picture
  oldPrice
  price
  quantity
  needReceipt
  promotional
  detailPageUrl
  inWishlist
  isInBasket @client
  isFavourite @client
}
    `;
export const CartItemWithProductFragmentDoc = gql`
    fragment CartItemWithProduct on CartItemModel {
  id
  productId
  price
  oldPrice
  product {
    ...ListProduct
  }
  quantity
}
    ${ListProductFragmentDoc}`;
export const CartWithProductsFragmentDoc = gql`
    fragment CartWithProducts on CartModel {
  id
  items {
    ...CartItemWithProduct
  }
  price
  quantity
  gifts {
    ...ListProduct
  }
  coupons {
    id
    active
    discountActive
    statusText
    discountName
  }
}
    ${CartItemWithProductFragmentDoc}
${ListProductFragmentDoc}`;
export const ListPharmacyFragmentDoc = gql`
    fragment ListPharmacy on PharmacyModel {
  id
  xmlId
  title
  address
  metro
  latitude
  longitude
  schedule
  store
  workSunday
  workMonday
  workTuesday
  workWednesda
  workThursday
  workFriday
  workSaturday
  phone
  city
  isFavourite @client
  coordinate {
    id
    latitude
    longitude
  }
}
    `;
export const ProductInBasketFragmentDoc = gql`
    fragment ProductInBasket on ProductModel {
  isInBasket @client
}
    `;
export const ProductIsFavoriteFragmentDoc = gql`
    fragment ProductIsFavorite on ProductModel {
  isFavourite @client
}
    `;
export const ProductDataFragmentDoc = gql`
    fragment ProductData on ProductModel {
  id
  name
  picture
  oldPrice
  price
  quantity
  vendorCode
  activeIngredients
  form
  manufacturer
  description
  needReceipt
  promotional
  detailPageUrl
  inWishlist
  expirationDate
  isInBasket @client
  isFavourite @client
}
    `;
export const CityFragmentDoc = gql`
    fragment City on CityModel {
  id
  code
  name
  storageId
  storeTitle
}
    `;
export const UserFragmentDoc = gql`
    fragment User on UserModel {
  id
  login
  email
  name
  secondName
  lastName
  personalPhoto
  personalBirthday
  personalGender
  personalPhone
  favoritePharmaciesIds
  favoriteProductsIds
  city {
    ...City
  }
  citySelected
}
    ${CityFragmentDoc}`;
export const GetCartDocument = gql`
    query GetCart {
  cart {
    ...Cart
  }
}
    ${CartFragmentDoc}`;
export type GetCartComponentProps = Omit<ApolloReactComponents.QueryComponentOptions<GetCartQuery, GetCartQueryVariables>, 'query'>;

    export const GetCartComponent = (props: GetCartComponentProps) => (
      <ApolloReactComponents.Query<GetCartQuery, GetCartQueryVariables> query={GetCartDocument} {...props} />
    );
    

/**
 * __useGetCartQuery__
 *
 * To run a query within a React component, call `useGetCartQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetCartQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetCartQuery({
 *   variables: {
 *   },
 * });
 */
export function useGetCartQuery(baseOptions?: ApolloReactHooks.QueryHookOptions<GetCartQuery, GetCartQueryVariables>) {
        return ApolloReactHooks.useQuery<GetCartQuery, GetCartQueryVariables>(GetCartDocument, baseOptions);
      }
export function useGetCartLazyQuery(baseOptions?: ApolloReactHooks.LazyQueryHookOptions<GetCartQuery, GetCartQueryVariables>) {
          return ApolloReactHooks.useLazyQuery<GetCartQuery, GetCartQueryVariables>(GetCartDocument, baseOptions);
        }
export type GetCartQueryHookResult = ReturnType<typeof useGetCartQuery>;
export type GetCartLazyQueryHookResult = ReturnType<typeof useGetCartLazyQuery>;
export type GetCartQueryResult = ApolloReactCommon.QueryResult<GetCartQuery, GetCartQueryVariables>;
export const GetCartWithProductsDocument = gql`
    query GetCartWithProducts {
  cart {
    ...CartWithProducts
  }
}
    ${CartWithProductsFragmentDoc}`;
export type GetCartWithProductsComponentProps = Omit<ApolloReactComponents.QueryComponentOptions<GetCartWithProductsQuery, GetCartWithProductsQueryVariables>, 'query'>;

    export const GetCartWithProductsComponent = (props: GetCartWithProductsComponentProps) => (
      <ApolloReactComponents.Query<GetCartWithProductsQuery, GetCartWithProductsQueryVariables> query={GetCartWithProductsDocument} {...props} />
    );
    

/**
 * __useGetCartWithProductsQuery__
 *
 * To run a query within a React component, call `useGetCartWithProductsQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetCartWithProductsQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetCartWithProductsQuery({
 *   variables: {
 *   },
 * });
 */
export function useGetCartWithProductsQuery(baseOptions?: ApolloReactHooks.QueryHookOptions<GetCartWithProductsQuery, GetCartWithProductsQueryVariables>) {
        return ApolloReactHooks.useQuery<GetCartWithProductsQuery, GetCartWithProductsQueryVariables>(GetCartWithProductsDocument, baseOptions);
      }
export function useGetCartWithProductsLazyQuery(baseOptions?: ApolloReactHooks.LazyQueryHookOptions<GetCartWithProductsQuery, GetCartWithProductsQueryVariables>) {
          return ApolloReactHooks.useLazyQuery<GetCartWithProductsQuery, GetCartWithProductsQueryVariables>(GetCartWithProductsDocument, baseOptions);
        }
export type GetCartWithProductsQueryHookResult = ReturnType<typeof useGetCartWithProductsQuery>;
export type GetCartWithProductsLazyQueryHookResult = ReturnType<typeof useGetCartWithProductsLazyQuery>;
export type GetCartWithProductsQueryResult = ApolloReactCommon.QueryResult<GetCartWithProductsQuery, GetCartWithProductsQueryVariables>;
export const AddToCartDocument = gql`
    mutation AddToCart($productId: Int!, $quantity: Int!) {
  updateCart(editAction: ADD_PRODUCT, productId: $productId, quantity: $quantity) {
    ...Cart
  }
}
    ${CartFragmentDoc}`;
export type AddToCartMutationFn = ApolloReactCommon.MutationFunction<AddToCartMutation, AddToCartMutationVariables>;
export type AddToCartComponentProps = Omit<ApolloReactComponents.MutationComponentOptions<AddToCartMutation, AddToCartMutationVariables>, 'mutation'>;

    export const AddToCartComponent = (props: AddToCartComponentProps) => (
      <ApolloReactComponents.Mutation<AddToCartMutation, AddToCartMutationVariables> mutation={AddToCartDocument} {...props} />
    );
    

/**
 * __useAddToCartMutation__
 *
 * To run a mutation, you first call `useAddToCartMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useAddToCartMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [addToCartMutation, { data, loading, error }] = useAddToCartMutation({
 *   variables: {
 *      productId: // value for 'productId'
 *      quantity: // value for 'quantity'
 *   },
 * });
 */
export function useAddToCartMutation(baseOptions?: ApolloReactHooks.MutationHookOptions<AddToCartMutation, AddToCartMutationVariables>) {
        return ApolloReactHooks.useMutation<AddToCartMutation, AddToCartMutationVariables>(AddToCartDocument, baseOptions);
      }
export type AddToCartMutationHookResult = ReturnType<typeof useAddToCartMutation>;
export type AddToCartMutationResult = ApolloReactCommon.MutationResult<AddToCartMutation>;
export type AddToCartMutationOptions = ApolloReactCommon.BaseMutationOptions<AddToCartMutation, AddToCartMutationVariables>;
export const UpdateCartDocument = gql`
    mutation UpdateCart($quantity: Int, $productId: Int!, $editAction: EditCartAction!) {
  updateCart(quantity: $quantity, productId: $productId, editAction: $editAction) {
    ...CartWithProducts
  }
}
    ${CartWithProductsFragmentDoc}`;
export type UpdateCartMutationFn = ApolloReactCommon.MutationFunction<UpdateCartMutation, UpdateCartMutationVariables>;
export type UpdateCartComponentProps = Omit<ApolloReactComponents.MutationComponentOptions<UpdateCartMutation, UpdateCartMutationVariables>, 'mutation'>;

    export const UpdateCartComponent = (props: UpdateCartComponentProps) => (
      <ApolloReactComponents.Mutation<UpdateCartMutation, UpdateCartMutationVariables> mutation={UpdateCartDocument} {...props} />
    );
    

/**
 * __useUpdateCartMutation__
 *
 * To run a mutation, you first call `useUpdateCartMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useUpdateCartMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [updateCartMutation, { data, loading, error }] = useUpdateCartMutation({
 *   variables: {
 *      quantity: // value for 'quantity'
 *      productId: // value for 'productId'
 *      editAction: // value for 'editAction'
 *   },
 * });
 */
export function useUpdateCartMutation(baseOptions?: ApolloReactHooks.MutationHookOptions<UpdateCartMutation, UpdateCartMutationVariables>) {
        return ApolloReactHooks.useMutation<UpdateCartMutation, UpdateCartMutationVariables>(UpdateCartDocument, baseOptions);
      }
export type UpdateCartMutationHookResult = ReturnType<typeof useUpdateCartMutation>;
export type UpdateCartMutationResult = ApolloReactCommon.MutationResult<UpdateCartMutation>;
export type UpdateCartMutationOptions = ApolloReactCommon.BaseMutationOptions<UpdateCartMutation, UpdateCartMutationVariables>;
export const AddPromoCodeDocument = gql`
    mutation addPromoCode($coupon: String!) {
  addPromoCode(coupon: $coupon) {
    ...CartWithProducts
  }
}
    ${CartWithProductsFragmentDoc}`;
export type AddPromoCodeMutationFn = ApolloReactCommon.MutationFunction<AddPromoCodeMutation, AddPromoCodeMutationVariables>;
export type AddPromoCodeComponentProps = Omit<ApolloReactComponents.MutationComponentOptions<AddPromoCodeMutation, AddPromoCodeMutationVariables>, 'mutation'>;

    export const AddPromoCodeComponent = (props: AddPromoCodeComponentProps) => (
      <ApolloReactComponents.Mutation<AddPromoCodeMutation, AddPromoCodeMutationVariables> mutation={AddPromoCodeDocument} {...props} />
    );
    

/**
 * __useAddPromoCodeMutation__
 *
 * To run a mutation, you first call `useAddPromoCodeMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useAddPromoCodeMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [addPromoCodeMutation, { data, loading, error }] = useAddPromoCodeMutation({
 *   variables: {
 *      coupon: // value for 'coupon'
 *   },
 * });
 */
export function useAddPromoCodeMutation(baseOptions?: ApolloReactHooks.MutationHookOptions<AddPromoCodeMutation, AddPromoCodeMutationVariables>) {
        return ApolloReactHooks.useMutation<AddPromoCodeMutation, AddPromoCodeMutationVariables>(AddPromoCodeDocument, baseOptions);
      }
export type AddPromoCodeMutationHookResult = ReturnType<typeof useAddPromoCodeMutation>;
export type AddPromoCodeMutationResult = ApolloReactCommon.MutationResult<AddPromoCodeMutation>;
export type AddPromoCodeMutationOptions = ApolloReactCommon.BaseMutationOptions<AddPromoCodeMutation, AddPromoCodeMutationVariables>;
export const DeletePromoCodeDocument = gql`
    mutation deletePromoCode($coupon: String!) {
  deletePromoCode(coupon: $coupon) {
    ...CartWithProducts
  }
}
    ${CartWithProductsFragmentDoc}`;
export type DeletePromoCodeMutationFn = ApolloReactCommon.MutationFunction<DeletePromoCodeMutation, DeletePromoCodeMutationVariables>;
export type DeletePromoCodeComponentProps = Omit<ApolloReactComponents.MutationComponentOptions<DeletePromoCodeMutation, DeletePromoCodeMutationVariables>, 'mutation'>;

    export const DeletePromoCodeComponent = (props: DeletePromoCodeComponentProps) => (
      <ApolloReactComponents.Mutation<DeletePromoCodeMutation, DeletePromoCodeMutationVariables> mutation={DeletePromoCodeDocument} {...props} />
    );
    

/**
 * __useDeletePromoCodeMutation__
 *
 * To run a mutation, you first call `useDeletePromoCodeMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useDeletePromoCodeMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [deletePromoCodeMutation, { data, loading, error }] = useDeletePromoCodeMutation({
 *   variables: {
 *      coupon: // value for 'coupon'
 *   },
 * });
 */
export function useDeletePromoCodeMutation(baseOptions?: ApolloReactHooks.MutationHookOptions<DeletePromoCodeMutation, DeletePromoCodeMutationVariables>) {
        return ApolloReactHooks.useMutation<DeletePromoCodeMutation, DeletePromoCodeMutationVariables>(DeletePromoCodeDocument, baseOptions);
      }
export type DeletePromoCodeMutationHookResult = ReturnType<typeof useDeletePromoCodeMutation>;
export type DeletePromoCodeMutationResult = ApolloReactCommon.MutationResult<DeletePromoCodeMutation>;
export type DeletePromoCodeMutationOptions = ApolloReactCommon.BaseMutationOptions<DeletePromoCodeMutation, DeletePromoCodeMutationVariables>;
export const GetBannersDocument = gql`
    query GetBanners {
  banners {
    id
    location
    preview
    appLink
  }
}
    `;
export type GetBannersComponentProps = Omit<ApolloReactComponents.QueryComponentOptions<GetBannersQuery, GetBannersQueryVariables>, 'query'>;

    export const GetBannersComponent = (props: GetBannersComponentProps) => (
      <ApolloReactComponents.Query<GetBannersQuery, GetBannersQueryVariables> query={GetBannersDocument} {...props} />
    );
    

/**
 * __useGetBannersQuery__
 *
 * To run a query within a React component, call `useGetBannersQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetBannersQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetBannersQuery({
 *   variables: {
 *   },
 * });
 */
export function useGetBannersQuery(baseOptions?: ApolloReactHooks.QueryHookOptions<GetBannersQuery, GetBannersQueryVariables>) {
        return ApolloReactHooks.useQuery<GetBannersQuery, GetBannersQueryVariables>(GetBannersDocument, baseOptions);
      }
export function useGetBannersLazyQuery(baseOptions?: ApolloReactHooks.LazyQueryHookOptions<GetBannersQuery, GetBannersQueryVariables>) {
          return ApolloReactHooks.useLazyQuery<GetBannersQuery, GetBannersQueryVariables>(GetBannersDocument, baseOptions);
        }
export type GetBannersQueryHookResult = ReturnType<typeof useGetBannersQuery>;
export type GetBannersLazyQueryHookResult = ReturnType<typeof useGetBannersLazyQuery>;
export type GetBannersQueryResult = ApolloReactCommon.QueryResult<GetBannersQuery, GetBannersQueryVariables>;
export const GetPromoActionsDocument = gql`
    query GetPromoActions {
  promoActions {
    id
    name
    preview
    previewText
    detailText
    products {
      ...ListProduct
    }
  }
}
    ${ListProductFragmentDoc}`;
export type GetPromoActionsComponentProps = Omit<ApolloReactComponents.QueryComponentOptions<GetPromoActionsQuery, GetPromoActionsQueryVariables>, 'query'>;

    export const GetPromoActionsComponent = (props: GetPromoActionsComponentProps) => (
      <ApolloReactComponents.Query<GetPromoActionsQuery, GetPromoActionsQueryVariables> query={GetPromoActionsDocument} {...props} />
    );
    

/**
 * __useGetPromoActionsQuery__
 *
 * To run a query within a React component, call `useGetPromoActionsQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetPromoActionsQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetPromoActionsQuery({
 *   variables: {
 *   },
 * });
 */
export function useGetPromoActionsQuery(baseOptions?: ApolloReactHooks.QueryHookOptions<GetPromoActionsQuery, GetPromoActionsQueryVariables>) {
        return ApolloReactHooks.useQuery<GetPromoActionsQuery, GetPromoActionsQueryVariables>(GetPromoActionsDocument, baseOptions);
      }
export function useGetPromoActionsLazyQuery(baseOptions?: ApolloReactHooks.LazyQueryHookOptions<GetPromoActionsQuery, GetPromoActionsQueryVariables>) {
          return ApolloReactHooks.useLazyQuery<GetPromoActionsQuery, GetPromoActionsQueryVariables>(GetPromoActionsDocument, baseOptions);
        }
export type GetPromoActionsQueryHookResult = ReturnType<typeof useGetPromoActionsQuery>;
export type GetPromoActionsLazyQueryHookResult = ReturnType<typeof useGetPromoActionsLazyQuery>;
export type GetPromoActionsQueryResult = ApolloReactCommon.QueryResult<GetPromoActionsQuery, GetPromoActionsQueryVariables>;
export const GetCatalogRootDocument = gql`
    query GetCatalogRoot {
  categories {
    id
    name
    image
  }
}
    `;
export type GetCatalogRootComponentProps = Omit<ApolloReactComponents.QueryComponentOptions<GetCatalogRootQuery, GetCatalogRootQueryVariables>, 'query'>;

    export const GetCatalogRootComponent = (props: GetCatalogRootComponentProps) => (
      <ApolloReactComponents.Query<GetCatalogRootQuery, GetCatalogRootQueryVariables> query={GetCatalogRootDocument} {...props} />
    );
    

/**
 * __useGetCatalogRootQuery__
 *
 * To run a query within a React component, call `useGetCatalogRootQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetCatalogRootQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetCatalogRootQuery({
 *   variables: {
 *   },
 * });
 */
export function useGetCatalogRootQuery(baseOptions?: ApolloReactHooks.QueryHookOptions<GetCatalogRootQuery, GetCatalogRootQueryVariables>) {
        return ApolloReactHooks.useQuery<GetCatalogRootQuery, GetCatalogRootQueryVariables>(GetCatalogRootDocument, baseOptions);
      }
export function useGetCatalogRootLazyQuery(baseOptions?: ApolloReactHooks.LazyQueryHookOptions<GetCatalogRootQuery, GetCatalogRootQueryVariables>) {
          return ApolloReactHooks.useLazyQuery<GetCatalogRootQuery, GetCatalogRootQueryVariables>(GetCatalogRootDocument, baseOptions);
        }
export type GetCatalogRootQueryHookResult = ReturnType<typeof useGetCatalogRootQuery>;
export type GetCatalogRootLazyQueryHookResult = ReturnType<typeof useGetCatalogRootLazyQuery>;
export type GetCatalogRootQueryResult = ApolloReactCommon.QueryResult<GetCatalogRootQuery, GetCatalogRootQueryVariables>;
export const GetCategoriesDocument = gql`
    query GetCategories($id: Int!) {
  categories(id: $id) {
    id
    name
  }
}
    `;
export type GetCategoriesComponentProps = Omit<ApolloReactComponents.QueryComponentOptions<GetCategoriesQuery, GetCategoriesQueryVariables>, 'query'> & ({ variables: GetCategoriesQueryVariables; skip?: boolean; } | { skip: boolean; });

    export const GetCategoriesComponent = (props: GetCategoriesComponentProps) => (
      <ApolloReactComponents.Query<GetCategoriesQuery, GetCategoriesQueryVariables> query={GetCategoriesDocument} {...props} />
    );
    

/**
 * __useGetCategoriesQuery__
 *
 * To run a query within a React component, call `useGetCategoriesQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetCategoriesQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetCategoriesQuery({
 *   variables: {
 *      id: // value for 'id'
 *   },
 * });
 */
export function useGetCategoriesQuery(baseOptions?: ApolloReactHooks.QueryHookOptions<GetCategoriesQuery, GetCategoriesQueryVariables>) {
        return ApolloReactHooks.useQuery<GetCategoriesQuery, GetCategoriesQueryVariables>(GetCategoriesDocument, baseOptions);
      }
export function useGetCategoriesLazyQuery(baseOptions?: ApolloReactHooks.LazyQueryHookOptions<GetCategoriesQuery, GetCategoriesQueryVariables>) {
          return ApolloReactHooks.useLazyQuery<GetCategoriesQuery, GetCategoriesQueryVariables>(GetCategoriesDocument, baseOptions);
        }
export type GetCategoriesQueryHookResult = ReturnType<typeof useGetCategoriesQuery>;
export type GetCategoriesLazyQueryHookResult = ReturnType<typeof useGetCategoriesLazyQuery>;
export type GetCategoriesQueryResult = ApolloReactCommon.QueryResult<GetCategoriesQuery, GetCategoriesQueryVariables>;
export const GetRecommendedDocument = gql`
    query GetRecommended {
  recommended {
    ...ListProduct
  }
}
    ${ListProductFragmentDoc}`;
export type GetRecommendedComponentProps = Omit<ApolloReactComponents.QueryComponentOptions<GetRecommendedQuery, GetRecommendedQueryVariables>, 'query'>;

    export const GetRecommendedComponent = (props: GetRecommendedComponentProps) => (
      <ApolloReactComponents.Query<GetRecommendedQuery, GetRecommendedQueryVariables> query={GetRecommendedDocument} {...props} />
    );
    

/**
 * __useGetRecommendedQuery__
 *
 * To run a query within a React component, call `useGetRecommendedQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetRecommendedQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetRecommendedQuery({
 *   variables: {
 *   },
 * });
 */
export function useGetRecommendedQuery(baseOptions?: ApolloReactHooks.QueryHookOptions<GetRecommendedQuery, GetRecommendedQueryVariables>) {
        return ApolloReactHooks.useQuery<GetRecommendedQuery, GetRecommendedQueryVariables>(GetRecommendedDocument, baseOptions);
      }
export function useGetRecommendedLazyQuery(baseOptions?: ApolloReactHooks.LazyQueryHookOptions<GetRecommendedQuery, GetRecommendedQueryVariables>) {
          return ApolloReactHooks.useLazyQuery<GetRecommendedQuery, GetRecommendedQueryVariables>(GetRecommendedDocument, baseOptions);
        }
export type GetRecommendedQueryHookResult = ReturnType<typeof useGetRecommendedQuery>;
export type GetRecommendedLazyQueryHookResult = ReturnType<typeof useGetRecommendedLazyQuery>;
export type GetRecommendedQueryResult = ApolloReactCommon.QueryResult<GetRecommendedQuery, GetRecommendedQueryVariables>;
export const GetCitiesDocument = gql`
    query GetCities {
  cities {
    ...City
  }
}
    ${CityFragmentDoc}`;
export type GetCitiesComponentProps = Omit<ApolloReactComponents.QueryComponentOptions<GetCitiesQuery, GetCitiesQueryVariables>, 'query'>;

    export const GetCitiesComponent = (props: GetCitiesComponentProps) => (
      <ApolloReactComponents.Query<GetCitiesQuery, GetCitiesQueryVariables> query={GetCitiesDocument} {...props} />
    );
    

/**
 * __useGetCitiesQuery__
 *
 * To run a query within a React component, call `useGetCitiesQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetCitiesQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetCitiesQuery({
 *   variables: {
 *   },
 * });
 */
export function useGetCitiesQuery(baseOptions?: ApolloReactHooks.QueryHookOptions<GetCitiesQuery, GetCitiesQueryVariables>) {
        return ApolloReactHooks.useQuery<GetCitiesQuery, GetCitiesQueryVariables>(GetCitiesDocument, baseOptions);
      }
export function useGetCitiesLazyQuery(baseOptions?: ApolloReactHooks.LazyQueryHookOptions<GetCitiesQuery, GetCitiesQueryVariables>) {
          return ApolloReactHooks.useLazyQuery<GetCitiesQuery, GetCitiesQueryVariables>(GetCitiesDocument, baseOptions);
        }
export type GetCitiesQueryHookResult = ReturnType<typeof useGetCitiesQuery>;
export type GetCitiesLazyQueryHookResult = ReturnType<typeof useGetCitiesLazyQuery>;
export type GetCitiesQueryResult = ApolloReactCommon.QueryResult<GetCitiesQuery, GetCitiesQueryVariables>;
export const GetCityDocument = gql`
    query GetCity($longitude: Float!, $latitude: Float!) {
  city(longitude: $longitude, latitude: $latitude) {
    ...City
  }
}
    ${CityFragmentDoc}`;
export type GetCityComponentProps = Omit<ApolloReactComponents.QueryComponentOptions<GetCityQuery, GetCityQueryVariables>, 'query'> & ({ variables: GetCityQueryVariables; skip?: boolean; } | { skip: boolean; });

    export const GetCityComponent = (props: GetCityComponentProps) => (
      <ApolloReactComponents.Query<GetCityQuery, GetCityQueryVariables> query={GetCityDocument} {...props} />
    );
    

/**
 * __useGetCityQuery__
 *
 * To run a query within a React component, call `useGetCityQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetCityQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetCityQuery({
 *   variables: {
 *      longitude: // value for 'longitude'
 *      latitude: // value for 'latitude'
 *   },
 * });
 */
export function useGetCityQuery(baseOptions?: ApolloReactHooks.QueryHookOptions<GetCityQuery, GetCityQueryVariables>) {
        return ApolloReactHooks.useQuery<GetCityQuery, GetCityQueryVariables>(GetCityDocument, baseOptions);
      }
export function useGetCityLazyQuery(baseOptions?: ApolloReactHooks.LazyQueryHookOptions<GetCityQuery, GetCityQueryVariables>) {
          return ApolloReactHooks.useLazyQuery<GetCityQuery, GetCityQueryVariables>(GetCityDocument, baseOptions);
        }
export type GetCityQueryHookResult = ReturnType<typeof useGetCityQuery>;
export type GetCityLazyQueryHookResult = ReturnType<typeof useGetCityLazyQuery>;
export type GetCityQueryResult = ApolloReactCommon.QueryResult<GetCityQuery, GetCityQueryVariables>;
export const ChangeCityDocument = gql`
    mutation changeCity($id: Int!) {
  changeCity(newCityId: $id)
}
    `;
export type ChangeCityMutationFn = ApolloReactCommon.MutationFunction<ChangeCityMutation, ChangeCityMutationVariables>;
export type ChangeCityComponentProps = Omit<ApolloReactComponents.MutationComponentOptions<ChangeCityMutation, ChangeCityMutationVariables>, 'mutation'>;

    export const ChangeCityComponent = (props: ChangeCityComponentProps) => (
      <ApolloReactComponents.Mutation<ChangeCityMutation, ChangeCityMutationVariables> mutation={ChangeCityDocument} {...props} />
    );
    

/**
 * __useChangeCityMutation__
 *
 * To run a mutation, you first call `useChangeCityMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useChangeCityMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [changeCityMutation, { data, loading, error }] = useChangeCityMutation({
 *   variables: {
 *      id: // value for 'id'
 *   },
 * });
 */
export function useChangeCityMutation(baseOptions?: ApolloReactHooks.MutationHookOptions<ChangeCityMutation, ChangeCityMutationVariables>) {
        return ApolloReactHooks.useMutation<ChangeCityMutation, ChangeCityMutationVariables>(ChangeCityDocument, baseOptions);
      }
export type ChangeCityMutationHookResult = ReturnType<typeof useChangeCityMutation>;
export type ChangeCityMutationResult = ApolloReactCommon.MutationResult<ChangeCityMutation>;
export type ChangeCityMutationOptions = ApolloReactCommon.BaseMutationOptions<ChangeCityMutation, ChangeCityMutationVariables>;
export const AddPushTokenDocument = gql`
    mutation AddPushToken($token: String!) {
  addPushToken(token: $token)
}
    `;
export type AddPushTokenMutationFn = ApolloReactCommon.MutationFunction<AddPushTokenMutation, AddPushTokenMutationVariables>;
export type AddPushTokenComponentProps = Omit<ApolloReactComponents.MutationComponentOptions<AddPushTokenMutation, AddPushTokenMutationVariables>, 'mutation'>;

    export const AddPushTokenComponent = (props: AddPushTokenComponentProps) => (
      <ApolloReactComponents.Mutation<AddPushTokenMutation, AddPushTokenMutationVariables> mutation={AddPushTokenDocument} {...props} />
    );
    

/**
 * __useAddPushTokenMutation__
 *
 * To run a mutation, you first call `useAddPushTokenMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useAddPushTokenMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [addPushTokenMutation, { data, loading, error }] = useAddPushTokenMutation({
 *   variables: {
 *      token: // value for 'token'
 *   },
 * });
 */
export function useAddPushTokenMutation(baseOptions?: ApolloReactHooks.MutationHookOptions<AddPushTokenMutation, AddPushTokenMutationVariables>) {
        return ApolloReactHooks.useMutation<AddPushTokenMutation, AddPushTokenMutationVariables>(AddPushTokenDocument, baseOptions);
      }
export type AddPushTokenMutationHookResult = ReturnType<typeof useAddPushTokenMutation>;
export type AddPushTokenMutationResult = ApolloReactCommon.MutationResult<AddPushTokenMutation>;
export type AddPushTokenMutationOptions = ApolloReactCommon.BaseMutationOptions<AddPushTokenMutation, AddPushTokenMutationVariables>;
export const UpdateNotificationsSettingsDocument = gql`
    mutation UpdateNotificationsSettings($status: Boolean!, $stocks: Boolean!) {
  updateNotifications(status: $status, stocks: $stocks) {
    status
    stocks
  }
}
    `;
export type UpdateNotificationsSettingsMutationFn = ApolloReactCommon.MutationFunction<UpdateNotificationsSettingsMutation, UpdateNotificationsSettingsMutationVariables>;
export type UpdateNotificationsSettingsComponentProps = Omit<ApolloReactComponents.MutationComponentOptions<UpdateNotificationsSettingsMutation, UpdateNotificationsSettingsMutationVariables>, 'mutation'>;

    export const UpdateNotificationsSettingsComponent = (props: UpdateNotificationsSettingsComponentProps) => (
      <ApolloReactComponents.Mutation<UpdateNotificationsSettingsMutation, UpdateNotificationsSettingsMutationVariables> mutation={UpdateNotificationsSettingsDocument} {...props} />
    );
    

/**
 * __useUpdateNotificationsSettingsMutation__
 *
 * To run a mutation, you first call `useUpdateNotificationsSettingsMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useUpdateNotificationsSettingsMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [updateNotificationsSettingsMutation, { data, loading, error }] = useUpdateNotificationsSettingsMutation({
 *   variables: {
 *      status: // value for 'status'
 *      stocks: // value for 'stocks'
 *   },
 * });
 */
export function useUpdateNotificationsSettingsMutation(baseOptions?: ApolloReactHooks.MutationHookOptions<UpdateNotificationsSettingsMutation, UpdateNotificationsSettingsMutationVariables>) {
        return ApolloReactHooks.useMutation<UpdateNotificationsSettingsMutation, UpdateNotificationsSettingsMutationVariables>(UpdateNotificationsSettingsDocument, baseOptions);
      }
export type UpdateNotificationsSettingsMutationHookResult = ReturnType<typeof useUpdateNotificationsSettingsMutation>;
export type UpdateNotificationsSettingsMutationResult = ApolloReactCommon.MutationResult<UpdateNotificationsSettingsMutation>;
export type UpdateNotificationsSettingsMutationOptions = ApolloReactCommon.BaseMutationOptions<UpdateNotificationsSettingsMutation, UpdateNotificationsSettingsMutationVariables>;
export const GetNotificationSettingsDocument = gql`
    query GetNotificationSettings {
  notification {
    status
    stocks
  }
}
    `;
export type GetNotificationSettingsComponentProps = Omit<ApolloReactComponents.QueryComponentOptions<GetNotificationSettingsQuery, GetNotificationSettingsQueryVariables>, 'query'>;

    export const GetNotificationSettingsComponent = (props: GetNotificationSettingsComponentProps) => (
      <ApolloReactComponents.Query<GetNotificationSettingsQuery, GetNotificationSettingsQueryVariables> query={GetNotificationSettingsDocument} {...props} />
    );
    

/**
 * __useGetNotificationSettingsQuery__
 *
 * To run a query within a React component, call `useGetNotificationSettingsQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetNotificationSettingsQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetNotificationSettingsQuery({
 *   variables: {
 *   },
 * });
 */
export function useGetNotificationSettingsQuery(baseOptions?: ApolloReactHooks.QueryHookOptions<GetNotificationSettingsQuery, GetNotificationSettingsQueryVariables>) {
        return ApolloReactHooks.useQuery<GetNotificationSettingsQuery, GetNotificationSettingsQueryVariables>(GetNotificationSettingsDocument, baseOptions);
      }
export function useGetNotificationSettingsLazyQuery(baseOptions?: ApolloReactHooks.LazyQueryHookOptions<GetNotificationSettingsQuery, GetNotificationSettingsQueryVariables>) {
          return ApolloReactHooks.useLazyQuery<GetNotificationSettingsQuery, GetNotificationSettingsQueryVariables>(GetNotificationSettingsDocument, baseOptions);
        }
export type GetNotificationSettingsQueryHookResult = ReturnType<typeof useGetNotificationSettingsQuery>;
export type GetNotificationSettingsLazyQueryHookResult = ReturnType<typeof useGetNotificationSettingsLazyQuery>;
export type GetNotificationSettingsQueryResult = ApolloReactCommon.QueryResult<GetNotificationSettingsQuery, GetNotificationSettingsQueryVariables>;
export const GetOrderDocument = gql`
    query GetOrder($orderId: Int!) {
  order(orderId: $orderId) {
    id
    dateInsert
    userId
    price
    currency
    isPossibleCancel
    priceFormat
    statusName
    statusColor
    basket {
      ...CartItemWithProduct
    }
  }
}
    ${CartItemWithProductFragmentDoc}`;
export type GetOrderComponentProps = Omit<ApolloReactComponents.QueryComponentOptions<GetOrderQuery, GetOrderQueryVariables>, 'query'> & ({ variables: GetOrderQueryVariables; skip?: boolean; } | { skip: boolean; });

    export const GetOrderComponent = (props: GetOrderComponentProps) => (
      <ApolloReactComponents.Query<GetOrderQuery, GetOrderQueryVariables> query={GetOrderDocument} {...props} />
    );
    

/**
 * __useGetOrderQuery__
 *
 * To run a query within a React component, call `useGetOrderQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetOrderQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetOrderQuery({
 *   variables: {
 *      orderId: // value for 'orderId'
 *   },
 * });
 */
export function useGetOrderQuery(baseOptions?: ApolloReactHooks.QueryHookOptions<GetOrderQuery, GetOrderQueryVariables>) {
        return ApolloReactHooks.useQuery<GetOrderQuery, GetOrderQueryVariables>(GetOrderDocument, baseOptions);
      }
export function useGetOrderLazyQuery(baseOptions?: ApolloReactHooks.LazyQueryHookOptions<GetOrderQuery, GetOrderQueryVariables>) {
          return ApolloReactHooks.useLazyQuery<GetOrderQuery, GetOrderQueryVariables>(GetOrderDocument, baseOptions);
        }
export type GetOrderQueryHookResult = ReturnType<typeof useGetOrderQuery>;
export type GetOrderLazyQueryHookResult = ReturnType<typeof useGetOrderLazyQuery>;
export type GetOrderQueryResult = ApolloReactCommon.QueryResult<GetOrderQuery, GetOrderQueryVariables>;
export const GetOrdersDocument = gql`
    query GetOrders($page: Int!, $limit: Int!) {
  orders(page: $page, limit: $limit) {
    orders {
      id
      dateInsert
      isPossibleCancel
      statusName
      statusColor
    }
    allPage
  }
}
    `;
export type GetOrdersComponentProps = Omit<ApolloReactComponents.QueryComponentOptions<GetOrdersQuery, GetOrdersQueryVariables>, 'query'> & ({ variables: GetOrdersQueryVariables; skip?: boolean; } | { skip: boolean; });

    export const GetOrdersComponent = (props: GetOrdersComponentProps) => (
      <ApolloReactComponents.Query<GetOrdersQuery, GetOrdersQueryVariables> query={GetOrdersDocument} {...props} />
    );
    

/**
 * __useGetOrdersQuery__
 *
 * To run a query within a React component, call `useGetOrdersQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetOrdersQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetOrdersQuery({
 *   variables: {
 *      page: // value for 'page'
 *      limit: // value for 'limit'
 *   },
 * });
 */
export function useGetOrdersQuery(baseOptions?: ApolloReactHooks.QueryHookOptions<GetOrdersQuery, GetOrdersQueryVariables>) {
        return ApolloReactHooks.useQuery<GetOrdersQuery, GetOrdersQueryVariables>(GetOrdersDocument, baseOptions);
      }
export function useGetOrdersLazyQuery(baseOptions?: ApolloReactHooks.LazyQueryHookOptions<GetOrdersQuery, GetOrdersQueryVariables>) {
          return ApolloReactHooks.useLazyQuery<GetOrdersQuery, GetOrdersQueryVariables>(GetOrdersDocument, baseOptions);
        }
export type GetOrdersQueryHookResult = ReturnType<typeof useGetOrdersQuery>;
export type GetOrdersLazyQueryHookResult = ReturnType<typeof useGetOrdersLazyQuery>;
export type GetOrdersQueryResult = ApolloReactCommon.QueryResult<GetOrdersQuery, GetOrdersQueryVariables>;
export const CancelOrderDocument = gql`
    mutation CancelOrder($orderId: Int!) {
  cancelOrder(orderId: $orderId)
}
    `;
export type CancelOrderMutationFn = ApolloReactCommon.MutationFunction<CancelOrderMutation, CancelOrderMutationVariables>;
export type CancelOrderComponentProps = Omit<ApolloReactComponents.MutationComponentOptions<CancelOrderMutation, CancelOrderMutationVariables>, 'mutation'>;

    export const CancelOrderComponent = (props: CancelOrderComponentProps) => (
      <ApolloReactComponents.Mutation<CancelOrderMutation, CancelOrderMutationVariables> mutation={CancelOrderDocument} {...props} />
    );
    

/**
 * __useCancelOrderMutation__
 *
 * To run a mutation, you first call `useCancelOrderMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useCancelOrderMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [cancelOrderMutation, { data, loading, error }] = useCancelOrderMutation({
 *   variables: {
 *      orderId: // value for 'orderId'
 *   },
 * });
 */
export function useCancelOrderMutation(baseOptions?: ApolloReactHooks.MutationHookOptions<CancelOrderMutation, CancelOrderMutationVariables>) {
        return ApolloReactHooks.useMutation<CancelOrderMutation, CancelOrderMutationVariables>(CancelOrderDocument, baseOptions);
      }
export type CancelOrderMutationHookResult = ReturnType<typeof useCancelOrderMutation>;
export type CancelOrderMutationResult = ApolloReactCommon.MutationResult<CancelOrderMutation>;
export type CancelOrderMutationOptions = ApolloReactCommon.BaseMutationOptions<CancelOrderMutation, CancelOrderMutationVariables>;
export const CreateOrderDocument = gql`
    mutation CreateOrder($pharmacyId: Int!) {
  createOrder(pharmacyId: $pharmacyId)
}
    `;
export type CreateOrderMutationFn = ApolloReactCommon.MutationFunction<CreateOrderMutation, CreateOrderMutationVariables>;
export type CreateOrderComponentProps = Omit<ApolloReactComponents.MutationComponentOptions<CreateOrderMutation, CreateOrderMutationVariables>, 'mutation'>;

    export const CreateOrderComponent = (props: CreateOrderComponentProps) => (
      <ApolloReactComponents.Mutation<CreateOrderMutation, CreateOrderMutationVariables> mutation={CreateOrderDocument} {...props} />
    );
    

/**
 * __useCreateOrderMutation__
 *
 * To run a mutation, you first call `useCreateOrderMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useCreateOrderMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [createOrderMutation, { data, loading, error }] = useCreateOrderMutation({
 *   variables: {
 *      pharmacyId: // value for 'pharmacyId'
 *   },
 * });
 */
export function useCreateOrderMutation(baseOptions?: ApolloReactHooks.MutationHookOptions<CreateOrderMutation, CreateOrderMutationVariables>) {
        return ApolloReactHooks.useMutation<CreateOrderMutation, CreateOrderMutationVariables>(CreateOrderDocument, baseOptions);
      }
export type CreateOrderMutationHookResult = ReturnType<typeof useCreateOrderMutation>;
export type CreateOrderMutationResult = ApolloReactCommon.MutationResult<CreateOrderMutation>;
export type CreateOrderMutationOptions = ApolloReactCommon.BaseMutationOptions<CreateOrderMutation, CreateOrderMutationVariables>;
export const ReOrderDocument = gql`
    mutation ReOrder($orderId: Int!) {
  reOrder(orderId: $orderId)
}
    `;
export type ReOrderMutationFn = ApolloReactCommon.MutationFunction<ReOrderMutation, ReOrderMutationVariables>;
export type ReOrderComponentProps = Omit<ApolloReactComponents.MutationComponentOptions<ReOrderMutation, ReOrderMutationVariables>, 'mutation'>;

    export const ReOrderComponent = (props: ReOrderComponentProps) => (
      <ApolloReactComponents.Mutation<ReOrderMutation, ReOrderMutationVariables> mutation={ReOrderDocument} {...props} />
    );
    

/**
 * __useReOrderMutation__
 *
 * To run a mutation, you first call `useReOrderMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useReOrderMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [reOrderMutation, { data, loading, error }] = useReOrderMutation({
 *   variables: {
 *      orderId: // value for 'orderId'
 *   },
 * });
 */
export function useReOrderMutation(baseOptions?: ApolloReactHooks.MutationHookOptions<ReOrderMutation, ReOrderMutationVariables>) {
        return ApolloReactHooks.useMutation<ReOrderMutation, ReOrderMutationVariables>(ReOrderDocument, baseOptions);
      }
export type ReOrderMutationHookResult = ReturnType<typeof useReOrderMutation>;
export type ReOrderMutationResult = ApolloReactCommon.MutationResult<ReOrderMutation>;
export type ReOrderMutationOptions = ApolloReactCommon.BaseMutationOptions<ReOrderMutation, ReOrderMutationVariables>;
export const EditFavouritePharmacyDocument = gql`
    mutation EditFavouritePharmacy($action: EditFavoritesProductsActions!, $id: Int) {
  editFavoritesPharmacy(action: $action, pharmacyId: $id)
}
    `;
export type EditFavouritePharmacyMutationFn = ApolloReactCommon.MutationFunction<EditFavouritePharmacyMutation, EditFavouritePharmacyMutationVariables>;
export type EditFavouritePharmacyComponentProps = Omit<ApolloReactComponents.MutationComponentOptions<EditFavouritePharmacyMutation, EditFavouritePharmacyMutationVariables>, 'mutation'>;

    export const EditFavouritePharmacyComponent = (props: EditFavouritePharmacyComponentProps) => (
      <ApolloReactComponents.Mutation<EditFavouritePharmacyMutation, EditFavouritePharmacyMutationVariables> mutation={EditFavouritePharmacyDocument} {...props} />
    );
    

/**
 * __useEditFavouritePharmacyMutation__
 *
 * To run a mutation, you first call `useEditFavouritePharmacyMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useEditFavouritePharmacyMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [editFavouritePharmacyMutation, { data, loading, error }] = useEditFavouritePharmacyMutation({
 *   variables: {
 *      action: // value for 'action'
 *      id: // value for 'id'
 *   },
 * });
 */
export function useEditFavouritePharmacyMutation(baseOptions?: ApolloReactHooks.MutationHookOptions<EditFavouritePharmacyMutation, EditFavouritePharmacyMutationVariables>) {
        return ApolloReactHooks.useMutation<EditFavouritePharmacyMutation, EditFavouritePharmacyMutationVariables>(EditFavouritePharmacyDocument, baseOptions);
      }
export type EditFavouritePharmacyMutationHookResult = ReturnType<typeof useEditFavouritePharmacyMutation>;
export type EditFavouritePharmacyMutationResult = ApolloReactCommon.MutationResult<EditFavouritePharmacyMutation>;
export type EditFavouritePharmacyMutationOptions = ApolloReactCommon.BaseMutationOptions<EditFavouritePharmacyMutation, EditFavouritePharmacyMutationVariables>;
export const GetPharmaciesDocument = gql`
    query GetPharmacies {
  pharmacies {
    ...ListPharmacy
  }
}
    ${ListPharmacyFragmentDoc}`;
export type GetPharmaciesComponentProps = Omit<ApolloReactComponents.QueryComponentOptions<GetPharmaciesQuery, GetPharmaciesQueryVariables>, 'query'>;

    export const GetPharmaciesComponent = (props: GetPharmaciesComponentProps) => (
      <ApolloReactComponents.Query<GetPharmaciesQuery, GetPharmaciesQueryVariables> query={GetPharmaciesDocument} {...props} />
    );
    

/**
 * __useGetPharmaciesQuery__
 *
 * To run a query within a React component, call `useGetPharmaciesQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetPharmaciesQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetPharmaciesQuery({
 *   variables: {
 *   },
 * });
 */
export function useGetPharmaciesQuery(baseOptions?: ApolloReactHooks.QueryHookOptions<GetPharmaciesQuery, GetPharmaciesQueryVariables>) {
        return ApolloReactHooks.useQuery<GetPharmaciesQuery, GetPharmaciesQueryVariables>(GetPharmaciesDocument, baseOptions);
      }
export function useGetPharmaciesLazyQuery(baseOptions?: ApolloReactHooks.LazyQueryHookOptions<GetPharmaciesQuery, GetPharmaciesQueryVariables>) {
          return ApolloReactHooks.useLazyQuery<GetPharmaciesQuery, GetPharmaciesQueryVariables>(GetPharmaciesDocument, baseOptions);
        }
export type GetPharmaciesQueryHookResult = ReturnType<typeof useGetPharmaciesQuery>;
export type GetPharmaciesLazyQueryHookResult = ReturnType<typeof useGetPharmaciesLazyQuery>;
export type GetPharmaciesQueryResult = ApolloReactCommon.QueryResult<GetPharmaciesQuery, GetPharmaciesQueryVariables>;
export const EditFavouriteProductDocument = gql`
    mutation EditFavouriteProduct($action: EditFavoritesProductsActions!, $id: Int) {
  editFavoritesProducts(action: $action, productId: $id)
}
    `;
export type EditFavouriteProductMutationFn = ApolloReactCommon.MutationFunction<EditFavouriteProductMutation, EditFavouriteProductMutationVariables>;
export type EditFavouriteProductComponentProps = Omit<ApolloReactComponents.MutationComponentOptions<EditFavouriteProductMutation, EditFavouriteProductMutationVariables>, 'mutation'>;

    export const EditFavouriteProductComponent = (props: EditFavouriteProductComponentProps) => (
      <ApolloReactComponents.Mutation<EditFavouriteProductMutation, EditFavouriteProductMutationVariables> mutation={EditFavouriteProductDocument} {...props} />
    );
    

/**
 * __useEditFavouriteProductMutation__
 *
 * To run a mutation, you first call `useEditFavouriteProductMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useEditFavouriteProductMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [editFavouriteProductMutation, { data, loading, error }] = useEditFavouriteProductMutation({
 *   variables: {
 *      action: // value for 'action'
 *      id: // value for 'id'
 *   },
 * });
 */
export function useEditFavouriteProductMutation(baseOptions?: ApolloReactHooks.MutationHookOptions<EditFavouriteProductMutation, EditFavouriteProductMutationVariables>) {
        return ApolloReactHooks.useMutation<EditFavouriteProductMutation, EditFavouriteProductMutationVariables>(EditFavouriteProductDocument, baseOptions);
      }
export type EditFavouriteProductMutationHookResult = ReturnType<typeof useEditFavouriteProductMutation>;
export type EditFavouriteProductMutationResult = ApolloReactCommon.MutationResult<EditFavouriteProductMutation>;
export type EditFavouriteProductMutationOptions = ApolloReactCommon.BaseMutationOptions<EditFavouriteProductMutation, EditFavouriteProductMutationVariables>;
export const ToggleProductInWishlistDocument = gql`
    mutation ToggleProductInWishlist($id: Int!) {
  toggleProductInWishlist(id: $id) {
    id
    inWishlist
  }
}
    `;
export type ToggleProductInWishlistMutationFn = ApolloReactCommon.MutationFunction<ToggleProductInWishlistMutation, ToggleProductInWishlistMutationVariables>;
export type ToggleProductInWishlistComponentProps = Omit<ApolloReactComponents.MutationComponentOptions<ToggleProductInWishlistMutation, ToggleProductInWishlistMutationVariables>, 'mutation'>;

    export const ToggleProductInWishlistComponent = (props: ToggleProductInWishlistComponentProps) => (
      <ApolloReactComponents.Mutation<ToggleProductInWishlistMutation, ToggleProductInWishlistMutationVariables> mutation={ToggleProductInWishlistDocument} {...props} />
    );
    

/**
 * __useToggleProductInWishlistMutation__
 *
 * To run a mutation, you first call `useToggleProductInWishlistMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useToggleProductInWishlistMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [toggleProductInWishlistMutation, { data, loading, error }] = useToggleProductInWishlistMutation({
 *   variables: {
 *      id: // value for 'id'
 *   },
 * });
 */
export function useToggleProductInWishlistMutation(baseOptions?: ApolloReactHooks.MutationHookOptions<ToggleProductInWishlistMutation, ToggleProductInWishlistMutationVariables>) {
        return ApolloReactHooks.useMutation<ToggleProductInWishlistMutation, ToggleProductInWishlistMutationVariables>(ToggleProductInWishlistDocument, baseOptions);
      }
export type ToggleProductInWishlistMutationHookResult = ReturnType<typeof useToggleProductInWishlistMutation>;
export type ToggleProductInWishlistMutationResult = ApolloReactCommon.MutationResult<ToggleProductInWishlistMutation>;
export type ToggleProductInWishlistMutationOptions = ApolloReactCommon.BaseMutationOptions<ToggleProductInWishlistMutation, ToggleProductInWishlistMutationVariables>;
export const GetFavouriteProductsDocument = gql`
    query GetFavouriteProducts {
  user {
    id
    favoriteProducts {
      ...ListProduct
    }
  }
}
    ${ListProductFragmentDoc}`;
export type GetFavouriteProductsComponentProps = Omit<ApolloReactComponents.QueryComponentOptions<GetFavouriteProductsQuery, GetFavouriteProductsQueryVariables>, 'query'>;

    export const GetFavouriteProductsComponent = (props: GetFavouriteProductsComponentProps) => (
      <ApolloReactComponents.Query<GetFavouriteProductsQuery, GetFavouriteProductsQueryVariables> query={GetFavouriteProductsDocument} {...props} />
    );
    

/**
 * __useGetFavouriteProductsQuery__
 *
 * To run a query within a React component, call `useGetFavouriteProductsQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetFavouriteProductsQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetFavouriteProductsQuery({
 *   variables: {
 *   },
 * });
 */
export function useGetFavouriteProductsQuery(baseOptions?: ApolloReactHooks.QueryHookOptions<GetFavouriteProductsQuery, GetFavouriteProductsQueryVariables>) {
        return ApolloReactHooks.useQuery<GetFavouriteProductsQuery, GetFavouriteProductsQueryVariables>(GetFavouriteProductsDocument, baseOptions);
      }
export function useGetFavouriteProductsLazyQuery(baseOptions?: ApolloReactHooks.LazyQueryHookOptions<GetFavouriteProductsQuery, GetFavouriteProductsQueryVariables>) {
          return ApolloReactHooks.useLazyQuery<GetFavouriteProductsQuery, GetFavouriteProductsQueryVariables>(GetFavouriteProductsDocument, baseOptions);
        }
export type GetFavouriteProductsQueryHookResult = ReturnType<typeof useGetFavouriteProductsQuery>;
export type GetFavouriteProductsLazyQueryHookResult = ReturnType<typeof useGetFavouriteProductsLazyQuery>;
export type GetFavouriteProductsQueryResult = ApolloReactCommon.QueryResult<GetFavouriteProductsQuery, GetFavouriteProductsQueryVariables>;
export const GetProductDocument = gql`
    query GetProduct($id: Int!) {
  product(id: $id) {
    ...ProductData
  }
}
    ${ProductDataFragmentDoc}`;
export type GetProductComponentProps = Omit<ApolloReactComponents.QueryComponentOptions<GetProductQuery, GetProductQueryVariables>, 'query'> & ({ variables: GetProductQueryVariables; skip?: boolean; } | { skip: boolean; });

    export const GetProductComponent = (props: GetProductComponentProps) => (
      <ApolloReactComponents.Query<GetProductQuery, GetProductQueryVariables> query={GetProductDocument} {...props} />
    );
    

/**
 * __useGetProductQuery__
 *
 * To run a query within a React component, call `useGetProductQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetProductQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetProductQuery({
 *   variables: {
 *      id: // value for 'id'
 *   },
 * });
 */
export function useGetProductQuery(baseOptions?: ApolloReactHooks.QueryHookOptions<GetProductQuery, GetProductQueryVariables>) {
        return ApolloReactHooks.useQuery<GetProductQuery, GetProductQueryVariables>(GetProductDocument, baseOptions);
      }
export function useGetProductLazyQuery(baseOptions?: ApolloReactHooks.LazyQueryHookOptions<GetProductQuery, GetProductQueryVariables>) {
          return ApolloReactHooks.useLazyQuery<GetProductQuery, GetProductQueryVariables>(GetProductDocument, baseOptions);
        }
export type GetProductQueryHookResult = ReturnType<typeof useGetProductQuery>;
export type GetProductLazyQueryHookResult = ReturnType<typeof useGetProductLazyQuery>;
export type GetProductQueryResult = ApolloReactCommon.QueryResult<GetProductQuery, GetProductQueryVariables>;
export const GetProductsDocument = gql`
    query GetProducts($categoryId: Int!) {
  products(categoryId: $categoryId) {
    ...ListProduct
  }
}
    ${ListProductFragmentDoc}`;
export type GetProductsComponentProps = Omit<ApolloReactComponents.QueryComponentOptions<GetProductsQuery, GetProductsQueryVariables>, 'query'> & ({ variables: GetProductsQueryVariables; skip?: boolean; } | { skip: boolean; });

    export const GetProductsComponent = (props: GetProductsComponentProps) => (
      <ApolloReactComponents.Query<GetProductsQuery, GetProductsQueryVariables> query={GetProductsDocument} {...props} />
    );
    

/**
 * __useGetProductsQuery__
 *
 * To run a query within a React component, call `useGetProductsQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetProductsQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetProductsQuery({
 *   variables: {
 *      categoryId: // value for 'categoryId'
 *   },
 * });
 */
export function useGetProductsQuery(baseOptions?: ApolloReactHooks.QueryHookOptions<GetProductsQuery, GetProductsQueryVariables>) {
        return ApolloReactHooks.useQuery<GetProductsQuery, GetProductsQueryVariables>(GetProductsDocument, baseOptions);
      }
export function useGetProductsLazyQuery(baseOptions?: ApolloReactHooks.LazyQueryHookOptions<GetProductsQuery, GetProductsQueryVariables>) {
          return ApolloReactHooks.useLazyQuery<GetProductsQuery, GetProductsQueryVariables>(GetProductsDocument, baseOptions);
        }
export type GetProductsQueryHookResult = ReturnType<typeof useGetProductsQuery>;
export type GetProductsLazyQueryHookResult = ReturnType<typeof useGetProductsLazyQuery>;
export type GetProductsQueryResult = ApolloReactCommon.QueryResult<GetProductsQuery, GetProductsQueryVariables>;
export const GetSearchProductsDocument = gql`
    query GetSearchProducts($query: String, $page: Int!, $limit: Int!) {
  search(query: $query, page: $page, limit: $limit) {
    products {
      ...ListProduct
    }
    allPage
  }
}
    ${ListProductFragmentDoc}`;
export type GetSearchProductsComponentProps = Omit<ApolloReactComponents.QueryComponentOptions<GetSearchProductsQuery, GetSearchProductsQueryVariables>, 'query'> & ({ variables: GetSearchProductsQueryVariables; skip?: boolean; } | { skip: boolean; });

    export const GetSearchProductsComponent = (props: GetSearchProductsComponentProps) => (
      <ApolloReactComponents.Query<GetSearchProductsQuery, GetSearchProductsQueryVariables> query={GetSearchProductsDocument} {...props} />
    );
    

/**
 * __useGetSearchProductsQuery__
 *
 * To run a query within a React component, call `useGetSearchProductsQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetSearchProductsQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetSearchProductsQuery({
 *   variables: {
 *      query: // value for 'query'
 *      page: // value for 'page'
 *      limit: // value for 'limit'
 *   },
 * });
 */
export function useGetSearchProductsQuery(baseOptions?: ApolloReactHooks.QueryHookOptions<GetSearchProductsQuery, GetSearchProductsQueryVariables>) {
        return ApolloReactHooks.useQuery<GetSearchProductsQuery, GetSearchProductsQueryVariables>(GetSearchProductsDocument, baseOptions);
      }
export function useGetSearchProductsLazyQuery(baseOptions?: ApolloReactHooks.LazyQueryHookOptions<GetSearchProductsQuery, GetSearchProductsQueryVariables>) {
          return ApolloReactHooks.useLazyQuery<GetSearchProductsQuery, GetSearchProductsQueryVariables>(GetSearchProductsDocument, baseOptions);
        }
export type GetSearchProductsQueryHookResult = ReturnType<typeof useGetSearchProductsQuery>;
export type GetSearchProductsLazyQueryHookResult = ReturnType<typeof useGetSearchProductsLazyQuery>;
export type GetSearchProductsQueryResult = ApolloReactCommon.QueryResult<GetSearchProductsQuery, GetSearchProductsQueryVariables>;
export const GetUserDocument = gql`
    query GetUser {
  user {
    ...User
  }
}
    ${UserFragmentDoc}`;
export type GetUserComponentProps = Omit<ApolloReactComponents.QueryComponentOptions<GetUserQuery, GetUserQueryVariables>, 'query'>;

    export const GetUserComponent = (props: GetUserComponentProps) => (
      <ApolloReactComponents.Query<GetUserQuery, GetUserQueryVariables> query={GetUserDocument} {...props} />
    );
    

/**
 * __useGetUserQuery__
 *
 * To run a query within a React component, call `useGetUserQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetUserQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetUserQuery({
 *   variables: {
 *   },
 * });
 */
export function useGetUserQuery(baseOptions?: ApolloReactHooks.QueryHookOptions<GetUserQuery, GetUserQueryVariables>) {
        return ApolloReactHooks.useQuery<GetUserQuery, GetUserQueryVariables>(GetUserDocument, baseOptions);
      }
export function useGetUserLazyQuery(baseOptions?: ApolloReactHooks.LazyQueryHookOptions<GetUserQuery, GetUserQueryVariables>) {
          return ApolloReactHooks.useLazyQuery<GetUserQuery, GetUserQueryVariables>(GetUserDocument, baseOptions);
        }
export type GetUserQueryHookResult = ReturnType<typeof useGetUserQuery>;
export type GetUserLazyQueryHookResult = ReturnType<typeof useGetUserLazyQuery>;
export type GetUserQueryResult = ApolloReactCommon.QueryResult<GetUserQuery, GetUserQueryVariables>;
export const UpdateUserDocument = gql`
    mutation UpdateUser($login: String!, $email: String!, $name: String, $second_name: String, $last_name: String, $personal_phone: String, $personal_birthday: DateTime, $personal_gender: Sex, $password: String) {
  updateUserData(data: {login: $login, email: $email, name: $name, second_name: $second_name, last_name: $last_name, personal_phone: $personal_phone, personal_birthday: $personal_birthday, personal_gender: $personal_gender, password: $password})
}
    `;
export type UpdateUserMutationFn = ApolloReactCommon.MutationFunction<UpdateUserMutation, UpdateUserMutationVariables>;
export type UpdateUserComponentProps = Omit<ApolloReactComponents.MutationComponentOptions<UpdateUserMutation, UpdateUserMutationVariables>, 'mutation'>;

    export const UpdateUserComponent = (props: UpdateUserComponentProps) => (
      <ApolloReactComponents.Mutation<UpdateUserMutation, UpdateUserMutationVariables> mutation={UpdateUserDocument} {...props} />
    );
    

/**
 * __useUpdateUserMutation__
 *
 * To run a mutation, you first call `useUpdateUserMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useUpdateUserMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [updateUserMutation, { data, loading, error }] = useUpdateUserMutation({
 *   variables: {
 *      login: // value for 'login'
 *      email: // value for 'email'
 *      name: // value for 'name'
 *      second_name: // value for 'second_name'
 *      last_name: // value for 'last_name'
 *      personal_phone: // value for 'personal_phone'
 *      personal_birthday: // value for 'personal_birthday'
 *      personal_gender: // value for 'personal_gender'
 *      password: // value for 'password'
 *   },
 * });
 */
export function useUpdateUserMutation(baseOptions?: ApolloReactHooks.MutationHookOptions<UpdateUserMutation, UpdateUserMutationVariables>) {
        return ApolloReactHooks.useMutation<UpdateUserMutation, UpdateUserMutationVariables>(UpdateUserDocument, baseOptions);
      }
export type UpdateUserMutationHookResult = ReturnType<typeof useUpdateUserMutation>;
export type UpdateUserMutationResult = ApolloReactCommon.MutationResult<UpdateUserMutation>;
export type UpdateUserMutationOptions = ApolloReactCommon.BaseMutationOptions<UpdateUserMutation, UpdateUserMutationVariables>;
export const RegisterDocument = gql`
    mutation Register($name: String!, $email: String!, $personalPhone: String!, $password: String!) {
  register(data: {name: $name, email: $email, personal_phone: $personalPhone, password: $password})
}
    `;
export type RegisterMutationFn = ApolloReactCommon.MutationFunction<RegisterMutation, RegisterMutationVariables>;
export type RegisterComponentProps = Omit<ApolloReactComponents.MutationComponentOptions<RegisterMutation, RegisterMutationVariables>, 'mutation'>;

    export const RegisterComponent = (props: RegisterComponentProps) => (
      <ApolloReactComponents.Mutation<RegisterMutation, RegisterMutationVariables> mutation={RegisterDocument} {...props} />
    );
    

/**
 * __useRegisterMutation__
 *
 * To run a mutation, you first call `useRegisterMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useRegisterMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [registerMutation, { data, loading, error }] = useRegisterMutation({
 *   variables: {
 *      name: // value for 'name'
 *      email: // value for 'email'
 *      personalPhone: // value for 'personalPhone'
 *      password: // value for 'password'
 *   },
 * });
 */
export function useRegisterMutation(baseOptions?: ApolloReactHooks.MutationHookOptions<RegisterMutation, RegisterMutationVariables>) {
        return ApolloReactHooks.useMutation<RegisterMutation, RegisterMutationVariables>(RegisterDocument, baseOptions);
      }
export type RegisterMutationHookResult = ReturnType<typeof useRegisterMutation>;
export type RegisterMutationResult = ApolloReactCommon.MutationResult<RegisterMutation>;
export type RegisterMutationOptions = ApolloReactCommon.BaseMutationOptions<RegisterMutation, RegisterMutationVariables>;
export const LoginDocument = gql`
    mutation Login($emailOrPhone: String!, $password: String!) {
  login(data: {emailOrPhone: $emailOrPhone, password: $password})
}
    `;
export type LoginMutationFn = ApolloReactCommon.MutationFunction<LoginMutation, LoginMutationVariables>;
export type LoginComponentProps = Omit<ApolloReactComponents.MutationComponentOptions<LoginMutation, LoginMutationVariables>, 'mutation'>;

    export const LoginComponent = (props: LoginComponentProps) => (
      <ApolloReactComponents.Mutation<LoginMutation, LoginMutationVariables> mutation={LoginDocument} {...props} />
    );
    

/**
 * __useLoginMutation__
 *
 * To run a mutation, you first call `useLoginMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useLoginMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [loginMutation, { data, loading, error }] = useLoginMutation({
 *   variables: {
 *      emailOrPhone: // value for 'emailOrPhone'
 *      password: // value for 'password'
 *   },
 * });
 */
export function useLoginMutation(baseOptions?: ApolloReactHooks.MutationHookOptions<LoginMutation, LoginMutationVariables>) {
        return ApolloReactHooks.useMutation<LoginMutation, LoginMutationVariables>(LoginDocument, baseOptions);
      }
export type LoginMutationHookResult = ReturnType<typeof useLoginMutation>;
export type LoginMutationResult = ApolloReactCommon.MutationResult<LoginMutation>;
export type LoginMutationOptions = ApolloReactCommon.BaseMutationOptions<LoginMutation, LoginMutationVariables>;
export const CreateForgotTokenDocument = gql`
    mutation CreateForgotToken($login: String!) {
  createForgotToken(data: {login: $login})
}
    `;
export type CreateForgotTokenMutationFn = ApolloReactCommon.MutationFunction<CreateForgotTokenMutation, CreateForgotTokenMutationVariables>;
export type CreateForgotTokenComponentProps = Omit<ApolloReactComponents.MutationComponentOptions<CreateForgotTokenMutation, CreateForgotTokenMutationVariables>, 'mutation'>;

    export const CreateForgotTokenComponent = (props: CreateForgotTokenComponentProps) => (
      <ApolloReactComponents.Mutation<CreateForgotTokenMutation, CreateForgotTokenMutationVariables> mutation={CreateForgotTokenDocument} {...props} />
    );
    

/**
 * __useCreateForgotTokenMutation__
 *
 * To run a mutation, you first call `useCreateForgotTokenMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useCreateForgotTokenMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [createForgotTokenMutation, { data, loading, error }] = useCreateForgotTokenMutation({
 *   variables: {
 *      login: // value for 'login'
 *   },
 * });
 */
export function useCreateForgotTokenMutation(baseOptions?: ApolloReactHooks.MutationHookOptions<CreateForgotTokenMutation, CreateForgotTokenMutationVariables>) {
        return ApolloReactHooks.useMutation<CreateForgotTokenMutation, CreateForgotTokenMutationVariables>(CreateForgotTokenDocument, baseOptions);
      }
export type CreateForgotTokenMutationHookResult = ReturnType<typeof useCreateForgotTokenMutation>;
export type CreateForgotTokenMutationResult = ApolloReactCommon.MutationResult<CreateForgotTokenMutation>;
export type CreateForgotTokenMutationOptions = ApolloReactCommon.BaseMutationOptions<CreateForgotTokenMutation, CreateForgotTokenMutationVariables>;
export const ResetPasswordDocument = gql`
    mutation ResetPassword($login: String!, $token: String!, $password: String!) {
  resetPassword(data: {login: $login, token: $token, password: $password})
}
    `;
export type ResetPasswordMutationFn = ApolloReactCommon.MutationFunction<ResetPasswordMutation, ResetPasswordMutationVariables>;
export type ResetPasswordComponentProps = Omit<ApolloReactComponents.MutationComponentOptions<ResetPasswordMutation, ResetPasswordMutationVariables>, 'mutation'>;

    export const ResetPasswordComponent = (props: ResetPasswordComponentProps) => (
      <ApolloReactComponents.Mutation<ResetPasswordMutation, ResetPasswordMutationVariables> mutation={ResetPasswordDocument} {...props} />
    );
    

/**
 * __useResetPasswordMutation__
 *
 * To run a mutation, you first call `useResetPasswordMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useResetPasswordMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [resetPasswordMutation, { data, loading, error }] = useResetPasswordMutation({
 *   variables: {
 *      login: // value for 'login'
 *      token: // value for 'token'
 *      password: // value for 'password'
 *   },
 * });
 */
export function useResetPasswordMutation(baseOptions?: ApolloReactHooks.MutationHookOptions<ResetPasswordMutation, ResetPasswordMutationVariables>) {
        return ApolloReactHooks.useMutation<ResetPasswordMutation, ResetPasswordMutationVariables>(ResetPasswordDocument, baseOptions);
      }
export type ResetPasswordMutationHookResult = ReturnType<typeof useResetPasswordMutation>;
export type ResetPasswordMutationResult = ApolloReactCommon.MutationResult<ResetPasswordMutation>;
export type ResetPasswordMutationOptions = ApolloReactCommon.BaseMutationOptions<ResetPasswordMutation, ResetPasswordMutationVariables>;
export const UpdateCityByLocationDocument = gql`
    mutation UpdateCityByLocation($latitude: Float!, $longitude: Float!) {
  updateCityByLocation(latitude: $latitude, longitude: $longitude) {
    id
    city {
      ...City
    }
    citySelected
  }
}
    ${CityFragmentDoc}`;
export type UpdateCityByLocationMutationFn = ApolloReactCommon.MutationFunction<UpdateCityByLocationMutation, UpdateCityByLocationMutationVariables>;
export type UpdateCityByLocationComponentProps = Omit<ApolloReactComponents.MutationComponentOptions<UpdateCityByLocationMutation, UpdateCityByLocationMutationVariables>, 'mutation'>;

    export const UpdateCityByLocationComponent = (props: UpdateCityByLocationComponentProps) => (
      <ApolloReactComponents.Mutation<UpdateCityByLocationMutation, UpdateCityByLocationMutationVariables> mutation={UpdateCityByLocationDocument} {...props} />
    );
    

/**
 * __useUpdateCityByLocationMutation__
 *
 * To run a mutation, you first call `useUpdateCityByLocationMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useUpdateCityByLocationMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [updateCityByLocationMutation, { data, loading, error }] = useUpdateCityByLocationMutation({
 *   variables: {
 *      latitude: // value for 'latitude'
 *      longitude: // value for 'longitude'
 *   },
 * });
 */
export function useUpdateCityByLocationMutation(baseOptions?: ApolloReactHooks.MutationHookOptions<UpdateCityByLocationMutation, UpdateCityByLocationMutationVariables>) {
        return ApolloReactHooks.useMutation<UpdateCityByLocationMutation, UpdateCityByLocationMutationVariables>(UpdateCityByLocationDocument, baseOptions);
      }
export type UpdateCityByLocationMutationHookResult = ReturnType<typeof useUpdateCityByLocationMutation>;
export type UpdateCityByLocationMutationResult = ApolloReactCommon.MutationResult<UpdateCityByLocationMutation>;
export type UpdateCityByLocationMutationOptions = ApolloReactCommon.BaseMutationOptions<UpdateCityByLocationMutation, UpdateCityByLocationMutationVariables>;
export const UpdateUserPhotoDocument = gql`
    mutation UpdateUserPhoto($photo: String) {
  setUserPhoto(photo: $photo)
}
    `;
export type UpdateUserPhotoMutationFn = ApolloReactCommon.MutationFunction<UpdateUserPhotoMutation, UpdateUserPhotoMutationVariables>;
export type UpdateUserPhotoComponentProps = Omit<ApolloReactComponents.MutationComponentOptions<UpdateUserPhotoMutation, UpdateUserPhotoMutationVariables>, 'mutation'>;

    export const UpdateUserPhotoComponent = (props: UpdateUserPhotoComponentProps) => (
      <ApolloReactComponents.Mutation<UpdateUserPhotoMutation, UpdateUserPhotoMutationVariables> mutation={UpdateUserPhotoDocument} {...props} />
    );
    

/**
 * __useUpdateUserPhotoMutation__
 *
 * To run a mutation, you first call `useUpdateUserPhotoMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useUpdateUserPhotoMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [updateUserPhotoMutation, { data, loading, error }] = useUpdateUserPhotoMutation({
 *   variables: {
 *      photo: // value for 'photo'
 *   },
 * });
 */
export function useUpdateUserPhotoMutation(baseOptions?: ApolloReactHooks.MutationHookOptions<UpdateUserPhotoMutation, UpdateUserPhotoMutationVariables>) {
        return ApolloReactHooks.useMutation<UpdateUserPhotoMutation, UpdateUserPhotoMutationVariables>(UpdateUserPhotoDocument, baseOptions);
      }
export type UpdateUserPhotoMutationHookResult = ReturnType<typeof useUpdateUserPhotoMutation>;
export type UpdateUserPhotoMutationResult = ApolloReactCommon.MutationResult<UpdateUserPhotoMutation>;
export type UpdateUserPhotoMutationOptions = ApolloReactCommon.BaseMutationOptions<UpdateUserPhotoMutation, UpdateUserPhotoMutationVariables>;