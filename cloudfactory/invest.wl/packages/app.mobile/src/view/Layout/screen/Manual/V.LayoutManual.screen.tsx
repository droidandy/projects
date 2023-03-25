import { IoC } from '@invest.wl/core';
import { VButton, VCard, VCarousel, VCarouselIndicator, VCol, VContainer, VContent, VImage, VStatusBar, VText } from '@invest.wl/mobile';
import { VThemeStore } from '@invest.wl/view/src/Theme/V.Theme.store';
import { VThemeStoreTid } from '@invest.wl/view/src/Theme/V.Theme.types';
import { computed, makeObservable } from 'mobx';
import { observer } from 'mobx-react';
import React from 'react';
import { VLayoutManualPresent, VLayoutManualPresentTid } from './V.LayoutManual.present';
import { IVLayoutManualItem, IVLayoutManualScreenProps } from './V.LayoutManual.types';

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
        <VStatusBar />
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
        <VCol flex maxHeight={74} />
        <VImage
          alignSelf={'center'}
          style={{ width: 199 }}
          source={require('../../assets/logo.png')}
          resizeMode={'contain'} />
        <VCol flex maxHeight={40} />
        <VCarousel flex activeIndex={pr.activeIndex} mh={-space.lg} onSelectIndex={pr.activeSet}
          list={pr.list} itemRenderer={this.renderItem} />
        <VCarouselIndicator alignSelf={'center'} mt={space.md}
          length={pr.list.length} activeIndex={pr.activeIndex} />
        <VCol flex />
        <VCol>
          <VButton.Fill mt={space.lg} color={color.accent1} onPress={pr.next}>ДАЛЕЕ</VButton.Fill>
          {
            !pr.isLast && (
              <VButton.Stroke mt={space.lg} color={color.accent1}
                onPress={pr.goMain}>ПРОПУСТИТЬ</VButton.Stroke>
            )
          }
        </VCol>
      </VContent>
    );
  }

  private renderItem = (item: IVLayoutManualItem, index: number) => {
    const theme = this.theme;

    return (
      <VCard key={index} pa={theme.space.lg} alignItems={'center'}
        mv={theme.space.md} mh={theme.space.lg}>
        <VImage height={220} source={item.image}
          resizeMode={'cover'} resizeMethod={'scale'} />
        <VCol flex />
        <VText ta={'center'} mh={theme.space.lg} font={'body2'}>
          {item.title}
        </VText>
        <VText ta={'center'} mt={theme.space.lg} font={'body10'} color={theme.color.muted4}>
          {item.message}
        </VText>
      </VCard>
    );
  };
}
