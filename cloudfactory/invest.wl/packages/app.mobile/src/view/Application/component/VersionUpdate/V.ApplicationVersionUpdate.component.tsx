import { ToggleX } from '@invest.wl/common/src/reactive/ToggleX';
import { IoC } from '@invest.wl/core';
import { VButton, VModalDialog } from '@invest.wl/mobile';
import { ISConfigStore, SConfigStoreTid } from '@invest.wl/system/src/Config/S.Config.types';
import { VApplicationVersionPresent, VApplicationVersionPresentTid } from '@invest.wl/view/src/Application/present/V.ApplicationVersion.present';
import { VThemeStore } from '@invest.wl/view/src/Theme/V.Theme.store';
import { VThemeStoreTid } from '@invest.wl/view/src/Theme/V.Theme.types';
import { observer } from 'mobx-react';
import React from 'react';
import { Linking, Platform } from 'react-native';
import RNExitApp from 'react-native-exit-app';

@observer
export class VApplicationVersionUpdate extends React.Component {
  private _pr = IoC.get<VApplicationVersionPresent>(VApplicationVersionPresentTid);
  private _theme = IoC.get<VThemeStore>(VThemeStoreTid);
  private _cfg = IoC.get<ISConfigStore>(SConfigStoreTid);
  private _dialog = new ToggleX();

  public componentDidMount() {
    if (this._pr.cse.needUpdate) {
      this._dialog.open();
    }
  }

  public render() {
    const { space, color, kit } = this._theme;

    return (
      <VModalDialog isVisible={this._dialog.isOpen} animationDuration={0} onClose={this._onClose}>
        <VModalDialog.Text alignSelf={'center'} pa={space.lg} text={'Вышла новая версия приложения'} />
        <VModalDialog.Actions>
          <VButton.Stroke flex radius={0} color={color.accent2}
            leftBottomRadius={kit.ModalDialog.sRadius?.md}
            onPress={this._onClose}>Отмена</VButton.Stroke>
          <VButton.Fill flex radius={0} color={color.primary2}
            rightBottomRadius={kit.ModalDialog.sRadius?.md}
            onPress={this._onUpdate}>Обновить</VButton.Fill>
        </VModalDialog.Actions>
      </VModalDialog>
    );
  }

  private _onClose = () => RNExitApp.exitApp();

  private _onUpdate = async () =>
    await Linking.openURL(Platform.OS === 'android' ? this._cfg.appLinkAndroid : this._cfg.appLinkIOS);
}
