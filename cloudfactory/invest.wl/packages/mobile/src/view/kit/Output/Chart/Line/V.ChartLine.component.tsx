import { CompoundUtils } from '@effectivetrade/effective-mobile/src/view/CompoundUtils/Compound.component';
import { DisposableHolder } from '@invest.wl/common';
import { IoC } from '@invest.wl/core';
import { IVChartDataEdge, IVChartDataEdges, IVChartLineDataItem, IVChartLocation, VThemeStore, VThemeStoreTid } from '@invest.wl/view';
import { action, computed, makeObservable, observable, reaction } from 'mobx';
import { observer } from 'mobx-react';
import React from 'react';
import { LayoutChangeEvent, LayoutRectangle, processColor, StyleSheet } from 'react-native';
import { CombinedChart as RNCombinedChart, IChart, IXAxis, IYAxis } from 'react-native-charts-wrapper';
import { colorAlpha, VThemeUtil } from '../../../../Theme/V.Theme.util';
import { VCol } from '../../../Layout';
import { VText } from '../../Text';
import { VChartMobileConfig } from '../V.Chart.config';
import { EVChartChangeAction, IVChartChangeEvent, IVChartSelectEvent } from '../V.Chart.types';
import { IVChartMarkerProps, VChartMarker } from '../V.ChartMarker.component';

import { IChartCombined, IVChartLineProps } from './V.ChartLine.types';

@observer
export class VChartLine extends React.Component<IVChartLineProps> {
  public static actionTransform = [EVChartChangeAction.TransformScale, EVChartChangeAction.TransformTranslate];
  public static height = 300;
  public static Marker = (_: Omit<IVChartMarkerProps, 'location' | 'size'>) => null;

  private theme = IoC.get<VThemeStore>(VThemeStoreTid);

  private _ref = React.createRef<IChartCombined>();
  private _dh = new DisposableHolder();

  @observable public location?: IVChartLocation = undefined;
  @observable public point?: IVChartLineDataItem = undefined;
  @observable public chartSize?: LayoutRectangle = undefined;
  @observable public canvasSize?: LayoutRectangle = undefined;
  @observable public xScale = 1;

  @computed
  private get _data() {
    return this.props.data.lineData?.dataSets[0].values || [];
  }

  @computed
  public get dataEdges(): IVChartDataEdges {
    const x: IVChartDataEdge = { max: 0, min: 0, delta: 0 }; const y: IVChartDataEdge = { max: 0, min: 0, delta: 0 };
    if (this._data.length) {
      const itemFirst = this._data[0];
      const itemLast = this._data[this._data.length - 1];
      const isItemNumber = typeof itemFirst === 'number';
      const xFirst = isItemNumber ? 0 : (itemFirst as IVChartLineDataItem).x;
      const xLast = isItemNumber ? this._data.length - 1 : (itemLast as IVChartLineDataItem).x;
      const yFirst = isItemNumber ? itemFirst as number : (itemFirst as IVChartLineDataItem).y;
      x.min = xFirst, x.max = xLast, y.min = yFirst, y.max = yFirst;
      this._data.forEach((i, _index) => {
        const yv = isItemNumber ? i as number : (i as IVChartLineDataItem).y;
        if (yv < y.min) y.min = yv;
        else if (yv > y.max) y.max = yv;
      });
      x.delta = x.max - x.min;
      y.delta = y.max - y.min;
    }
    return { x, y };
  }

  @computed
  private get _viewPortOffsets() {
    return { ...VChartMobileConfig.layout, ...this.props.layout };
  }

  @computed
  private get _isDataEmpty() {
    return !this._data.length;
  }

  constructor(props: IVChartLineProps) {
    super(props);
    makeObservable(this);
    this._dh.push(reaction(() => this.props.data, () => {
      this.xScale = 1;
    }));
  }

  public componentWillUnmount() {
    this._dh.dispose();
  }

  @action
  public componentDidUpdate(prevProps: IVChartLineProps) {
    const { data } = this.props;
    if (prevProps.data !== data) {
      this.point = undefined;
      this.location = undefined;
      this._ref.current?.fitScreen();
    }
  }

  public render() {
    const theme = this.theme.kit.Chart.Line;
    const { style, noData } = this.props;

    return (
      <VCol flex height={SS.chart.height} style={style}>
        {this._isDataEmpty ? (
          <VCol flex alignItems={'center'} justifyContent={'center'} ma={theme.empty.sMargin?.md}>
            <VText color={VThemeUtil.colorPick(theme.empty.cText)}>{noData}</VText>
          </VCol>
        ) : (
          this._chartRender
        )}
      </VCol>
    );
  }

  @computed
  private get _chartRender() {
    const { data, children } = this.props;

    return (
      <VCol flex>
        <RNCombinedChart ref={this._ref} style={SS.chart}
          data={data} marker={this._chartMarker}
          xAxis={this.axisX} yAxis={this.axisY}

          viewPortOffsets={this._viewPortOffsets}
          drawGridBackground={false} drawBorders={false}
          touchEnabled dragEnabled
          scaleXEnabled scaleYEnabled={false}
          dragDecelerationEnabled={false} doubleTapToZoomEnabled={false}
          legend={VChartMobileConfig.legend}
          visibleRange={VChartMobileConfig.visibleRange}
          chartDescription={VChartMobileConfig.description}

          onSelect={this._handleSelect} onChange={this._onChange}
          onLayout={this._handleChartLayout} />
        <CompoundUtils.Find peers={children} byPeerType={VChartLine.Marker}>{e => !!e && (
          <VChartMarker size={this.canvasSize} location={this.location} {...e.props} />
        )}</CompoundUtils.Find>
      </VCol>
    );
  };

