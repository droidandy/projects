import { IoC } from '@invest.wl/core';
import { VButton, VCol, VContainer, VContent, VImage, VRow, VStatusBar, VText } from '@invest.wl/mobile';
import { VThemeStore } from '@invest.wl/view/src/Theme/V.Theme.store';
import { VThemeStoreTid } from '@invest.wl/view/src/Theme/V.Theme.types';
import { computed, makeObservable } from 'mobx';
import { observer } from 'mobx-react';
import React from 'react';
import { StyleSheet } from 'react-native';
import { IVEntryScreenProps } from './V.Entry.types';
import { VLayoutEntryPresent, VLayoutEntryPresentTid } from './V.LayoutEntry.present';

@observer
export class VLayoutEntryScreen extends React.Component<IVEntryScreenProps> {
  private pr = IoC.get<VLayoutEntryPresent>(VLayoutEntryPresentTid);
  private _theme = IoC.get<VThemeStore>(VThemeStoreTid);

  constructor(props: IVEntryScreenProps) {
    super(props);
    makeObservable(this);
  }

  public render() {
    return (
      <VContainer>
        <VStatusBar />
        {this.contentRender}
      </VContainer>
    );
  }

  @computed
  private get contentRender() {
    const pr = this.pr;
    const { color, space } = this._theme;

    return (
      <VContent pa={space.lg}>
        <VCol flex justifyContent={'center'}>
          <VCol>
            <VImage source={require('../../assets/minilogo.png')} resizeMode={'contain'} />
          </VCol>
          <VText mt={space.lg} font={'title2'}>{'Добро пожаловать\nв мобильный-банк'}</VText>
          <VText mt={space.lg} font={'body10'} color={color.muted4}>
            {'Мы лучший банк России\nПо версии EMEA Finance\nEurope Banking '}
          </VText>
        </VCol>
        <VCol justifyContent={'flex-end'}>
          <VButton.Fill mt={space.lg} color={color.accent1} onPress={pr.register}>СТАТЬ КЛИЕНТОМ</VButton.Fill>
          <VButton.Fill mt={space.lg} color={color.primary2} onPress={pr.login}>ВОЙТИ</VButton.Fill>
          <VRow justifyContent={'center'} marginTop={30}>
            <VText font={'body9'}>Забыли пароль?</VText>
            <VText font={'body9'} color={color.muted4} style={SS.restore} pl={space.sm} onPress={pr.passwordRestore}>
              Восстановить пароль
            </VText>
          </VRow>
        </VCol>
      </VContent>
    );
  }
}

const SS = StyleSheet.create({
  restore: { textDecorationLine: 'underline' },
});
