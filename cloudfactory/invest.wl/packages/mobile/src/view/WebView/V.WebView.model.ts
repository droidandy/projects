import { IoC, TObject } from '@invest.wl/core';
import { SHardwareBackHolder } from '@invest.wl/system';
import { IVRouterService, VRouterServiceTid } from '@invest.wl/view';
import { action, computed, makeObservable, observable, runInAction } from 'mobx';
import { RefObject } from 'react';
import {
  ShouldStartLoadRequest,
  WebViewErrorEvent,
  WebViewHttpErrorEvent,
  WebViewNavigation,
  WebViewNavigationEvent,
} from 'react-native-webview/lib/WebViewTypes';
import URLParse from 'url-parse';
import { VWebView } from '../kit/Output/WebView/V.WebView.component';

export interface IVWebViewModelProps<Q extends TObject = TObject> {
  ref: RefObject<VWebView>;
  // boolean = достигнуто ли конечное состояние
  onRedirect(url: URLParse<Q>): boolean;
  onSuccess(url: URLParse<Q>): Promise<void>;
  onHttpError?(status: number): void;
}

export class VWebViewModel<Q extends TObject = TObject> {
  private _router = IoC.get<IVRouterService>(VRouterServiceTid);
  private _backHandlerHolder = new SHardwareBackHolder();

  @observable public currentUrl?: URLParse<Q>;
  @observable public isDone = false;

  @computed
  public get canGoBack() {
    return this._canGoBack || this._router.canGoBack();
  }

  @computed
  public get isBusy() {
    return this._isLoading || this._isRedirectLoading || this.isDone;
  }

  @observable private _isLoading = false;
  @observable private _isRedirectLoading = false;
  @observable private _canGoBack = false;

  constructor(public props: IVWebViewModelProps<Q>) {
    makeObservable(this);
    this._backHandlerHolder.subscribe(this.back);
  }

  public dispose() {
    this._backHandlerHolder.dispose();
  }

  @action
  public onRedirect = (nav: WebViewNavigation) => {
    if (nav.loading || this.isDone) {
      return;
    }
    this._isRedirectLoading = true;
    this._canGoBack = nav.canGoBack;
    this.currentUrl = new URLParse(nav.url, true) as URLParse<Q>;
    const isSuccess = this.props.onRedirect(this.currentUrl);
    if (isSuccess) {
      this._onSuccess(this.currentUrl);
    }
    runInAction(() => this._isRedirectLoading = false);
    return isSuccess;
  };

  @action public onShouldLoadStart = (event: ShouldStartLoadRequest) => {
    this._isLoading = true;
    return this._isLoading;
  };
  @action public onLoadStart = (event: WebViewNavigationEvent) => {
    this._isLoading = true;
  };
  @action public onLoadEnd = (event: WebViewNavigationEvent | WebViewErrorEvent) => {
    this._isLoading = false;
  };
  public onHttpError = (e: WebViewHttpErrorEvent) => {
    this.props.onHttpError?.(e.nativeEvent.statusCode);
  };

  public back = () => {
    if (this._canGoBack && !!this.props.ref.current) {
      this.props.ref.current.goBack();
    } else {
      this._router.back();
    }
  };

  @computed
  public get injectedScript() {
    return `
      // ES3 для поддержки WebView в старых Андроидах
      var inputLogin = document.getElementById('username');
      var inputPass = document.getElementById('password');
      var buttonSubmit = document.getElementById('kc-button');

      inputLogin && inputLogin.addEventListener('keypress', (event) => {
        if (event.key === 'Enter') {
          event.preventDefault();
          inputPass.focus();
        }
      });
      inputPass && inputPass.addEventListener('keypress', (event) => {
        if (event.key === 'Enter') {
          event.preventDefault();
          buttonSubmit.click();
        }
      });
    `;
  }

  @action
  private _onSuccess(url: URLParse<Q>) {
    this.isDone = true;
    this.props.onSuccess(url).then();
  }
}
