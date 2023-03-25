import { Formatter } from '@invest.wl/common/src/util/formatter.util';
import { IoC } from '@invest.wl/core';
import { VCol, VContainer, VContent, VNavBar, VStatusBar, VText } from '@invest.wl/mobile';
import {
  IVApplicationVersionPresentProps,
  VApplicationVersionPresent,
  VApplicationVersionPresentTid,
} from '@invest.wl/view/src/Application/present/V.ApplicationVersion.present';
import { VThemeStore } from '@invest.wl/view/src/Theme/V.Theme.store';
import { VThemeStoreTid } from '@invest.wl/view/src/Theme/V.Theme.types';
import { observer } from 'mobx-react';
import React from 'react';

export interface IVApplicationVersionScreenProps extends IVApplicationVersionPresentProps {
}

@observer
export class VApplicationVersionScreen extends React.Component<IVApplicationVersionScreenProps> {
  private theme = IoC.get<VThemeStore>(VThemeStoreTid);
  private pr = IoC.get<VApplicationVersionPresent>(VApplicationVersionPresentTid);

  public componentDidMount() {
    this.pr.init(this.props);
  }

  public render() {
    const { cse } = this.pr;
    const { space, color } = this.theme;

    return (
      <VContainer>
        <VStatusBar />
        <VNavBar>
          <VNavBar.Back />
          <VNavBar.Title text={'О приложении'} />
        </VNavBar>
        <VContent footerTabs>
          <VCol flex mt={space.lg}>
            <VText color={color.muted4} alignSelf={'center'} font={'body19'}>Expobank App
              ver {cse.build} от {Formatter.date(cse.buildDate!, { pattern: 'default' })}</VText>
          </VCol>
        </VContent>
      </VContainer>
    );
  }
}
