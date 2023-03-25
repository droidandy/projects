import React from 'react';
import { observer } from 'mobx-react';
import { IoC } from '@invest.wl/core/src/di/IoC';
import {
  IVApplicationVersionPresentProps, VApplicationVersionPresent, VApplicationVersionPresentTid,
} from '@invest.wl/view/src/Application/present/V.ApplicationVersion.present';
import { VCol, VContainer, VContent, VNavBar, VStatusBar, VText } from '@invest.wl/mobile/src/view/kit';
import { VThemeStoreTid } from '@invest.wl/view/src/Theme/V.Theme.types';
import { VThemeStore } from '@invest.wl/view/src/Theme/V.Theme.store';
import { Formatter } from '@invest.wl/common/src/util/formatter.util';

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
            <VText color={color.muted4} alignSelf={'center'} font={'body19'}>Univerbank App
              ver {cse.build} от {Formatter.date(cse.buildDate!, { pattern: 'default' })}</VText>
          </VCol>
        </VContent>
      </VContainer>
    );
  }
}
