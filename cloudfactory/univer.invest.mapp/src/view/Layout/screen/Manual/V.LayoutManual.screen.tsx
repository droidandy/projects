import React from 'react';
import { observer } from 'mobx-react';
import { computed, makeObservable } from 'mobx';
import { IoC } from '@invest.wl/core/src/di/IoC';
import {
  VButton, VCarousel, VCarouselIndicator, VCol, VContent, VIcon, VImage, VStatusBar, VText,
} from '@invest.wl/mobile/src/view/kit';
import { IVLayoutManualItem, IVLayoutManualScreenProps } from './V.LayoutManual.types';
import { VLayoutManualPresent, VLayoutManualPresentTid } from './V.LayoutManual.present';
import { VThemeStoreTid } from '@invest.wl/view/src/Theme/V.Theme.types';
import { VThemeStore } from '@invest.wl/view/src/Theme/V.Theme.store';
import { SafeAreaView } from 'react-native';

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
      <VCol flex>
        <VStatusBar />
        {this.contentRender}
      </VCol>
    );
  }

  @computed
  private get contentRender() {
    const pr = this.pr;
    const { color, space } = this.theme;

    return (
      <VContent>
        <VImage source={require('../../assets/manualBg.png')} height={'100%'}>
          <SafeAreaView style={{ flex: 1 }}>
            <VCarouselIndicator alignSelf={'center'} mt={space.md}
              length={pr.list.length} activeIndex={pr.activeIndex} colorActive={color.base} />
            <VCol flex maxHeight={40} />
            <VCarousel flex activeIndex={pr.activeIndex} mh={-space.lg} onSelectIndex={pr.activeSet}
              list={pr.list} itemRenderer={this.renderItem} />
            <VCol alignItems={'center'}>
              <VButton.Fill mb={space.lg} color={color.primary2} onPress={pr.next} width={60} height={60} radius={30}>
                <VIcon fontSize={36} name={'arrow-dropdown'} rotate={'-90deg'} />
              </VButton.Fill>
            </VCol>
          </SafeAreaView>
        </VImage>
      </VContent>
    );
  }

  private renderItem = (item: IVLayoutManualItem, index: number) => {
    const theme = this.theme;

    return (
      <VCol key={index}>
        <VText ta={'center'} mh={theme.space.lg} font={'title2'} color={theme.color.base}>
          {item.title}
        </VText>
        <VText ta={'center'} mt={theme.space.lg} font={'body3'} color={theme.color.base}>
          {item.message}
        </VText>
      </VCol>
    );
  };
}
