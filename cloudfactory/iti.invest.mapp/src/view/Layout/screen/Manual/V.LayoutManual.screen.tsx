import React from 'react';
import { observer } from 'mobx-react';
import { computed, makeObservable } from 'mobx';
import { IoC } from '@invest.wl/core/src/di/IoC';
import {
  VButton, VCarousel, VCarouselIndicator, VCol, VContainer, VContent, VImage, VStatusBar, VText,
} from '@invest.wl/mobile/src/view/kit';
import { IVLayoutManualItem, IVLayoutManualScreenProps } from './V.LayoutManual.types';
import { VLayoutManualPresent, VLayoutManualPresentTid } from './V.LayoutManual.present';
import { VThemeStoreTid } from '@invest.wl/view/src/Theme/V.Theme.types';
import { VThemeStore } from '@invest.wl/view/src/Theme/V.Theme.store';

@observer
export class VLayoutManualScreen extends React.Component<IVLayoutManualScreenProps> {
  private theme = IoC.get<VThemeStore>(VThemeStoreTid);
  private pr = IoC.get<VLayoutManualPresent>(VLayoutManualPresentTid);

  constructor(props: IVLayoutManualScreenProps) {
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
    const { color, space } = this.theme;

    return (
        <VContent pa={space.lg}>
          <VCol absoluteFill alignItems={'center'}>
            <VImage width="100%" height="100%" source={require('../../assets/background.png')} />
          </VCol>
          <VCarouselIndicator alignSelf={'center'} mt={space.md} length={pr.list.length} activeIndex={pr.activeIndex} />
          <VCarousel flex activeIndex={pr.activeIndex} mh={-space.lg} onSelectIndex={pr.activeSet}
                     list={pr.list} itemRenderer={this.renderItem} />
          <VCol>
            <VButton.Fill mt={space.lg} color={color.accent1} onPress={pr.next}>
              {pr.isLast ? 'Начать': 'Далее'}
            </VButton.Fill>
          </VCol>
        </VContent>
    );
  }

  private renderItem = (item: IVLayoutManualItem, index: number) => {
    const theme = this.theme;

    return (
      <VContent style={{ backgroundColor: 'transparent' }} key={index} pa={theme.space.lg} alignItems={'center'} mv={theme.space.md} mh={theme.space.lg}>
        <VText ta={'center'} mh={theme.space.lg} font={'body2'} color={theme.color.base}>
          {item.title}
        </VText>
        <VText ta={'center'} mt={theme.space.lg} font={'body10'} color={theme.color.base}>
          {item.message}
        </VText>
      </VContent>
    );
  };
}
