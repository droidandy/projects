import { IoC } from '@invest.wl/core';
import { VCol } from '@invest.wl/mobile';
import { IVThemeStore, VThemeStoreTid } from '@invest.wl/view/src/Theme/V.Theme.types';
import { VSecurityDeviceTrustFailed } from '_view/Security/component/V.SecurityDeviceTrustFailed.component';
import { action, makeObservable, observable, runInAction } from 'mobx';
import { observer } from 'mobx-react';
import * as React from 'react';
import { App } from '../App';
import { AppLoading } from '../AppLoading';
import { IRootPresent, RootPresentTid } from './Root.present';

@observer
export class RootComponent extends React.Component<Record<string, any>> {
  private _pr = IoC.get<IRootPresent>(RootPresentTid);
  private _theme = IoC.get<IVThemeStore>(VThemeStoreTid);
  @observable private _delayLoading = false;

  constructor(props: any) {
    super(props);
    makeObservable(this);
  }

  public async componentDidMount() {
    await this._pr.init();
  }

  public render() {
    const pr = this._pr;
    const isLoading = pr.isLoading || this._delayLoading;
    const isError = pr.isLoadingError && !this._delayLoading;

    if (!pr.isDeviceTrusted) {
      return <VSecurityDeviceTrustFailed />;
    }

    return (
      <VCol flex bg={this._theme.color.bg}>
        {pr.isReadyForRenderApp && (<App onReady={pr.onAppReady} />)}
        {isLoading && (
          <AppLoading absoluteFill isError={isError} onRetry={this._onRetry} />
        )}
      </VCol>
    );
  }

  @action.bound
  private async _onRetry() {
    this._delayLoading = true;
    await this._pr.load();
    runInAction(() => (this._delayLoading = false));
  }
}
