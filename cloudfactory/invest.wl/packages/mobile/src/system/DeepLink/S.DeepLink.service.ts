import { EDStorageLocalKey, Inject, Injectable } from '@invest.wl/core';

import {
  ISApplicationStore,
  ISLoggerService,
  ISRouterService,
  ISStorageLocalService,
  SApplicationStoreTid,
  SLoggerServiceTid,
  SRouterServiceTid,
  SStorageLocalServiceTid,
} from '@invest.wl/system';
import { makeObservable, observable, reaction } from 'mobx';
import { Linking } from 'react-native';
import URL from 'url-parse';
import { IDeepLinkHandleOpts, IDeepLinkService, ISDeepLinkConfig, SDeepLinkConfigTid } from './S.DeepLink.types';

export const SDeepLinkServiceTid = Symbol.for('SDeepLinkServiceTid');

@Injectable()
export class SDeepLinkService implements IDeepLinkService {
  @observable public deeplinkUrl?: string = undefined;

  constructor(
    @Inject(SDeepLinkConfigTid) private _const: ISDeepLinkConfig,
    @Inject(SRouterServiceTid) private _router: ISRouterService,
    @Inject(SApplicationStoreTid) private _appStore: ISApplicationStore,
    @Inject(SLoggerServiceTid) private _log: ISLoggerService,
    @Inject(SStorageLocalServiceTid) private _sl: ISStorageLocalService,
  ) {
    makeObservable(this);
  }

  public async init(): Promise<any> {
    // Срабатывает когда меняется URL с помощью которого открыли приложение (Deep Link)
    Linking.addEventListener('url', this._handleChangeUrl);

    try {
      reaction(() => this._appStore.state, state => this.handle());
      /*
      На будущее учесть:
      https://github.com/facebook/react-native/issues/24429
      DeepLink работает только при выключенном debugJs remote
      Если он включен, то Linking.getInitialURL(); всегда возвращает null
      * */
      const url = await Linking.getInitialURL();
      if (url) {
        // Срабатывает при первом открытии приложения по URL
        await this.handle({ url });
      }
    } catch (error: any) {
      this._log.error('', 'SDeepLinkService::initialize', error);
    }
  }

  public async handle(opts?: IDeepLinkHandleOpts) {
    this.deeplinkUrl = opts?.url;
    if (opts && opts.url) await this._saveUrl(opts.url);
    else if (opts && opts.frontAction) await this._saveUrl(this._const.scheme + opts.frontAction);

    if (this._appStore.isUseful) await this._navigate(!!opts?.reset);
  }

  // TODO: handle error?
  private _navigate = async (reset: boolean) => {
    if (reset) this._router.resetTo();
    if (await this._checkDeepLink()) {
      const path = await this._sl.get(EDStorageLocalKey.ApplicationUrl);
      await this._sl.remove(EDStorageLocalKey.ApplicationUrl);
      if (path) {
        const urlLocation = this._getLocation(path);
        const screenName = this._router.routeSearch(urlLocation.screen);
        if (!!screenName) this._router.navigateTo(screenName, urlLocation.params);
      }
    }
  };

  private _saveUrl = async (url: string) => this._sl.set(EDStorageLocalKey.ApplicationUrl, url);

  private _checkDeepLink = async () => {
    const path = await this._sl.get(EDStorageLocalKey.ApplicationUrl);
    if (path) return this._router.routeHas(this._getLocation(path).screen);
    return false;
  };

  private _getLocation(url: string) {
    const match = new URL(url);
    const query = match && match['query'] ? match['query'] : '';

    return {
      screen: match ? match['hostname'] : undefined,
      params: this._getParams(query.toString().replace('?', '')),
    };
  }

  private _getParams = (paramsString: string) => {
    const obj: any = {};
    paramsString.replace(/([^=&]+)=([^&]*)/g,
      (m, key, value) => obj[decodeURIComponent(key)] = decodeURIComponent(value));
    return obj;
  };

  private _handleChangeUrl = async (e: any) => {
    if (e.url) await this.handle({ url: e.url });
  };
}
