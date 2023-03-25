import React from 'react';
import { observer } from 'mobx-react';
import { action, computed, makeObservable, observable } from 'mobx';
import { IoC } from '@invest.wl/core/src/di/IoC';
import {
  VButton,
  VCheckBox,
  VCol,
  VContainer,
  VContent, VHyperlink,
  VImage,
  VRow,
  VStatusBar,
  VText, VTouchable,
} from '@invest.wl/mobile/src/view/kit';
import { VLayoutEntryPresent, VLayoutEntryPresentTid } from './V.LayoutEntry.present';
import { IVEntryScreenProps } from './V.Entry.types';
import { VThemeStore } from '@invest.wl/view/src/Theme/V.Theme.store';
import { VThemeStoreTid } from '@invest.wl/view/src/Theme/V.Theme.types';
import { Linking } from 'react-native';
import { withSafeAreaInsets } from 'react-native-safe-area-context';

@observer
class VLayoutEntryScreenComponent extends React.Component<IVEntryScreenProps> {
  private pr = IoC.get<VLayoutEntryPresent>(VLayoutEntryPresentTid);
  private _theme = IoC.get<VThemeStore>(VThemeStoreTid);

  @observable private isUserAgreementChecked = false;

  constructor(props: IVEntryScreenProps) {
    super(props);
    makeObservable(this);
  }

  public render() {
    const { insets } = this.props;
    return (
      <VContainer mb={-(insets?.bottom || 0)}>
        <VStatusBar />
        {this.contentRender}
      </VContainer>
    );
  }

  @computed
  public get contentRender() {
    const pr = this.pr;
    const { color, space } = this._theme;
    const { insets } = this.props;

    return (
      <VContent>
        <VCol mt={space.xl} pa={space.lg} justifyContent={'flex-start'}>
          <VCol>
            <VImage source={require('../../assets/logo.png')} resizeMode={'contain'} />
          </VCol>
          <VText mt={space.xl} font={'title2'}>{'Добро пожаловать в\nмобильное приложение\nУНИВЕР Инвестиции'}</VText>
        </VCol>
        <VImage ph={space.lg} pb={(insets?.bottom || 0) + space.xl} flex justifyContent={'flex-end'} source={require('../../assets/entryBg.png')}>
          <VCheckBox isChecked={this.isUserAgreementChecked} onPress={this.onUserAgreementChange}>
            <VCheckBox.Text>
              <VTouchable.Opacity>
                <VCol ml={space.lg}>
                  <VText font={'body9'}>
                    Я прочитал и принимаю
                  </VText>
                  <VText font={'body9'} color={color.primary1} onPress={this.onUserAgreementLinkPress}>Пользовательское соглашение</VText>
                </VCol>
              </VTouchable.Opacity>
            </VCheckBox.Text>
          </VCheckBox>
          <VButton.Fill mt={space.lg} color={color.primary1} onPress={pr.login} disabled={!this.isUserAgreementChecked}>Войти</VButton.Fill>
          <VRow justifyContent={'center'} marginTop={30}>
            <VText font={'body9'}>Не являетесь клиентом?</VText>
            <VText font={'body9'} color={color.primary1} pl={space.sm} onPress={this.onCreateAccountLinkPress}>
              Открыть счёт
            </VText>
            <VHyperlink />
          </VRow>
        </VImage>
      </VContent>
    );
  }

  // Временная заглушка, в будущем будет интеграция с апи, если будет использоваться.
  @action
  private onUserAgreementChange = () => {
    this.isUserAgreementChecked = !this.isUserAgreementChecked;
  };

  private onCreateAccountLinkPress = () => Linking.openURL(this.pr.createAccountUrl);

  private onUserAgreementLinkPress = () => Linking.openURL(this.pr.userAgreementUrl);
}

export const VLayoutEntryScreen = withSafeAreaInsets(VLayoutEntryScreenComponent);
