// @ts-nocheck
import { Inject, Injectable } from '@invest.wl/core';
import { action, makeObservable, reaction } from 'mobx';
import { ISAuthStore, SAuthStoreTid } from '../Auth/S.Auth.types';
import { ESNetworkHttpMethod, ISNetworkEndpointConfigurator, ISNetworkEndpointMap, SNetworkEndpointConfiguratorTid } from '../Network/S.Network.types';
import { STransportConfigService, STransportConfigServiceTid } from '../Transport/Config/S.TransportConfig.service';
import { ISTransportConfig, STransportConfigTid } from '../Transport/S.Transport.types';

import { ISConfigService, ISConfigStore, ISConfigStoreConfigurator, SConfigConfiguratorTid, SConfigStoreTid } from './S.Config.types';

// const REQUIRE_CONFIG: string[] = [
//   'LOGIN_SMS_CODE_LENGTH', 'TIME_TO_REQUEST_SMS', 'PINCODE_LENGTH', 'INSTRUMENT_LIST_UPDATE_INTERVAL',
//   'INSTRUMENT_SUMMARY_UPDATE_INTERVAL', 'ALERT_UPDATE_INTERVAL', 'INVEST_IDEA_LIST_UPDATE_INTERVAL',
//   'MARKET_HISTORY_UPDATE_INTERVAL', 'NOTIFICATION_COUNT_UPDATE_INTERVAL', 'INSTRUMENT_QUOTE_FEED_UPDATE_INTERVAL',
//   'TRADING_DATA_INSTRUMENT_UPDATE_INTERVAL', 'PL_BY_INSTRUMENT_UPDATE_INTERVAL', 'PORTFEL_TABLE_ORDER_UPDATE_INTERVAL',
//   'PORTFEL_TABLE_TRADE_UPDATE_INTERVAL', 'NONTRADE_OPERATION_UPDATE_INTERVAL', 'INSTRUMENT_SEARCH_UPDATE_INTERVAL',
//   'MIN_DATE_PICKER',
// ];

@Injectable()
export class SConfigService implements ISConfigService {
  constructor(
    @Inject(SConfigStoreTid) private _cfg: ISConfigStore,
    @Inject(SConfigConfiguratorTid) private _cfgStoreConfigurator: ISConfigStoreConfigurator,
    @Inject(SNetworkEndpointConfiguratorTid) private _networkEndpointConfigurator: ISNetworkEndpointConfigurator,
    @Inject(STransportConfigServiceTid) private _tpConfig: STransportConfigService,
    @Inject(STransportConfigTid) private _tpCfg: ISTransportConfig,
    @Inject(SAuthStoreTid) private _authStore: ISAuthStore,
  ) {
    makeObservable(this);
    // сразу после логина и анлока загружаем пользовательский конфиг
    reaction(() => this._authStore.authenticated, (authenticated) => {
      if (authenticated) this.userLoad().then();
    });
  }

  public async systemLoad() {
    // конфиг для одного вызова GetSystem
    const systemOption: ISNetworkEndpointMap = {
      [this._tpCfg.configEndpointUid]: {
        url: this._cfg.static.systemConfigUrl,
        method: ESNetworkHttpMethod.GET,
      },
    };

    this._networkEndpointConfigurator.configure(systemOption);
    const system = await this._tpConfig.GetSystem({});
    if (systemOption[this._tpCfg.configEndpointUid].url.includes('rshb')) {
      // RSHB mapping
      system.api['abaeb5b8'] = system.api['f19bccef'];
      system.api['ae6e52d1'] = system.api['df3e765a'];

      system.api['3ac01a2b'] = system.api['aed58222'];
      system.api['087500ad'] = system.api['4c15d322'];
      system.api['a022f7f0'] = system.api['52fd93a9'];

      system.api['b8ee96ce'] = system.api['79cca7e4'];

      system.api['17a72174'] = system.api['a5d47bf1'];
      system.api['9f315412'] = system.api['79cca7e4'];
      system.api['d499cbb3'] = system.api['d7f2cf0f'];
      system.api['ff7ecd46'] = system.api['6f7354e8'];
      system.api['3ff4cc1b'] = system.api['6602be6b'];
      system.api['f4702cb3'] = system.api['3be30026'];

      system.api['68ea43ee'] = system.api['f950b0e4'];
      system.api['0a33eefb'] = system.api['09bbae90'];
      system.api['092bef7b'] = system.api['4f6cafcd'];
      system.api['578a9e38'] = system.api['c37ee24c'];
      system.api['bf475bf6'] = system.api['2836f76e'];
      system.api['refresh'] = system.api['70b45c80'];
    } else {
      system.api['5330116e'] = system.api['e5f91c5c'];
    }
    await this._cfgStoreConfigurator.systemConfigure({ ...system, api: '' });
    this._networkEndpointConfigurator.configure(this._apiConfigurationParse(system.api));

    // TODO: config api endpoints while backend api's config not loaded
    // this.networkEndpointConfigurator.configure(this.networkConst.ApiMap);
    // await this._apiEndPointProviderConfigurator.configure(this._parseApiConfiguration(api));
  }

  @action.bound
  public async userLoad(): Promise<void> {
    // const { api, ...env } = await this._configurationService.GetUser();
    // await this._constConfigurator.configure(env);
    // if (api) {
    //   await this._apiEndPointProviderConfigurator.configure(this._parseApiConfiguration(api));
    // }
    // runInAction(() => (this._cfg.IsUserLoaded = true));
  }

  private _apiConfigurationParse(api: { [uid: string]: string }) {
    return Object.keys(api).reduce((acc, uid) => {
      const [method, url] = api[uid].trim().split(' ');
      acc[uid] = { url, method: method.toUpperCase() as ESNetworkHttpMethod };
      return acc;
    }, {} as ISNetworkEndpointMap);
  }

  // private _validateConfig(config: StringValues) {
  //   let notFoundKeyConfiguration: string = '';
  //   const allKeys: string[] = Object.keys(config);
  //   const checkExist = REQUIRE_CONFIG.every((el) => {
  //     const findIndex = allKeys.findIndex((aKE) => aKE === el);
  //     const checkKey = findIndex !== -1 && config[el] !== undefined && config[el] !== null;
  //     if (checkKey) {
  //       notFoundKeyConfiguration = el;
  //     }
  //
  //     return checkKey;
  //   });
  //
  //   if (!checkExist) {
  //     throw new Error(`ConfigurationWorker::_validateConfig
  //     (Ошибка при проверке необходимых ключей конфигурации).
  //     Не найден обязательный ключ ${notFoundKeyConfiguration}`);
  //   }
  // }
}
