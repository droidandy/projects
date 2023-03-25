import { IoC } from '@invest.wl/core';
import { IVFlexProps, VRow, VText } from '@invest.wl/mobile';
import { VInstrumentSummaryModel } from '@invest.wl/view/src/Instrument/model/V.InstrumentSummary.model';
import { VThemeStore } from '@invest.wl/view/src/Theme/V.Theme.store';
import { VThemeStoreTid } from '@invest.wl/view/src/Theme/V.Theme.types';
import { computed, makeObservable } from 'mobx';
import { observer } from 'mobx-react';
import React from 'react';
import { StyleSheet } from 'react-native';

export interface IVInstrumentMarketStatProps extends IVFlexProps {
  model: VInstrumentSummaryModel;
}

@observer
export class VInstrumentMarketStat extends React.Component<IVInstrumentMarketStatProps> {
  public static inRowCount = 2;
  private _theme = IoC.get<VThemeStore>(VThemeStoreTid);

  constructor(props: IVInstrumentMarketStatProps) {
    super(props);
    makeObservable(this);
  }

  @computed
  private get _withoutBorderIndex() {
    const len = this.props.model.marketStat.length;
    // если последняя строка полностью заполнена, то тогда без подчеркиваний будет вся строка
    const rowLastCount = len % VInstrumentMarketStat.inRowCount || VInstrumentMarketStat.inRowCount;
    return len - rowLastCount - 1;
  }

  public render() {
    const { color, font } = this._theme;
    const { model, ...flexProps } = this.props;

    return (
      <VRow style={SS.list} {...flexProps}>
        {model.marketStat.map((item, i, arr) => (
          <VRow key={i} style={SS.item} flex pv={'md'} ml={i % VInstrumentMarketStat.inRowCount !== 0 ? 'lg' : undefined}
            justifyContent={'space-between'} alignItems={'center'}
            borderBottomWidth={i > this._withoutBorderIndex ? 0 : 1} borderColor={color.muted2}>
            <VText style={font.body20}>{item.name.toUpperCase()}</VText>
            <VText style={font.body19}>{item.value}</VText>
          </VRow>
        ))}
      </VRow>
    );
  }
}

const SS = StyleSheet.create({
  list: { flexWrap: 'wrap' },
  item: { flexBasis: '40%' },
});
