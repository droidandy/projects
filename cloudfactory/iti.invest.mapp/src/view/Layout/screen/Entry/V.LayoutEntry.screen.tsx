import React from 'react';
import { observer } from 'mobx-react';
import { computed, makeObservable } from 'mobx';
import { IoC } from '@invest.wl/core/src/di/IoC';
import { VButton, VCol, VContainer, VContent, VImage, VRow, VStatusBar, VText } from '@invest.wl/mobile/src/view/kit';
import { VLayoutEntryPresent, VLayoutEntryPresentTid } from './V.LayoutEntry.present';
import { IVEntryScreenProps } from './V.Entry.types';
import { StyleSheet } from 'react-native';
import { VThemeStore } from '@invest.wl/view/src/Theme/V.Theme.store';
import { VThemeStoreTid } from '@invest.wl/view/src/Theme/V.Theme.types';

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
        <VStatusBar translucent />
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
          <VText mt={space.lg} font={'title2'}>{'Добро пожаловать\nв мобильный торговый терминал'}</VText>
          <VText mt={space.lg} font={'body10'} color={color.text}>
            {'Максимальный рейтинг\nнадёжности — по версии\nНационального Рейтингового\nАгентства (НРА) '}
          </VText>
        </VCol>
        <VCol justifyContent={'flex-end'}>
          <VButton.Stroke mt={space.lg} color={color.accent1} onPress={pr.register}>Далее</VButton.Stroke>
          <VButton.Fill mt={space.lg} color={color.accent1} onPress={pr.login}>Войти</VButton.Fill>
          <VRow justifyContent={'center'} marginTop={30}>
            <VText font={'body9'}>Забыли пароль?</VText>
            <VText font={'body9'} color={color.text} style={SS.restore} pl={space.sm} onPress={pr.passwordRestore}>
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
