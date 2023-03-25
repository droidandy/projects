import { IoC } from '@invest.wl/core';
import { mapScreenPropsToProps, VButton, VCol, VContainer, VContent, VIcon, VNavBar, VRow, VStatusBar, VStubError, VSwitch, VText } from '@invest.wl/mobile';
import {
  IVSecurityAccessBiometryPresentProps,
  VSecurityAccessBiometryPresent,
  VSecurityAccessBiometryPresentTid,
} from '@invest.wl/view/src/Security/present/V.SecurityAccessBiometry.present';
import { IVSecurityI18n, VSecurityI18nTid } from '@invest.wl/view/src/Security/V.Security.types';
import { VThemeStore } from '@invest.wl/view/src/Theme/V.Theme.store';
import { VThemeStoreTid } from '@invest.wl/view/src/Theme/V.Theme.types';
import { observer } from 'mobx-react';
import React from 'react';

export interface IVSecurityAccessBiometryScreenProps extends IVSecurityAccessBiometryPresentProps {

}

@mapScreenPropsToProps
@observer
export class VSecurityAccessBiometryScreen extends React.Component<IVSecurityAccessBiometryScreenProps> {
  private theme = IoC.get<VThemeStore>(VThemeStoreTid);
  private pr = IoC.get<VSecurityAccessBiometryPresent>(VSecurityAccessBiometryPresentTid);
  private _i18n = IoC.get<IVSecurityI18n>(VSecurityI18nTid);

  public async componentDidMount() {
    this.pr.init(this.props);
  }

  public render() {
    const pr = this.pr;
    const biometry = this._i18n.biometry;
    const theme = this.theme;

    return (
      <VContainer>
        <VStatusBar />
        <VNavBar>
          <VNavBar.Title text={biometry?.accessTitle || 'Установка быстрого входа'} />
          <VNavBar.RightText title={'ВЫЙТИ'} onPress={pr.signOut} />
        </VNavBar>
        <VContent pa={20} bg={theme.color.bg}>
          {this._contentRender()}
          <VButton.Stroke mt={theme.space.lg} color={theme.color.accent1} onPress={pr.mainGo}>НЕ СЕЙЧАС</VButton.Stroke>
        </VContent>
      </VContainer>
    );
  }

  private _contentRender() {
    const pr = this.pr;
    const biometry = this._i18n.biometry;
    const theme = this.theme;

    if (!biometry) return <VStubError text={'Отсутствует биометрия'} />;

    return (
      <>
        <VText font={'body4'} ta={'center'} mt={'lg'}>
          {`Подключите ${biometry.name},\nчтобы не вводить каждый раз\nкод доступа при авторизации`}
        </VText>
        <VCol flex justifyContent={'center'} alignItems={'center'}>
          <VIcon name={biometry.iconName} fontSize={72} color={theme.color.muted4} />
        </VCol>
        <VRow justifyContent={'space-between'}>
          <VText font={'body9'}>{`Использовать ${biometry.name}\nдля подтверждения заявки`}</VText>
          <VSwitch value={pr.settingCase.orderConfirmByBio} onValueChange={pr.settingCase.orderConfirmByBioSet} />
        </VRow>
        <VButton.Fill mt={theme.space.xl} color={theme.color.primary2} onPress={pr.access}>
        ПОДКЛЮЧИТЬ
        </VButton.Fill>
      </>
    );
  }
}
