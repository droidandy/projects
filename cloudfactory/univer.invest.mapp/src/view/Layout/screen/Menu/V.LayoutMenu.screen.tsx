import React from 'react';
import { observer } from 'mobx-react';
import { computed, makeObservable } from 'mobx';
import { IoC } from '@invest.wl/core/src/di/IoC';
import {
  IVButtonSettingProps, VButton, VCard, VCol, VContainer, VContent, VNavBar, VStatusBar, VText,
} from '@invest.wl/mobile/src/view/kit';
import { VThemeStoreTid } from '@invest.wl/view/src/Theme/V.Theme.types';
import { VThemeStore } from '@invest.wl/view/src/Theme/V.Theme.store';
import { EVApplicationScreen } from '@invest.wl/view/src/Application/V.Application.types';
import { Formatter } from '@invest.wl/common/src/util/formatter.util';
import { VAuthSignoutButton } from '../../../Auth/components/V.AuthSignoutButton.component';
import { EVRouterScreen, IVRouterService, VRouterServiceTid } from '@invest.wl/view/src/Router/V.Router.types';
import { EVOwnerScreen } from '@invest.wl/view/src/Owner/V.Owner.types';
import { ISFeedbackService, SFeedbackServiceTid } from '@invest.wl/system/src/Feedback/S.Feedback.types';
import { EVCustomerScreen } from '@invest.wl/view/src/Customer/V.Customer.types';
import {
  VApplicationVersionPresent, VApplicationVersionPresentTid,
} from '@invest.wl/view/src/Application/present/V.ApplicationVersion.present';
import { EVLayoutScreen, IVLayoutMenuScreenProps } from '@invest.wl/view/src/Layout/V.Layout.types';

@observer
export class VLayoutMenuScreen extends React.Component<IVLayoutMenuScreenProps> {
  private _list: IVButtonSettingProps[] = [
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
          <VCard key={index} pa={space.md} mv={space.md} mh={space.lg}>
            <VButton.Setting onPress={this._navTo} {...props} />
          </VCard>
        ))}
        <VCol flex />
        <VCol ph={space.lg}>
          <VText color={color.muted4} alignSelf={'center'} font={'body19'}>
            Univerbank App ver {this._version.cse.build} {!!this._version.cse.buildDate ? 'от '
            + Formatter.date(this._version.cse.buildDate, { pattern: 'default' }) : ''}</VText>
          <VAuthSignoutButton />
        </VCol>
      </>
    );
  }

  private _navTo = (screen: EVRouterScreen) => this._router.push(screen);
}
