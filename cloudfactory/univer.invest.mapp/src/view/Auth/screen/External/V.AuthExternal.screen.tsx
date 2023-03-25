import { observer } from 'mobx-react';
import React from 'react';
import { VContainer, VContent, VNavBar, VStatusBar, VStub } from '@invest.wl/mobile/src/view/kit';
import { EDAuthExternalType, IoC } from '@invest.wl/core';
import { computed, makeObservable } from 'mobx';
import { VWebView } from '@invest.wl/mobile/src/view/kit/Output/WebView/V.WebView.component';
import { mapScreenPropsToProps } from '@invest.wl/mobile/src/view/util/react.util';
import { VWebViewModel } from '@invest.wl/mobile/src/view/WebView/V.WebView.model';
import {
  IVAuthExternalPresentProps, VAuthExternalPresent, VAuthExternalPresentTid,
} from '@invest.wl/view/src/Auth/present/V.AuthExternal.present';
import { IVRouterService, VRouterServiceTid } from '@invest.wl/view/src/Router/V.Router.types';
import URLParse from 'url-parse';
import { EVSecurityScreen } from '@invest.wl/view/src/Security/V.Security.types';
import { IVThemeStore, VThemeStoreTid } from '@invest.wl/view/src/Theme/V.Theme.types';

export interface IVAuthExternalScreenProps extends IVAuthExternalPresentProps {

}

@mapScreenPropsToProps
@observer
export class VAuthExternalScreen extends React.Component<IVAuthExternalScreenProps> {
  private _pr = IoC.get<VAuthExternalPresent>(VAuthExternalPresentTid);
  private _router = IoC.get<IVRouterService>(VRouterServiceTid);
  private _theme = IoC.get<IVThemeStore>(VThemeStoreTid);
  private _ref = React.createRef<VWebView>();

  private _onRedirect = (url: Omit<URLParse, 'set'>) => this._pr.cse.check(url);

  private _onSuccess = async (url: Omit<URLParse, 'set'>) => {
    await this._pr.cse.signIn(url);
    this._router.replaceTo(EVSecurityScreen.SecurityAccessCode);
  };

  private _model = new VWebViewModel({
    ref: this._ref, onRedirect: this._onRedirect, onSuccess: this._onSuccess, onHttpError: this._pr.onHttpError,
  });

  constructor(props: IVAuthExternalScreenProps) {
    super(props);
    makeObservable(this);
  }

  public componentDidMount() {
    this._pr.init({ type: EDAuthExternalType.Keycloak });
  }

  public componentWillUnmount(): void {
    this._model.dispose();
  }

  public render() {
    return (
      <VContainer>
        <VStatusBar />
        <VNavBar>
          {this._model.canGoBack && <VNavBar.LeftIcon name={'nav-back'} onPress={this._model.back} />}
          <VNavBar.Title text={'Вход в приложение'} />
        </VNavBar>
        <VContent noScroll justifyContent={'space-between'}>
          {this._renderContent}
        </VContent>
      </VContainer>
    );
  }

  @computed
  private get _renderContent() {
    const { url, urlSuccess } = this._pr.cse;

    if (url.isLoading || urlSuccess.isLoading) return <VStub.Loading />;
    if (url.isError || urlSuccess.isError) return <VStub.Error />;
    if (!url.isLoaded || !urlSuccess.isLoaded) return <VStub.Empty />;
    const { onLoadEnd, onHttpError, onShouldLoadStart, onLoadStart, onRedirect, injectedScript } = this._model;

    return (
      <>
        <VWebView ref={this._ref} url={url.data!.url}
          scrollEnabled={true} cacheEnabled={false}
          cacheMode={'LOAD_NO_CACHE'} incognito={true}
          onShouldStartLoadWithRequest={onShouldLoadStart}
          onHttpError={onHttpError} onNavigationStateChange={onRedirect}
          onLoadStart={onLoadStart} onLoadEnd={onLoadEnd}
          bounces={false} javaScriptEnabled={true} injectedJavaScript={injectedScript}
        />
        {this._model.isBusy && (
          <VStub.Loading absoluteFill bg={this._theme.color.bgContent} />
        )}
      </>
    );
  }
}
