import { IoC } from '@invest.wl/core/src/di/IoC';
import { IVButtonSettingProps, VButton, VContainer, VContent, VNavBar, VStatusBar, } from '@invest.wl/mobile/src/view/kit';
import { IVLayoutSettingsScreenProps } from '@invest.wl/view/src/Layout/V.Layout.types';
import { EVRouterScreen, IVRouterService, VRouterServiceTid } from '@invest.wl/view/src/Router/V.Router.types';
import { EVSecurityScreen } from '@invest.wl/view/src/Security/V.Security.types';
import { VThemeStore } from '@invest.wl/view/src/Theme/V.Theme.store';
import { VThemeStoreTid } from '@invest.wl/view/src/Theme/V.Theme.types';
import { observer } from 'mobx-react';
import React from 'react';

@observer
export class VLayoutSettingsScreen extends React.Component<IVLayoutSettingsScreenProps> {
  private static _list: IVButtonSettingProps[] = [
    { text: 'Подтверждение операций', context: EVSecurityScreen.SecuritySettings },
  ];

  private _theme = IoC.get<VThemeStore>(VThemeStoreTid);
  private _router = IoC.get<IVRouterService>(VRouterServiceTid);

  public render() {
    return (
      <VContainer>
        <VStatusBar />
        <VNavBar>
          <VNavBar.Back />
          <VNavBar.Title text={'Настройки'} />
        </VNavBar>
        <VContent footerTabs pv={this._theme.space.lg}>
          {VLayoutSettingsScreen._list.map((item, index) =>
            <VButton.Setting key={index} {...item} onPress={this._navTo} />,
          )}
        </VContent>
      </VContainer>
    );
  }

  private _navTo = (screen: EVRouterScreen) => this._router.push(screen);
}
