import React from 'react';
import { StatusBar } from 'react-native';
import { IVFlexProps, VButton, VCol, VImage, VText } from '@invest.wl/mobile/src/view/kit';
import { VLaunch } from '_view/Layout/component/V.Launch.component';
import { IoC } from '@invest.wl/core/src/di/IoC';
import { VThemeStoreTid } from '@invest.wl/view/src/Theme/V.Theme.types';
import { VThemeStore } from '@invest.wl/view/src/Theme/V.Theme.store';

interface Props extends IVFlexProps {
  isError?: boolean;
  onRetry?: () => void;
}

export class AppLoading extends React.PureComponent<Props> {
  private theme = IoC.get<VThemeStore>(VThemeStoreTid);

  public render() {
    const { isError, onRetry, ...props } = this.props;
    const { color, space } = this.theme;

    return (
      <VCol bg={color.bg} {...props}>
        <StatusBar translucent barStyle={'dark-content'} />
        {!isError ? (
          <VLaunch />
        ) : (
          <VCol flex justifyContent={'space-between'}>
            <VText font={'body2'} ta={'center'} mt={60} mb={space.lg}>Сервис
              временно {'\n'} недоступен</VText>
            <VImage source={require('./assets/Illustration.png')} mb={space.lg} alignSelf={'center'} />
            <VText font={'body5'} ta={'center'}>Мы знаем, в чём проблема и {'\n'} уже
              работаем над ее решением.</VText>
            <VText font={'body5'} ta={'center'}>Попробуйте позднее.</VText>
            <VButton.Fill color={color.accent1} onPress={onRetry} ma={space.lg}>Повторить</VButton.Fill>
          </VCol>
        )}
      </VCol>
    );
  }
}
