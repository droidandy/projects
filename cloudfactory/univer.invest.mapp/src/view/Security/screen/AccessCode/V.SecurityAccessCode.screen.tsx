import { observer } from 'mobx-react';
import React from 'react';

import {
  IVSecurityAccessCodePresentProps, VSecurityAccessCodePresent, VSecurityAccessCodePresentTid,
} from '@invest.wl/view/src/Security/present/V.SecurityAccessCode.present';
import { VCol, VContainer, VContent, VNavBar, VStatusBar } from '@invest.wl/mobile/src/view/kit';
import { IoC } from '@invest.wl/core/src/di/IoC';
import { VThemeStoreTid } from '@invest.wl/view/src/Theme/V.Theme.types';
import { VThemeStore } from '@invest.wl/view/src/Theme/V.Theme.store';
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
          <VSecurityCode confirmation onFulfilled={pr.accessRequest} />
          <VCol flex />
        </VContent>
      </VContainer>
    );
  }
}
