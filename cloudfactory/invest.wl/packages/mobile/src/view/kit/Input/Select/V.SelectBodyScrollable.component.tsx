import { DisposableHolder } from '@invest.wl/common';
import { action, computed, makeObservable, observable, reaction, runInAction } from 'mobx';
import { observer } from 'mobx-react';
import React from 'react';
import { LayoutChangeEvent, NativeScrollEvent, NativeSyntheticEvent, ScrollView, StyleProp, StyleSheet, ViewStyle } from 'react-native';
import { DimensionsWidth } from '../../../Theme';
import { IVFlexProps, VCol, VRow } from '../../Layout';

export interface IVSelectBodyScrollableProps extends IVFlexProps {
  style?: StyleProp<ViewStyle>;
  containerStyle?: StyleProp<ViewStyle>;
  listLength: number;
  activeIndex: number;
  scrollEventThrottle: number;
}

@observer
export class VSelectBodyScrollable extends React.Component<IVSelectBodyScrollableProps> {
  public static defaultProps = {
    activeIndex: 0,
    scrollEventThrottle: 16,
  };

  private _dh = new DisposableHolder();
  private _scrollView = React.createRef<ScrollView>();
  @observable public containerWidth = DimensionsWidth;
  @observable private _scrollWidth = DimensionsWidth;
  @observable private _offsetX = 0;
  @observable private _itemWidthList = new Array<number>(this.props.listLength).fill(0);

  public itemMargin = 0;

  @computed
  public get isScrollable() {
    return this.containerWidth < this._itemWidthTotalWithMargin;
  }

  @computed
  private get _children() {
    this.itemMargin = 0;
    return React.Children.toArray(this.props.children).map((item, index) => {
      if (React.isValidElement(item)) {
        const margin = item.props.ml || item.props.mr;
        if (margin > this.itemMargin) this.itemMargin = margin;
      }
      return React.cloneElement(item as any, { onLayout: (e: LayoutChangeEvent) => this._itemOnLayout(e, index) });
    });
  }

  constructor(props: IVSelectBodyScrollableProps) {
    super(props);
    makeObservable(this);
  }

  public componentDidUpdate(prevProps: IVSelectBodyScrollableProps) {
    if (this.props.activeIndex !== prevProps.activeIndex) this._scrollToActive();
  }

  public componentDidMount() {
    this._dh.push(reaction(() => this.props.listLength, (length) => {
      this._scrollView.current?.scrollTo({ x: 0, animated: false });
      runInAction(() => this._itemWidthList = new Array<number>(this.props.listLength).fill(0));
    }));
  }

  public componentWillUnmount() {
    this._dh.dispose();
  }

  public render() {
    const { children, scrollEventThrottle, ...flexProps } = this.props;

    return (
      <VCol {...flexProps}>
        <ScrollView
          contentContainerStyle={this.ss.container}
          ref={this._scrollView}
          scrollEnabled={this.isScrollable}
          automaticallyAdjustContentInsets={false}
          horizontal={true}
          showsHorizontalScrollIndicator={false}
          showsVerticalScrollIndicator={false}
          directionalLockEnabled={true}
          bounces={false}
          scrollsToTop={false}
          onLayout={this._containerOnLayout}
          onScroll={this._onScroll}
          scrollEventThrottle={scrollEventThrottle}
        >
          <VRow style={this.ss.scrollable} onLayout={this._scrollOnLayout}>{this._children}</VRow>
        </ScrollView>
      </VCol>
    );
  }

  @computed
  private get _itemWidthTotal() {
    return this._itemWidthList.reduce((acc, v) => acc + v, 0);
  }

  @computed
  private get _itemWidthTotalWithMargin() {
    return this._itemWidthTotal + (this.itemMargin * (this.props.listLength - 1));
  }

  @action
  private _onScroll = (e: NativeSyntheticEvent<NativeScrollEvent>) => {
    this._offsetX = e.nativeEvent.contentOffset.x;
  };

  @action
  private _containerOnLayout = (e: LayoutChangeEvent) => {
    this.containerWidth = e.nativeEvent.layout.width;
  };

  @action
  private _scrollOnLayout = (e: LayoutChangeEvent) => {
    const width = e.nativeEvent.layout.width;
    if (this._scrollWidth !== width) this._scrollWidth = e.nativeEvent.layout.width;
  };

  @action
  private _itemOnLayout = (e: LayoutChangeEvent, index: number) => {
    const width = e.nativeEvent.layout.width;
    if (index != null && this._itemWidthList[index] !== width) this._itemWidthList[index] = width;
  };

  // подсчеты для скролла до активного элемента
  private get _offsetBeforeItemActive() {
    const { activeIndex } = this.props;
    return this._itemWidthList.filter((_, i) => i < activeIndex).reduce((acc, item) => acc + item + this.itemMargin, 0);
  }

  private get _widthBeforeItemActive() {
    const { activeIndex } = this.props;
    return this._itemWidthList.filter((_, i) => i <= activeIndex).reduce((acc, item) => acc + item + this.itemMargin, 0);
  }

  private get _nextWidth() {
    const { activeIndex, listLength } = this.props;
    const nextIndex = activeIndex + 1;
    if (nextIndex < listLength) return this._itemWidthList[nextIndex] + this.itemMargin;
    return 0;
  }

  private get _prevWidth() {
    const { activeIndex } = this.props;
    const prevIndex = activeIndex - 1;
    if (prevIndex >= 0) return this._itemWidthList[prevIndex] + this.itemMargin;
    return 0;
  }

  private _scrollToActive = () => {
    let x;
    // по левому краю
    if (this._offsetBeforeItemActive < this._offsetX + this.itemMargin) {
      x = this._offsetBeforeItemActive - this._prevWidth;
    }
    // по правому краю
    const offsetRight = this._offsetX + this.containerWidth;
    if (this._widthBeforeItemActive + this.itemMargin > offsetRight) {
      x = this._offsetX + (this._widthBeforeItemActive - offsetRight) + this._nextWidth;
    }
    if (x != null) this._scrollView.current?.scrollTo({ x, animated: true });
  };

  @computed
  private get ss() {
    return StyleSheet.create({
      container: {
        flex: !this.isScrollable ? 1 : undefined,
        ...StyleSheet.flatten(this.props.containerStyle),
      },
      scrollable: {
        flex: 1,
        justifyContent: !this.isScrollable ? 'space-around' : undefined,
      },
    });
  }
}
