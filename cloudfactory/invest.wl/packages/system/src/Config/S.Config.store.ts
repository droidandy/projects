import { Inject, Injectable } from '@invest.wl/core';
import { makeObservable, observable, runInAction } from 'mobx';
import { ESNetworkTokenMode } from '../Network/S.Network.types';
import { ISConfigSource, ISConfigStore, ISConfigStoreConfigurator, SConfigSourceTid } from './S.Config.types';

@Injectable()
export class SConfigStore implements ISConfigStore, ISConfigStoreConfigurator {
  // private static jsonParse(data: any) {
  //   return data != null && typeof data === 'object' ? data : JSON.parse(data);
  // }

  @observable public isSystemLoaded = false;
  @observable public isUserLoaded = false;

  constructor(
    @Inject(SConfigSourceTid) private _source: ISConfigSource,
  ) {
    makeObservable(this);
  }

  private _map: { [key: string]: string } = { ...this._source };

  public async systemConfigure(map: { [key: string]: string }) {
    this._map = { ...this._source, ...this._map, ...map };
    runInAction(() => (this.isSystemLoaded = true));
  }

  public get appName() {
    return this.config.DISPLAY_NAME;
  }

  private _appIdAndroid?: string;

  public get appIdAndroid() {
    if (this._appIdAndroid) return this._appIdAndroid;
    this._appIdAndroid = this.config.APP_ID_ANDROID || '';

    // #region удаление суффикса - наименования среды под которую собирали
    // NOTE: production не имеет суффикса - см. соглашение о наименовании сборок
    const allEnvId = ['development', 'staging', 'preview', 'preproduction'];

    const appIdParts = this._appIdAndroid!.split('.');
    const appIdSuffixPart = appIdParts.pop();
    for (const envId of allEnvId) {
      if (appIdSuffixPart === envId) {
        this._appIdAndroid = appIdParts.join('.');
        break;
      }
    }
    // #endregion

    return this._appIdAndroid;
  }

  public get config() {
    if (!this._map) throw new Error('Config. Must configure first');
    return this._map;
  }

  public get static() {
    return this;
  }

  public get systemConfigUrl() {
    // return 'https://wlinvest-stg.eftr.ru/hub.axd/ConfigurationService/System';
    // return 'https://expoinvest.expobank.ru/hub.axd/ConfigurationService/System';
    return this._source.SYSTEM_CONFIG_URL;
  }

  public get productId() {
    return this._source.PRODUCT_ID;
  }

  // Network
  public get networkTokenTransferMode() {
    return ESNetworkTokenMode.Header;
    // return this.systemConfigUrl.includes('expobank') ? ESNetworkTokenMode.QueryString : ESNetworkTokenMode.Header;
    // return this._config.TOKEN_TRANSFER_MODE === ESNetworkTokenMode.Header ? ESNetworkTokenMode.Header : ESNetworkTokenMode.QueryString;
  }

  // Transport
  public get transportBaseUrl() {
    return this.config.BASE_URL;
  }

  public get transportBaseApiUrl() {
    return this.config.BASE_API_URL;
  }

  public get transportBaseS3ApiUrl() {
    return this.config.BASE_S3_API_URL;
  }

  // Auth
  public get authSmsCodeLength() {
    return parseInt(this.config.LOGIN_SMS_CODE_LENGTH, 10);
  }

  public get authPasswordChangeResend() {
    return parseInt(this.config.TIME_TO_CHANGE_TEMP_PASSWORD_RESEND, 10);
  }

  public get authLoginDefault(): string {
    return this.systemConfigUrl.includes('wlinvest') ? 'u1' : 'Test';
    // return this.config.DEFAULT_LOGIN;
  }

  public get authPasswordDefault(): string {
    return this.systemConfigUrl.includes('wlinvest') ? '123' : '1234';
    // return this.config.DEFAULT_PASSWORD;
  }

  public get authPasswordMinLength() {
    return parseInt(this.config.MIN_LENGTH_PASSWORD, 10);
  }

  public get authPasswordMaxLength() {
    return parseInt(this.config.MAX_LENGTH_PASSWORD, 10);
  }

  public get authSmsCodeResendInterval() {
    return parseInt(this.config.TIME_TO_REQUEST_SMS || '90', 10);
  }

  public get authExternalUrlKeycloak() {
    return this.config.KEYCLOAK_AUTH_URL;
  }

  public get authExternalUrlConfirmKeycloak() {
    return this.config.KEYCLOAK_TOKEN_URL;
  }

  public get authExternalUrlSuccessKeycloak() {
    return this.config.KEYCLOAK_AUTH_REDIRECT_URL;
  }

