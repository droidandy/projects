import { IoC } from '@invest.wl/core';
import { VCol, VContainer, VContent, VImage, VNavBar, VStatusBar } from '@invest.wl/mobile';

import {
  IVSecurityAccessCodePresentProps,
  VSecurityAccessCodePresent,
  VSecurityAccessCodePresentTid,
} from '@invest.wl/view/src/Security/present/V.SecurityAccessCode.present';
import { VThemeStore } from '@invest.wl/view/src/Theme/V.Theme.store';
import { VThemeStoreTid } from '@invest.wl/view/src/Theme/V.Theme.types';
import { observer } from 'mobx-react';
import React from 'react';
import { VSecurityCode } from '../../';

export interface IVSecurityAccessCodeScreenProps extends IVSecurityAccessCodePresentProps {
}

@observer
export class VSecurityAccessCodeScreen extends React.Component<IVSecurityAccessCodeScreenProps> {
  private theme = IoC.get<VThemeStore>(VThemeStoreTid);
  private pr = IoC.get<VSecurityAccessCodePresent>(VSecurityAccessCodePresentTid);

  public async componentDidMount() {
    await this.pr.init(this.props);
  }

  public render() {
    const pr = this.pr;
    const theme = this.theme;

    return (
      <VContainer>
        <VStatusBar />
        <VNavBar>
          <VNavBar.Back />
          <VNavBar.Title text={'Установка ПИН-кода'} />
        </VNavBar>
        <VContent flex bg={theme.color.bg} alignItems={'center'}>
          <VCol flex />
          <VImage source={require('../../../../assets/image/minilogo.png')} resizeMode={'contain'} />
          <VCol flex />
          <VSecurityCode confirmation onFulfilled={pr.accessRequest} />
          <VCol flex />
        </VContent>
      </VContainer>
    );
  }
}
