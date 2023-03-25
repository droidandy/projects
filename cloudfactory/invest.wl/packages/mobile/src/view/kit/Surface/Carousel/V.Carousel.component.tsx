import { DisposableHolder } from '@invest.wl/common';
import { IoC } from '@invest.wl/core';
import { IVFlexProps, ReactEntity, VCol } from '@invest.wl/mobile';
import { VThemeStore, VThemeStoreTid } from '@invest.wl/view';
import { action, computed, makeObservable, observable, reaction } from 'mobx';
import { observer } from 'mobx-react';
import * as React from 'react';
import { Dimensions, LayoutChangeEvent, ListRenderItemInfo, StyleProp, StyleSheet, ViewStyle } from 'react-native';
import Carousel from 'react-native-snap-carousel';

import { EVCarouselIndicatorPlace, IVCarouselIndicatorPropsBase } from './V.Carousel.types';
import { VCarouselIndicator } from './V.CarouselIndicator.component';

export interface IVCarouselProps<T> extends IVFlexProps {
  style?: StyleProp<ViewStyle>;
  list: T[];
  firstPaintCount?: number;
  activeIndex: number;
  loop?: boolean;
  disabled?: boolean;
  animatedSnap?: boolean;
  loopClonesPerSide?: number;
  indicatorPlace?: EVCarouselIndicatorPlace;
  indicator?: ReactEntity<IVCarouselIndicatorPropsBase>;
  extraData?: any;
  itemWidth?(width: number): number;
  itemRenderer(item: T, index: number): React.ReactElement;
  onSelect?(data: T, index: number): void;
  onSelectIndex?(index: number): void;
}

@observer
export class VCarousel<T> extends React.Component<IVCarouselProps<T>> {
  private theme = IoC.get<VThemeStore>(VThemeStoreTid);

  public static defaultProps: Partial<IVCarouselProps<any>> = {
    loop: false,
    animatedSnap: false,
    firstPaintCount: 2,
  };

  private _windowWidth = Dimensions.get('window').width;
  private _dh = new DisposableHolder();
  private ref = React.createRef<Carousel<T>>();

  @observable public width = 0;

  constructor(props: IVCarouselProps<T>) {
    super(props);
    makeObservable(this);
    this._dh.push(reaction(() => this.props.activeIndex, index => {
      this.ref.current?.snapToItem(index, this.props.animatedSnap, true);
    }));
  }

  public componentWillUnmount() {
    this._dh.dispose();
  }

  public render() {
    const {
      indicatorPlace, loop, disabled, children, list, activeIndex, itemWidth,
      animatedSnap, firstPaintCount, extraData, loopClonesPerSide, ...flexProps
    } = this.props;

    return (
      <VCol onLayout={this._onLayout} {...flexProps}>
        {indicatorPlace === EVCarouselIndicatorPlace.Top && this._renderIndicator}
        <Carousel ref={this.ref} data={list}
          renderItem={this.itemRender}
          sliderWidth={this.width || this._windowWidth}
          itemWidth={this._itemWidth}
          loop={loop}
          loopClonesPerSide={loopClonesPerSide || list.length}
          inactiveSlideScale={1}
          inactiveSlideOpacity={1}
          initialNumToRender={firstPaintCount}
          // @ts-ignore
          onScrollIndexChanged={this._onSwipe}
          onSnapToItem={this._onSwipe}
          firstItem={activeIndex}
          scrollEnabled={!disabled}
          extraData={extraData}
        />
        {indicatorPlace === EVCarouselIndicatorPlace.Bottom && this._renderIndicator}
      </VCol>
    );
  }

  private itemRender = (data: ListRenderItemInfo<T>) =>
    <VCol style={SS.slide}>{this.props.itemRenderer(data.item, data.index)}</VCol>;

  @computed
  private get _itemWidth() {
    const width = this.width || this._windowWidth;
    return this.props.itemWidth?.(width) ?? width;
  }

  @computed
  private get _renderIndicator() {
    const theme = this.theme.kit.Swiper;
    const props = this.props;
    const list = this.props.list;

    if (props.indicator) {
      const barProps: IVCarouselIndicatorPropsBase = {
        activeIndex: props.activeIndex, length: list.length, pageSize: 10,
      };
      return React.isValidElement(props.indicator) ? React.cloneElement(props.indicator, barProps) : (
        <props.indicator {...barProps} />);
    }

    return (
      <VCarouselIndicator mt={theme.sMargin?.md} mh={theme.sMargin?.md}
        length={list.length} activeIndex={props.activeIndex} />
    );
  }

  @action.bound
  private _onSwipe(index: number) {
    const { activeIndex, onSelect, onSelectIndex, list } = this.props;
    if (activeIndex === index) return;
    onSelect?.(list[index], index);
    onSelectIndex?.(index);
  };

  @action.bound
  private _onLayout(event: LayoutChangeEvent) {
    if (this.width) return;
    this.width = event.nativeEvent.layout.width;
  };
}

const SS = StyleSheet.create({
  slide: { flex: 1, alignItems: 'stretch' },
});