  // Logger
  public get loggerConfig() {
    return {
      // TODO:
      // level: ESLoggerLevel[StaticConfig.LOGGER_LEVEL] || ESLoggerLevel.OFF,
      // serverLogLevel: ESLoggerLevel[StaticConfig.LOGGER_SERVER_LEVEL] || ESLoggerLevel.OFF,
      // serverLogUrl: StaticConfig.LOGGER_SERVER_URL || undefined,
    };
  }

  // Application
  public get appVersionTarget() {
    return this.config.UPDATE_VERSION ?? '0.0.0';
  }

  public get appVersionInfo() {
    return this.config.CI_BUILD_VERSION ? this.config.CI_BUILD_VERSION + (this.config.CI_BUILD_VERSION_SUFFIX ?? '') : 'NA';
  }

  public get appVersionBuild() {
    return this.config.CI_BUILD_VERSION ?? 'NA';
  }

  public get appVersionAdviser() {
    return this.config.ADVISER_VERSION ?? 'NA';
  }

  public get appVersionBuildRevision() {
    return this.config.CI_BUILD_REVISION ?? 'NA';
  }

  public get appBuildDate() {
    return this.config.CI_BUILD_DATETIME;
  }

  public get appIdIOS() {
    return this.config.APP_ID_IOS;
  }

  public get appLinkAndroid() {
    return this.config.APP_LINK_ANDROID;
  }

  public get appLinkIOS() {
    return this.config.APP_LINK_IOS;
  }

  // Feedback
  public get feedbackReviewLinkAndroid() {
    return this.config.FEEDBACK_REVIEW_ANDROID;
  }

  public get feedbackReviewLinkIOS() {
    return this.config.FEEDBACK_REVIEW_IOS;
  }

  public get notificationSenderIdAndroid() {
    return this.config.APP_SENDER_ID_ANDROID;
  }

  // Date
  public get dateServerUtcOffset() {
    return parseInt(this.config.SERVER_UTC_OFFSET, 10);
  }

  public get datePickerMinDate() {
    const date = this.config.MIN_DATE_PICKER;

    if (!!date) {
      return date.toLowerCase() === 'now' ? new Date() : new Date(date);
    } else {
      return new Date('2015-01-01');
    }
  }

  public get datePickerMaxDate() {
    const date = this.config.MAX_DATE_PICKER;

    if (!!date) {
      return date.toLowerCase() === 'now' ? new Date() : new Date(date);
    } else {
      return undefined;
    }
  }

  // Notification
  public get notificationDeviceProductIos() {
    return this.config.PRODUCT_IOS;
  }

  public get notificationDeviceProductAndroid() {
    return this.config.PRODUCT_ANDROID;
  }

  // Security
  public get securityTimeoutToLock() {
    return parseInt(this.config.TIMEOUT_TO_PINCODE, 10);
  }

  public get securityCodeDefault() {
    return this.config.DEFAULT_PINCODE;
  }

  public get securityCodeLength() {
    return parseInt(this.config.PINCODE_LENGTH, 10);
  }

  public get securityDeviceTrusted() {
    return this.config.SECURITY_DEVICE_TRUSTED === 'true';
  }

  // InstrumentAlert
  public get instrumentAlertUpdateInterval() {
    return parseInt(this.config.ALERTS_UPDATE_INTERVAL ?? '3000', 10);
  }

  // Instrument
  public get instrumentQuoteListUpdateInterval() {
    return parseInt(this.config.INSTRUMENT_LIST_UPDATE_INTERVAL ?? '3000', 10);
  }

  // Portfel
  public get portfelPlUpdateInterval() {
    return parseInt(this.config.PL_BY_INSTRUMENT_UPDATE_INTERVAL ?? '5000', 10);
  }

  // Owner
  public get ownerDisclaimerIdeaText() {
    return this.config.DISCLAIMER_IDEA_TEXT;
  }

  public get ownerEmailTechnical() {
    return this.config.CLIENT_SUPPORT_TECH_EMAIL;
  }

  public get ownerEmailCustomer() {
    return this.config.CLIENT_SUPPORT_CUSTOMER_EMAIL;
  }

  public get ownerEmailHelp() {
    return this.config.CLIENT_SUPPORT_EMAIL;
  }

  public get ownerPhoneHelp() {
    return this.config.CLIENT_SUPPORT_PHONE_NUMBER;
  }

  public get ownerPhoneCallCenter() {
    return this.config.CALL_CENTER_PHONE_NUMBER;
  }

  public get ownerAddress() {
    return this.config.GEO_ADDRESS;
  }
}
