export type TDStorageLocalValue = string;

export interface IDStorageLocalDTO { [key: string]: TDStorageLocalValue | undefined };

export enum EDStorageLocalKey {
  ApplicationInstanceId = 'ApplicationInstanceId',
  ApplicationFirstLaunchDate = 'ApplicationFirstLaunchDate',
  ApplicationUrl = 'ApplicationUrl',
  ApplicationVersion = 'ApplicationVersion',

  Theme = 'Theme',
  LayoutManualSeen = 'LayoutManualSeen',

  // наличие доступа к защищенному хранилищу
  SecurityCodeGranted = 'security.code',
  SecurityBiometryGranted = 'security.biometry',
  // Интервал автоблокировки приложения в фоне
  SecurityTimeToLock = 'SecurityTimeToLock',

  AuthSigninUseBiometry = 'auth.signin.useBiometry',
  // кол-во повторных попыток отправки запроса для получения смс кода
  AuthSmsResendTries = 'AuthSmsResendTries',
  // timestamp последней отправки запроса для получения смс кода
  AuthSmsSentLastTime = 'AuthSmsSentLastTime',
  // кол-во повторных попыток подтверждения смс кода
  AuthPasswordChangeSmsResendTries = 'AuthPasswordChangeSmsResendTries',

  CustomerName = 'CustomerName',

  InstrumentSearchHistory = 'InstrumentSearchHistory',
  InstrumentChartPeriod = 'InstrumentChartPeriod',
  InstrumentChartType = 'InstrumentChartType',

  OrderCreateUseBiometry = 'order.create.useBiometry',
  OrderCreateUseCode = 'order.create.useCode',

  NotificationImportantShow = 'NotificationImportantShow',
  BackgroundTimerPrefix = 'BackgroundTimerPrefix',
}

export const DStorageLocalNoAuthKey = [
  EDStorageLocalKey.ApplicationFirstLaunchDate,
  EDStorageLocalKey.ApplicationInstanceId,
  EDStorageLocalKey.NotificationImportantShow,
  EDStorageLocalKey.LayoutManualSeen,
  EDStorageLocalKey.ApplicationVersion,
  EDStorageLocalKey.Theme,
];
