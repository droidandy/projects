import React from 'react';
import { observer } from 'mobx-react';
import { VInstrumentSummaryModel } from '@invest.wl/view/src/Instrument/model/V.InstrumentSummary.model';
import { IVFlexProps, VButton, VCol, VFormat, VIcon, VRow, VText } from '@invest.wl/mobile/src/view/kit';
import { VInstrumentIdentity } from './V.InstrumentIdentity.component';
import { IoC } from '@invest.wl/core/src/di/IoC';
import { VThemeStoreTid } from '@invest.wl/view/src/Theme/V.Theme.types';
import { VThemeStore } from '@invest.wl/view/src/Theme/V.Theme.store';
import { computed, makeObservable } from 'mobx';
import { TVIconName } from '@invest.wl/view/src/Icon/V.Icon.types';
import { EVLayoutScreen } from '@invest.wl/view/src/Layout/V.Layout.types';
import { IVRouterService, VRouterServiceTid } from '@invest.wl/view/src/Router/V.Router.types';
import { EVOrderScreen } from '@invest.wl/view/src/Order/V.Order.types';

interface IInstrumentSummaryIconItem {
  icon: TVIconName;
  isActive: boolean;
  onPress?(): void;
}

export interface IVInstrumentSummaryProps extends IVFlexProps {
  model: VInstrumentSummaryModel;
  alertHas?: boolean;
  orderHas?: boolean;
  onPressFavorite(): void;
  onPressAlert?(): void;
}

@observer
export class VInstrumentSummary extends React.Component<IVInstrumentSummaryProps> {
  private _theme = IoC.get<VThemeStore>(VThemeStoreTid);
  private _router = IoC.get<IVRouterService>(VRouterServiceTid);

  constructor(props: IVInstrumentSummaryProps) {
    super(props);
    makeObservable(this);
  }

  @computed
  private get iconList(): IInstrumentSummaryIconItem[] {
    const { model, orderHas, alertHas, onPressFavorite, onPressAlert } = this.props;
    return [
      { icon: 'operations', isActive: !!orderHas, onPress: this._onPressOperation },
      { icon: 'notification', isActive: !!alertHas, onPress: onPressAlert },
      { icon: 'favorites', isActive: model.domain.isFavorite, onPress: onPressFavorite },
    ];
  }

  public render() {
    const { model, alertHas, orderHas, ...flexProps } = this.props;
    const { identity, info, date } = model;
    const { color, space, font } = this._theme;

    return (
      <VCol {...flexProps}>
        <VRow justifyContent={'space-between'}>
          <VInstrumentIdentity flex mpart={identity} mr={space.md} />
          <VRow alignItems={'center'} justifyContent={'flex-end'}>
            {this.iconList.map((i, index) => (
              <VButton.Stroke key={i.icon} ml={index ? space.md : undefined} height={36} width={36}
                coloring={{ border: true, text: !i.isActive, bg: i.isActive }}
                color={i.isActive ? color.accent1 : color.muted3} onPress={i.onPress}>
                <VIcon name={i.icon} fontSize={24} />
              </VButton.Stroke>
            ))}
          </VRow>
        </VRow>
        {!info.isBond && (
          <VCol mt={space.lg}>
            <VFormat.Number size={'lg'}>{info.midRate}</VFormat.Number>
            <VRow alignItems={'center'} alignContent={'center'}>
              <VText font={'body18'} color={info.changeColor}>{`${info.changePoint} (${info.change})`}</VText>
              <VText font={'body20'} color={color.muted3}>{` ${date}`}</VText>
            </VRow>
          </VCol>
        )}
        {info.isBond && (
          <VRow mt={space.lg} justifyContent={'space-between'}>
            <VCol>
              <VRow alignItems={'center'}>
                <VFormat.Number size={'lg'}>{info.midRate}</VFormat.Number>
                {/*<VText ml={space.md} style={font.body20}>{model.notional}</VText>*/}
              </VRow>
              <VRow mt={space.sm}>
                <VText font={'caption2'} color={color.text}>ЦЕНА <VText
                  pl={space.sm} font={'body20'} color={color.primary2}>{info.midRatePercent}</VText> / <VText
                  style={font.body20} color={info.changeColor}>{info.change}</VText>
                </VText>
              </VRow>
              {/* <VText mt={space.xs} style={font.body20} color={color.text}>Дата погашения: <VText */}
              {/*   color={color.text}>{model.maturity}</VText> */}
              {/* </VText> */}
            </VCol>
            <VCol justifyContent={'space-between'} alignItems={'center'}>
              <VText ml={space.sm} style={font.body20} color={color.text}>{date}</VText>
              <VRow ph={space.lg} pv={space.xs} justifyContent={'center'} alignItems={'center'}
                radius={10} borderWidth={1} borderColor={color.accent1}>
                <VText style={font.body20} color={color.accent1}>{`НКД ${model.NKD}`}</VText>
              </VRow>
            </VCol>
          </VRow>
        )}
      </VCol>
    );
  }

  private _onPressOperation = () => {
    this._router.push(EVLayoutScreen.LayoutOperationTabs, {
      screen: EVOrderScreen.OrderList,
      params: { instrumentId: this.props.model.domain.dto.Instrument.id.id },
    });
  };
}
