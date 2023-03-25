import { DisposableHolder, makeArrayWithNumbers } from '@invest.wl/common';
import { IoC } from '@invest.wl/core';
import { VThemeStore, VThemeStoreTid } from '@invest.wl/view';
import { action, computed, makeObservable, observable, reaction } from 'mobx';
import { observer } from 'mobx-react';
import * as React from 'react';
import { Dimensions, LayoutChangeEvent, ListRenderItemInfo, StyleProp, StyleSheet, View, ViewStyle } from 'react-native';
import Carousel from 'react-native-snap-carousel';
import { ReactEntity } from '../../../types/react.types';

import { IVFlexProps, VCol } from '../../Layout/Flex';
import { IVSwiperBarPropsBase, SwiperIndicator, SwiperStyleName } from './V.Swiper.types';
import { VSwiperDots } from './V.SwiperDots.component';

const LOOP_MULTIPLIER = 20;

export interface ISwiperListItem<T = any> {
  content: JSX.Element;
  data?: T;
}

export interface IVSwiperProps<T = any> extends IVFlexProps {
  style?: StyleProp<ViewStyle>;
  styleName?: SwiperStyleName;
  list?: ISwiperListItem<T>[];
  indicator?: SwiperIndicator;
  children?: React.ReactNode;
  activeIndex: number;
  itemMargin?: number;
  loop?: boolean;
  disabled?: boolean;
  animatedSnap?: boolean;
  onSelect?: (data: T, index: number) => void;
  onSelectIndex?: (index: number) => void;
  barComponent?: ReactEntity<IVSwiperBarPropsBase>;
}

// deprecated - use VCarousel
@observer
export class VSwiper<T> extends React.Component<IVSwiperProps<T>> {
  private theme = IoC.get<VThemeStore>(VThemeStoreTid);

  public static defaultProps: IVSwiperProps = {
    styleName: 'default',
    indicator: 'bottom',
    itemMargin: 0,
    activeIndex: 0,
    loop: false,
    animatedSnap: false,
  };

  private _dh = new DisposableHolder();
  private ref = React.createRef<Carousel<number>>();
  private isInited = false;

  constructor(props: IVSwiperProps<T>) {
    super(props);
    makeObservable(this);
    this._dh.push(reaction(() => this.props.activeIndex, index => {
      this.ref.current?.snapToItem(index, this.props.animatedSnap, true);
    }));
  }

  public componentWillUnmount() {
    this._dh.dispose();
  }

  @computed
  private get _children() {
    return React.Children.toArray(this.props.children).filter(c => React.isValidElement(c));
  };

  // Размеры карусели и карт могут быть переданы через стили значением в пикселях,
  // тогда берем эти значения и записываем с state. Иначе вычисляем их в onLayout,
  // т.к. компоненту Carousel нужны ненулевые значения для первоначальных расчетов
  @observable private carouselWidth = (this.props.style && StyleSheet.flatten(this.props.style).width as number) || Dimensions.get('window').width;
  @observable private cardWidth = this.carouselWidth ? this.carouselWidth - this.props.itemMargin! : 0;

  @computed
  private get data() {
    return makeArrayWithNumbers(this._cardList.length);
  }

  public render() {
    const {
      indicator, loop, disabled, children, list, activeIndex,
      itemMargin, animatedSnap, ...flexProps
    } = this.props;

    return (
      <VCol onLayout={this._onLayout} {...flexProps}>
        {indicator === 'top' && this._renderIndicator}
        <Carousel
          ref={this.ref}
          data={this.data}
          renderItem={this.itemRender}
          sliderWidth={this.carouselWidth}
          itemWidth={this.cardWidth}
          loop={loop}
          loopClonesPerSide={LOOP_MULTIPLIER}
          inactiveSlideScale={1}
          onSnapToItem={this._onSwipe}
          firstItem={activeIndex}
          scrollEnabled={!disabled}
        />
        {indicator === 'bottom' && this._renderIndicator}
      </VCol>
    );
  }

  private itemRender = (item: ListRenderItemInfo<number>) => {
    const index = item.index % this._cardList.length;

    return index === this.props.activeIndex ? (
      <View style={SS.slide}>{this._cardList[index]}</View>
    ) : null;
  };

  @computed
  private get _cardList() {
    const list = this.props.list;
    const items: any[] = list
      ? list.map(item => item.content)
      : (this._children.length ? this._children : []);

    return items.map(item =>
      React.cloneElement(item, { style: [SS.slideInner, item.props.style] }),
    );
  };

  @computed
  private get _renderIndicator() {
    const theme = this.theme.kit.Swiper;
    const props = this.props;
    const list = this._cardList;

    if (props.barComponent) {
      const barProps: IVSwiperBarPropsBase = {
        activeIndex: props.activeIndex, itemsCount: list.length, pageSize: 10,
      };

      return React.isValidElement(props.barComponent) ?
        React.cloneElement(props.barComponent, barProps) :
        (<props.barComponent {...barProps} />);
    }

    return (
      <VSwiperDots
        mt={theme.sMargin?.md}
        mh={theme.sMargin?.md}
        itemsCount={this._cardList.length}
        activeIndex={props.activeIndex} />
    );
  }

  @action.bound
  private _onSwipe(index: number) {
    const { activeIndex, onSelect, onSelectIndex, list } = this.props;
    if (activeIndex === index) return;
    if (list?.length) onSelect?.(list[index]?.data!, index);
    onSelectIndex?.(index);
  };

  @action.bound
  private _onLayout(event: LayoutChangeEvent) {
    if (this.isInited) return;

    this.carouselWidth = event.nativeEvent.layout.width;
    this.cardWidth = this.carouselWidth - this.props.itemMargin! * 2;
    this.isInited = true;
  };
}

const SS = StyleSheet.create({
  // swiper
  slide: { flex: 1, alignItems: 'stretch' },
  slideInner: { width: '100%' },
});
