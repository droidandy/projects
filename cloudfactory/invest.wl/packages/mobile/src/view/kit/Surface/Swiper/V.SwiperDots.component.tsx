import { makeArrayWithNumbers } from '@invest.wl/common';
import { IoC } from '@invest.wl/core';
import { TVThemeColorValue, VThemeStore, VThemeStoreTid } from '@invest.wl/view';
import { computed, makeObservable } from 'mobx';
import { observer } from 'mobx-react';
import * as React from 'react';
import { VThemeUtil } from '../../../Theme/V.Theme.util';
import { IVFlexProps, VCol, VRow } from '../../Layout/Flex';
import { IVSwiperBarPropsBase } from './V.Swiper.types';

interface Props extends IVSwiperBarPropsBase, IVFlexProps {
  colorActive?: TVThemeColorValue;
}

@observer
export class VSwiperDots extends React.Component<Props> {
  public static defaultProps = {
    pageSize: 6,
  };

  private theme = IoC.get<VThemeStore>(VThemeStoreTid);

  constructor(props: Props) {
    super(props);
    makeObservable(this);
  }

  @computed
  private get _pageCurrent() {
    return Math.floor(this.props.activeIndex / this.props.pageSize);
  }

  @computed
  private get _pageTotal() {
    return Math.ceil(this.props.itemsCount / this.props.pageSize);
  }

  @computed
  private get _itemsArray() {
    const { itemsCount, pageSize } = this.props;
    return makeArrayWithNumbers(itemsCount).slice(this._pageCurrent * pageSize, (this._pageCurrent + 1) * pageSize);
  }

  public render() {
    const { activeIndex, itemsCount, pageSize, colorActive, ...props } = this.props;
    const { cInactive, cActive, sWidth, sMargin } = this.theme.kit.Swiper.dot;
    const diameter = sWidth?.md || 0;

    return (
      <VRow {...props}>
        {!!this._pageCurrent && this._pageDots()}
        {this._itemsArray.map((n, index) => (
          <VCol key={index} width={diameter} height={diameter} radius={diameter / 2}
            bg={VThemeUtil.colorPick(n === activeIndex ? (colorActive || cActive) : cInactive)} mh={sMargin?.md} />
        ))}
        {this._pageCurrent !== this._pageTotal - 1 && this._pageDots()}
      </VRow>
    );
  }

  private _pageDots = () => {
    const { cInactive, sWidth, sMargin } = this.theme.kit.Swiper.dot;
    const diameter = (sWidth?.md || 0) * 0.6;
    return (
      <VCol width={diameter} height={diameter} radius={diameter / 2}
        bg={VThemeUtil.colorPick(cInactive)} mh={sMargin?.md} alignSelf={'center'} />
    );
  };
}
