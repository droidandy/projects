import React from 'react';
import { observer } from 'mobx-react';
import { VInstrumentMarketHistoryModel } from '@invest.wl/view/src/Instrument/model/V.InstrumentMarketHistory.model';
import { action, computed, makeObservable } from 'mobx';
import { Platform, processColor } from 'react-native';
import { ICombinedData, IXAxis, IYAxis } from 'react-native-charts-wrapper';
import { IoC } from '@invest.wl/core/src/di/IoC';
import { VThemeStoreTid } from '@invest.wl/view/src/Theme/V.Theme.types';
import { VThemeStore } from '@invest.wl/view/src/Theme/V.Theme.store';
import { VChartLine, VChartMobileConfig } from '@invest.wl/mobile/src/view/kit';
import { isDeviceNarrow, VThemeUtil } from '@invest.wl/mobile/src/view/Theme';
import moment from 'moment';
import { IVChartLineDataItem } from '@invest.wl/view/src/Chart/V.Chart.types';
import { Formatter } from '@invest.wl/common/src/util/formatter.util';

export interface IVInstrumentChartLineProps {
  model: VInstrumentMarketHistoryModel;
}

@observer
export class VInstrumentChartLine extends React.Component<IVInstrumentChartLineProps> {
  private theme = IoC.get<VThemeStore>(VThemeStoreTid);

  @computed
  private get _labelIsLong() {
    const { lineData } = this.props.model;
    const startYear = new Date(lineData[0].x).getFullYear();
    const endYear = new Date(lineData[lineData.length - 1].x).getFullYear();
    return startYear !== endYear;
  }

  constructor(props: IVInstrumentChartLineProps) {
    super(props);
    makeObservable(this);
  }

  @computed
  public get data(): ICombinedData {
    const color = [processColor('rgba(136, 185, 242, 0.02)'), processColor('rgba(136, 185, 242, 0.2)')];

    return {
      lineData: {
        dataSets: [
          {
            values: this.lineData,
            label: '',
            config: {
              ...VChartMobileConfig.lineConfigBase,
              mode: 'CUBIC_BEZIER',
              drawCubicIntensity: 0.1,
              color: processColor(this.theme.color.primary3) as number,
              drawFilled: true,
              fillGradient: {
                colors: color as number[],
                positions: [0, 0.5],
                angle: 90,
                orientation: 'BOTTOM_TOP',
              },
              fillAlpha: 1000,
            },
          },
        ],
      },
    };
  }

  @computed
  public get xLabelList() {
    const { lineData } = this.props.model;
    const pattern = 'D MMM' + (this._labelIsLong ? ' YY' : '');
    return lineData.map((i, index) => moment(i.x).format(pattern));
  }

  @computed
  public get lineData(): IVChartLineDataItem[] {
    return this.props.model.lineData.map((i, index) => ({ ...i, x: index }));
  }

  public render() {
    const { model } = this.props;
    return (
      <VChartLine data={this.data}
        axisX={this._axisX} axisY={this._axisY}
        selectedPoint={model.pointSelected} onSelectPoint={this._onSelect}
        noData={'Нет данных за выбранный период'}>
        <VChartLine.Marker pointX={model.pointX} pointY={model.pointY} />
      </VChartLine>
    );
  }

  @computed
  private get _axisX(): Partial<IXAxis> {
    return {
      valueFormatter: this.xLabelList,
      labelCount: this._labelIsLong ? (isDeviceNarrow ? 2 : 3) : (isDeviceNarrow ? 3 : 4),
      textColor: processColor(VThemeUtil.colorPick(this.theme.color.text)) as number,
    };
  }

  @computed
  private get _axisY(): Partial<IYAxis> {
    const model = this.props.model;
    const priceStep = model.instrumentInfo.symbol === '%' ? 0.01 : model.domain.priceStep;
    const formatter = `###,###,###.${new Array(Formatter.priceStepMorph(priceStep)).fill('0').join('')} '${model.instrumentInfo.symbol}'`;
    return {
      valueFormatter: Platform.OS === 'android' ? `${formatter};-${formatter}` : formatter,
      textColor: processColor(VThemeUtil.colorPick(this.theme.color.text)) as number,
    };
  }

  @action
  private _onSelect = (item: IVChartLineDataItem) => {
    const { lineData, pointSelect } = this.props.model;
    pointSelect(lineData[item.x]);
  };
}
