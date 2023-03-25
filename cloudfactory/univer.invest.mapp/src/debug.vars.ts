// По-умолчанию все флаги заданы текущей работы, в production выключены

export const DebugVars = {
  // вызвать diagnosticMode Config service
  devDiagnosticMode: false,
  // рефреш устаревшего токена через логин/пароль только в режиме разработки Security service
  securityDevCredEnabled: false,
  // разрешить дебаг режим AppModule
  enableDebugModule: false,
  // разрешить использования реатотрона bootstrapper
  enableReactotron: __DEV__,
  // также нужно включить enableDebugModule App
  enableToggleDebugButton: false,
  // кнопка переключения темы App
  enableToggleThemeButton: false,
  // спрятать splashScreen bootstrapper
  hideSplashScreen: __DEV__,
  // показать PinCode ScreenNewPinCode
  showDefaultPinCode: __DEV__,
  // импорт RemoteConfig Firebase
  useFirebaseRemoteConfig: __DEV__ || undefined as (boolean | undefined) === true,
  // создать responder ReactApplication
  enableDevMenuGestureResponder: __DEV__,
  // скрыть предупреждения reactotron
  hideYellowBoxWarnings: false,
  // очистить историю ChatHistoryStore
  clearChatHistory: false,
  // на старте приложения пропустить экран ввода пинкода AppPresent
  skipUnlockScreen: __DEV__,
  // throw new Error TradeList, StpOrderList, OrderList
  argsAssertValidation: __DEV__,
  // вывести alert c сообщением, в случае вызова телефонного приложения SupportService
  showDebugAlerts: __DEV__,
  // не посылать исключения initRN2CrashliticBridge
  isCrashliticDisabled: __DEV__,
  // отрисовка индикатора DebugIndicator
  renderDebugIndicator: __DEV__,
  // восстановление состояние сессии SessionStoreEFTR
  isDevSessionPersistEnabled: __DEV__,
  // обновить данные в VtbPreloadStore
  isPreloadDictData: __DEV__,
  // послать предупреждение в AccountRemotePreferences
  callRefreshWarn: __DEV__,
  // выяснить кто вызвал тот или оной метод/функцию в getStack helper
  checkWhoCallFunction: __DEV__,
  // загрузка экрана App, SDebugLoginCommand
  appActiveNav: __DEV__ ? 'Main' : 'Signin',
  // вызов исключения (IoC)
  implementDisposableInterface: __DEV__,
};

if (__DEV__) {
  // logger.levels.trace.enable(); // all logs, levels see in src/vtb/kit/logger/logger.V.Icon.config.ts
  // logger.levels.info.enable();
}

// Тут можно включить необходимые флаги для сборки отладочных сборок, в общих ветках, должны быть закомментированы
// DebugVars.devDiagnosticMode = true;
// DebugVars.enableReactotron = true;
// DebugVars.enableDebugModule = true;
// DebugVars.enableToggleDebugButton = true;
// DebugVars.enableToggleThemeButton = true;
// DebugVars.useFirebaseRemoteConfig = true;
// DebugVars.clearChatHistory = true;
// DebugVars.skipUnlockScreen = false;
DebugVars.hideYellowBoxWarnings = true;
