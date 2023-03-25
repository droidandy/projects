import React from 'react';
import { LayoutChangeEvent } from 'react-native';
import { observer } from 'mobx-react';
import { IVFlexProps, VCard, VCol, VIcon, VList, VRow, VText, VTouchable } from '@invest.wl/mobile/src/view/kit';
import { IoC } from '@invest.wl/core';
import { VThemeStore } from '@invest.wl/view/src/Theme/V.Theme.store';
import { VThemeStoreTid } from '@invest.wl/view/src/Theme/V.Theme.types';
import { VInstrumentExchangeListModel } from '@invest.wl/view/src/Instrument/model/V.InstrumentExchangeList.model';
import { IVMapX } from '@invest.wl/common/src/reactive/MapX/MapX.types';
import { VInstrumentExchangeItemModel } from '@invest.wl/view/src/Instrument/model/V.InstrumentExchangeItem.model';
import LinearGradient from 'react-native-linear-gradient';
import { colorAlpha, themeStyle } from '@invest.wl/mobile/src/view/Theme';

export interface IVInstrumentExchangeGlassProps {
  listX: IVMapX<VInstrumentExchangeListModel>;
  onPress?(model: VInstrumentExchangeItemModel): void;
  onGetGlassCenter?(position: number): void;
}

@observer
export class VInstrumentExchangeGlass extends React.Component<IVInstrumentExchangeGlassProps> {
  private theme = IoC.get<VThemeStore>(VThemeStoreTid);

  public render() {
    const { listX, onPress } = this.props;
    const { color, space } = this.theme;
    return (
      <VCol>
        <VRow mb={space.lg}>
          <VRow flex justifyContent={'space-between'} pr={space.md}>
            <VText color={color.text} font={'body18'}>Цена</VText>
            <VRow alignItems={'center'}>
              <VIcon name={'arrow-up'} color={color.accent1} />
              <VText font={'body18'} ml={space.sm}>Продать</VText>
            </VRow>
          </VRow>
          <VRow flex justifyContent={'space-between'} pl={space.md}
            borderColor={color.muted2} borderLeftWidth={1}>
            <VRow alignItems={'center'}>
              <VText font={'body18'} mr={space.sm}>Купить</VText>
              <VIcon name={'arrow-down'} color={color.text} />
            </VRow>
            <VText color={color.text} font={'body18'}>Количество</VText>
          </VRow>
        </VRow>
        {listX.model?.bidList.map((item, index) => (
          <VInstrumentExchangeGlassItem key={item.id} model={item} onPress={onPress}
            mt={index ? space.md : undefined} />
        ))}
        <VList.Separator mv={space.md} onLayout={this._onSeparatorLayout} />
        {listX.model?.askList.map((item, index) => (
          <VInstrumentExchangeGlassItem key={item.id} model={item} onPress={onPress}
            mt={index ? space.md : undefined} />
        ))}
      </VCol>
    );
  }

  private _onSeparatorLayout = (e: LayoutChangeEvent) => this.props.onGetGlassCenter?.(e.nativeEvent.layout.y);
}

interface IVInstrumentExchangeGlassItemProps extends IVFlexProps {
  model: VInstrumentExchangeItemModel;
  onPress?(model: VInstrumentExchangeItemModel): void;
}

@observer
export class VInstrumentExchangeGlassItem extends React.Component<IVInstrumentExchangeGlassItemProps> {
  private static _gradientStart = { x: 0, y: 0 };
  private static _gradientEnd = { x: 0.95, y: 0 };
  private theme = IoC.get<VThemeStore>(VThemeStoreTid);

  public render() {
    const { model, onPress, ...flexProps } = this.props;
    const { space, color, kit } = this.theme;
    return (
      <VTouchable.Opacity context={model} onPress={onPress}>
        <VCard pa={space.lg} {...flexProps}>
          <VRow absoluteFill radius={kit.Card.sRadius?.md} overflow={'hidden'}>
            <VCol width={(100 - model.domain.volumePercent) + '%'} />
            <VCol width={3} bg={model.color} />
            <LinearGradient style={themeStyle.flex1} colors={[colorAlpha(model.color, 0.1), color.base]}
              start={VInstrumentExchangeGlassItem._gradientStart} end={VInstrumentExchangeGlassItem._gradientEnd}>
              <VRow flex />
            </LinearGradient>
          </VRow>
          <VRow key={model.id} justifyContent={'space-between'}>
            <VText>{model.price}</VText>
            <VText>{model.volume}</VText>
          </VRow>
        </VCard>
      </VTouchable.Opacity>
    );
  }
}
