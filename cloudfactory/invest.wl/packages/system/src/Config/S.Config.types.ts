import { IDDocumentTemplateMap, TDurationISO8601 } from '@invest.wl/core';
import { ESNetworkTokenMode } from '../Network/S.Network.types';

export const SConfigStoreTid = Symbol.for('SConfigStoreTid');
export const SConfigSourceTid = Symbol.for('SConfigSourceTid');
export const SConfigConfiguratorTid = Symbol.for('SConfigConfiguratorTid');
export const SConfigServiceTid = Symbol.for('SConfigServiceTid');

export interface ISConfigStoreStatic {
  readonly productId: string;
  readonly networkTokenTransferMode: ESNetworkTokenMode;
  readonly systemConfigUrl: string;
}

export interface ISConfigSource {
  [name: string]: any;
}

export interface ISConfigStore extends ISConfigStoreStatic {
  isSystemLoaded: boolean;
  isUserLoaded: boolean;

  readonly static: ISConfigStoreStatic;

  // Date
  /**
   * HACK: т.к. биржи работает по времени МСК то и даты мы должны передавать по МСК зоне.
   * будет работать пока Россия (Москва) не переедет или опять не придумают переходы на осеннее\весеннее время
   */
  readonly dateServerUtcOffset: number;
  readonly datePickerMinDate: Date;
  readonly datePickerMaxDate?: Date;

  // Network
  readonly networkTokenTransferMode: ESNetworkTokenMode;

  // Logger
  readonly loggerConfig: any;

  // Transport
  readonly transportBaseUrl: string;
  readonly transportBaseApiUrl: string;
  readonly transportBaseS3ApiUrl: string;

  // Auth
  readonly authExternalUrlKeycloak?: string;
  readonly authExternalUrlConfirmKeycloak?: string;
  readonly authExternalUrlSuccessKeycloak?: string;
  readonly authPasswordMinLength: number;
  readonly authPasswordMaxLength: number;
  readonly authSmsCodeLength: number;
  readonly authSmsCodeResendInterval: number;
  readonly authLoginDefault: string;
  readonly authPasswordDefault: string;
  readonly authPasswordChangeResend: number;

  // Security
  readonly securityCodeLength: number;
  readonly securityCodeDefault: string;
  readonly securityTimeoutToLock: number;
  readonly securityDeviceTrusted: boolean;

  // Application
  readonly appName: string;
  readonly appBuildDate: string;
  readonly appVersionInfo: string;
  readonly appVersionBuild: string;
  readonly appVersionBuildRevision: string;
  readonly appVersionAdviser: string;
  readonly appVersionTarget: string;
  // / platform deps
  readonly appIdAndroid: string;
  readonly appIdIOS: string;
  readonly appLinkAndroid: string;
  readonly appLinkIOS: string;

  // Feedback
  // / platform deps
  readonly feedbackReviewLinkIOS: string;
  readonly feedbackReviewLinkAndroid: string;

  // Notification
  // / platform deps
  readonly notificationSenderIdAndroid: string;
  readonly notificationDeviceProductIos: string;
  readonly notificationDeviceProductAndroid: string;

  // InstrumentAlert
  readonly instrumentAlertUpdateInterval: number;

  // Instrument
  readonly instrumentQuoteListUpdateInterval: number;

  // Portfel
  readonly portfelPlUpdateInterval: number;

  // Document
  readonly documentSmsCodeLength?: number;
  readonly documentSmsResendTimeout?: number;
  readonly documentTemplateMap?: IDDocumentTemplateMap;
  readonly documentCreateReloadInterval?: number;

  // Bank
  readonly bankSearchService?: ISExternalService;

  // Address
  readonly addressSearchService?: ISExternalService;

  // Customer
  readonly customerCreatePersonalDataHandleAgreementLink?: string;

  // Owner
  readonly ownerAgreementPepLink?: string;
  readonly ownerAgreementPersonalDataLink?: string;
  readonly ownerDataProtectLink?: string;
  readonly ownerDisclaimerIdeaText: string;
  readonly ownerEmailCustomer?: string;
  readonly ownerEmailTechnical?: string;
  readonly ownerEmailHelp?: string;
  readonly ownerPhoneHelp?: string;
  readonly ownerPhoneCallCenter?: string;
  readonly ownerAddress?: string;
}

export interface ISConfigStoreConfigurator {
  systemConfigure(map: { [key: string]: string }): Promise<void>;
}

export interface ISConfigService {
  systemLoad(): Promise<void>;
  userLoad(): Promise<void>;
}

export interface ISExternalService {
  url: string;
  key: string;
  delay: TDurationISO8601;
}
