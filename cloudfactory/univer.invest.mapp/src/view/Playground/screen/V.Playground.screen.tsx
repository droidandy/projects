import React from 'react';
import { observer } from 'mobx-react';
import { computed, makeObservable } from 'mobx';
import { IoC } from '@invest.wl/core/src/di/IoC';
import { VButton, VContainer, VContent, VNavBar, VStatusBar, VText } from '@invest.wl/mobile/src/view/kit';
import { VThemeStore } from '@invest.wl/view/src/Theme/V.Theme.store';
import { VThemeStoreTid } from '@invest.wl/view/src/Theme/V.Theme.types';
import { VFormatNumber } from '@invest.wl/mobile/src/view/kit/Output/Format/V.FormatNumber.component';

@observer
export class VPlaygroundScreen extends React.Component {
  private _theme = IoC.get<VThemeStore>(VThemeStoreTid);

  constructor(props: any) {
    super(props);
    makeObservable(this);
  }

  public render() {
    return (
      <VContainer>
        <VStatusBar />
        <VNavBar middleCenter={false}>
          <VNavBar.LeftIcon name={'nav-back'} />
          <VNavBar.Middle bg={'red'}>
            <VText>fsaf asf asf </VText>
            <VText>fsaf asf asf </VText>
            <VText>fsaf asf asf </VText>
          </VNavBar.Middle>
          <VNavBar.Title text={'ffsaf'} />
          <VNavBar.RightIcon name={'nav-back'} />
          <VNavBar.RightIcon name={'nav-back'} />
          <VNavBar.RightIcon name={'nav-back'} />
        </VNavBar>
        <VContent pa={this._theme.space.lg}>
          {this.contentRender}
        </VContent>
      </VContainer>
    );
  }

  @computed
  private get contentRender() {
    return (
      <>
        <VFormatNumber size={'lg'}>124.32</VFormatNumber>
        <VButton.Stroke>test</VButton.Stroke>
      </>
    );
  }
}