  @action
  private _onChange = (e: IVChartChangeEvent) => {
    const { action, left, right, scaleX } = e.nativeEvent;
    this.xScale = scaleX;
    if (this._markerHas && VChartLine.actionTransform.includes(action)) {
      if (this.point!.x >= left && this.point!.x <= right) {
        const xEdge = this.dataEdges.x;
        const xDelta = right - left;
        const xDeltaReal = xDelta > xEdge.delta ? xEdge.delta : xDelta;
        const xPixelPerUnit = this.chartSize!.width / xDeltaReal;
        const leftReal = left < xEdge.min ? xEdge.min
          : right > xEdge.max ? xEdge.max - xDeltaReal : left;
        this.location!.locationX = (this.point!.x - leftReal) * xPixelPerUnit;

        // график плохо скалируется по Y (autoScaleMinMaxEnabled), topValue меняется, но линия графика остаётся на том-же месте
        // const yDelta = top - bottom;
        // const yPixelPerUnit = this.chartSize!.height / yDelta;
        // this.location!.locationY = (top - this.point!.y) * yPixelPerUnit;
      } else {
        this.point = undefined;
        this.location = undefined;
      }
    }
    this.props.onChange?.(e);
  };

  @computed
  private get _markerHas() {
    return this.location && this.point && this.chartSize;
  }

  @action
  private _handleChartLayout = (event: LayoutChangeEvent) => {
    const layout = event.nativeEvent.layout;
    this.chartSize = layout;
    this.canvasSize = {
      height: layout.height - VChartMobileConfig.dp2px(this._viewPortOffsets.top + this._viewPortOffsets.bottom),
      width: layout.width - VChartMobileConfig.dp2px(this._viewPortOffsets.left + this._viewPortOffsets.right),
      x: layout.x + VChartMobileConfig.dp2px(this._viewPortOffsets.left),
      y: layout.y + VChartMobileConfig.dp2px(this._viewPortOffsets.top),
    };
  };

  @action
  private _handleSelect = (event: IVChartSelectEvent<IVChartLineDataItem>) => {
    const native = event.nativeEvent;
    if (native.data) {
      if (native.locationX != null && native.locationY != null) {
        this.location = {
          locationX: VChartMobileConfig.dp2px(native.locationX),
          locationY: VChartMobileConfig.dp2px(native.locationY),
        };
      }
      this.point = { ...native.data };
      this.props.onSelectPoint?.(this.point);
    } else {
      this.point = undefined;
      this.location = undefined;
    }
  };

  @computed
  private get _chartMarker(): IChart['marker'] {
    return this.props.selectedPoint ? VChartMobileConfig.marker : { enabled: false, markerType: 'custom', longPressDelay: 0.25 };
  }

  @computed
  private get axisX(): IXAxis {
    const theme = this.theme.kit.Chart.Line.x;

    const axisX: IXAxis = {
      enabled: true,
      drawAxisLine: false,
      drawGridLines: false,
      position: 'BOTTOM',
      textColor: processColor(VThemeUtil.colorPick(theme.cText)) as number,
      textSize: theme.fText?.fontSize,
      fontFamily: theme.fText?.fontFamily,
      granularityEnabled: true,
      granularity: 1,
      labelCount: 5,
      drawLimitLinesBehindData: true,
      avoidFirstLastClipping: this.xScale === 1,
    };
    return { ...axisX, ...this.props.axisX };
  }

  @computed
  private get axisY(): { left: IYAxis; right: IYAxis } {
    const theme = this.theme.kit.Chart.Line.y;

    const axisY: IYAxis = {
      labelBgEnabled: !!theme.cBg || !!theme.sPadding || !!theme.sRadius,
      labelBgColor: processColor(VThemeUtil.colorPick(theme.cBg)) as number,
      labelPadding: theme.sPadding?.md,
      labelRadius: theme.sRadius?.md,
      position: 'INSIDE_CHART',
      enabled: true,
      drawAxisLine: false,
      drawGridLines: true,
      gridColor: theme.cBorder ? processColor(colorAlpha(VThemeUtil.colorPick(theme.cBorder)!, 0.6)) as number : undefined,
      gridLineWidth: 1,
      gridDashedLine: {
        lineLength: VChartMobileConfig.px2dp(4),
        spaceLength: VChartMobileConfig.px2dp(4),
      },
      textColor: processColor(VThemeUtil.colorPick(theme.cText)) as number,
      textSize: theme.fText?.fontSize,
      fontFamily: theme.fText?.fontFamily,
      labelCount: 4,
      centerAxisLabels: false,
    };
    return {
      left: { ...axisY, ...this.props.axisY },
      right: { enabled: false },
    };
  }
}

const SS = StyleSheet.create({
  chart: {
    width: '100%',
    height: VChartLine.height,
  },
});
