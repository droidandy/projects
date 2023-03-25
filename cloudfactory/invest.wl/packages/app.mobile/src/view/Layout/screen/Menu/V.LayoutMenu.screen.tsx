import { Formatter } from '@invest.wl/common/src/util/formatter.util';
import { IoC } from '@invest.wl/core';
import { IVButtonSettingProps, VButton, VCol, VContainer, VContent, VNavBar, VStatusBar, VText } from '@invest.wl/mobile';
import { ISFeedbackService, SFeedbackServiceTid } from '@invest.wl/system/src/Feedback/S.Feedback.types';
import { VApplicationVersionPresent, VApplicationVersionPresentTid } from '@invest.wl/view/src/Application/present/V.ApplicationVersion.present';
import { EVApplicationScreen } from '@invest.wl/view/src/Application/V.Application.types';
import { EVCustomerScreen } from '@invest.wl/view/src/Customer/V.Customer.types';
import { EVLayoutScreen, IVLayoutMenuScreenProps } from '@invest.wl/view/src/Layout/V.Layout.types';
import { EVOperationScreen } from '@invest.wl/view/src/Operation/V.Operation.types';
import { EVOwnerScreen } from '@invest.wl/view/src/Owner/V.Owner.types';
import { EVRouterScreen, IVRouterService, VRouterServiceTid } from '@invest.wl/view/src/Router/V.Router.types';
import { VThemeStore } from '@invest.wl/view/src/Theme/V.Theme.store';
import { VThemeStoreTid } from '@invest.wl/view/src/Theme/V.Theme.types';
import { computed, makeObservable } from 'mobx';
import { observer } from 'mobx-react';
import React from 'react';
import { VAuthSignoutButton } from '../../../Auth/components/V.AuthSignoutButton.component';

@observer
export class VLayoutMenuScreen extends React.Component<IVLayoutMenuScreenProps> {
  private _list: IVButtonSettingProps[] = [
    { text: 'Пополнение счета', icon: 'help', context: EVOperationScreen.OperationDepositCreate },
    { text: 'Профиль пользователя', icon: 'profile', context: EVCustomerScreen.CustomerAccountSelf },
    { text: 'Контакты', icon: 'contact', context: EVOwnerScreen.OwnerContact },
    { text: 'Поддержка', icon: 'help', context: EVOwnerScreen.OwnerInfo },
    { text: 'Настройки', icon: 'settings', context: EVLayoutScreen.LayoutSettings },
    { text: 'Оценить приложение', icon: 'pencil', onPress: () => this._feedback.review(5).then() },
    { text: 'О приложении', icon: 'info', context: EVApplicationScreen.ApplicationVersion },
  ];

  private theme = IoC.get<VThemeStore>(VThemeStoreTid);
  private _version = IoC.get<VApplicationVersionPresent>(VApplicationVersionPresentTid);
  private _router = IoC.get<IVRouterService>(VRouterServiceTid);
  private _feedback = IoC.get<ISFeedbackService>(SFeedbackServiceTid);

  constructor(props: IVLayoutMenuScreenProps) {
    super(props);
    makeObservable(this);
  }

  public render() {
    return (
      <VContainer>
        <VStatusBar />
        <VNavBar>
          <VNavBar.Title text={'Профиль'} />
        </VNavBar>
        <VContent footerTabs pv={this.theme.space.lg}>
          {this.contentRender}
        </VContent>
      </VContainer>
    );
  }

  @computed
  private get contentRender() {
    const { color, space } = this.theme;

    return (
      <>
        {this._list.map((props, index) => (
          <VButton.Setting key={index} onPress={this._navTo} {...props} />
        ))}
        <VCol flex />
        <VCol ph={space.lg}>
          <VText color={color.muted4} alignSelf={'center'} font={'body19'}>
            Expobank App ver {this._version.cse.build} {!!this._version.cse.buildDate ? 'от '
            + Formatter.date(this._version.cse.buildDate, { pattern: 'default' }) : ''}</VText>
          <VAuthSignoutButton />
        </VCol>
      </>
    );
  }

  private _navTo = (screen: EVRouterScreen) => this._router.push(screen);
}
