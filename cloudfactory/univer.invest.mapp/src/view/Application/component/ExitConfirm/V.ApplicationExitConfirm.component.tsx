import React from 'react';
import { observer } from 'mobx-react';
import RNExitApp from 'react-native-exit-app';
import { IoC } from '@invest.wl/core/src/di/IoC';
import { VButton, VModalDialog } from '@invest.wl/mobile/src/view/kit';
import { VThemeStoreTid } from '@invest.wl/view/src/Theme/V.Theme.types';
import { VThemeStore } from '@invest.wl/view/src/Theme/V.Theme.store';
import { ToggleX } from '@invest.wl/common/src/reactive/ToggleX';
import { SHardwareBackHolder } from '@invest.wl/system/src/HardwareBack/S.HardwareBack.holder';
import { ISHardwareBackEvent } from '@invest.wl/system/src/HardwareBack/S.HardwareBack.types';

@observer
export class VApplicationExitConfirm extends React.Component {
  private _theme = IoC.get<VThemeStore>(VThemeStoreTid);
  private _hbh = new SHardwareBackHolder();
  private _dialog = new ToggleX();

  public componentDidMount() {
    this._hbh.subscribe(this._onBack);
  }

  public componentWillUnmount() {
    this._hbh.dispose();
  }

  public render() {
    const { space, color } = this._theme;

    return (
      <VModalDialog isVisible={this._dialog.isOpen} animationDuration={0} onClose={this._dialog.close}>
        <VModalDialog.Title pa={space.lg} pb={0} alignSelf={'center'} text={'Вы действительно желаете закрыть приложение?'} />
        <VModalDialog.Actions pa={space.lg}>
          <VButton.Fill flex mr={space.lg} color={color.decorLight} colorText={color.primary1}
            onPress={this._dialog.close}>Нет</VButton.Fill>
          <VButton.Fill flex color={color.accent2}
            onPress={this._onConfirm}>Да</VButton.Fill>
        </VModalDialog.Actions>
      </VModalDialog>
    );
  }

  private _onConfirm = () => RNExitApp.exitApp();

  private _onBack = (e?: ISHardwareBackEvent) => {
    if (e?.appExit) {
      e!.appExit = false;
      this._dialog.open();
    }
  };
}
