import React from 'react';
import { observer } from 'mobx-react';
import { VInstrumentSummaryModel } from '@invest.wl/view/src/Instrument/model/V.InstrumentSummary.model';
import { IVFlexProps, VCol, VFormat, VIcon, VRow, VText, VTouchable } from '@invest.wl/mobile/src/view/kit';
import { VInstrumentIdentity } from './V.InstrumentIdentity.component';
import { IoC } from '@invest.wl/core/src/di/IoC';
import { VThemeStoreTid } from '@invest.wl/view/src/Theme/V.Theme.types';
import { VThemeStore } from '@invest.wl/view/src/Theme/V.Theme.store';
import { EVLayoutScreen } from '@invest.wl/view/src/Layout/V.Layout.types';
import { IVRouterService, VRouterServiceTid } from '@invest.wl/view/src/Router/V.Router.types';
import { EVOrderScreen } from '@invest.wl/view/src/Order/V.Order.types';

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

  public render() {
    const { model, alertHas, orderHas, ...flexProps } = this.props;
    const { identity, info, date } = model;
    const { color, space, font } = this._theme;

    return (
      <VCol {...flexProps}>
        <VRow justifyContent={'space-between'} alignItems={'center'}>
          <VInstrumentIdentity flex mpart={identity} mr={space.md} />
          <VCol>
            <VTouchable.Opacity row alignItems={'center'} borderWidth={1} borderColor={color.primary2} radius={100}
              ph={space.md + space.sm} pv={space.sm} onPress={this._onPressOperation}>
              <VIcon name={'operations'} fontSize={26} color={color.primary1} />
              <VText style={font.body13} color={color.primary1}>Операции</VText>
            </VTouchable.Opacity>
          </VCol>
        </VRow>
        {!info.isBond && (
          <VCol mt={space.lg} justifyContent={'space-between'}>
            <VFormat.Number size={'lg'}>{info.midRate}</VFormat.Number>
            <VText>
              <VText style={font.body18} color={info.changeColor}>
                {`${info.changePoint} / ${info.change} `}
              </VText>
              <VText font={'body20'}>
                {date}
              </VText>
            </VText>
          </VCol>
        )}
        {info.isBond && (
          <VRow mt={space.lg} justifyContent={'space-between'}>
            <VCol>
              <VRow alignItems={'center'}>
                <VFormat.Number size={'lg'}>{info.midRate}</VFormat.Number>
                {/* <VText ml={space.md} style={font.body20}>{model.notional}</VText> */}
              </VRow>
              <VRow mt={space.sm}>
                <VText font={'caption2'} color={color.muted4}>ЦЕНА <VText
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
