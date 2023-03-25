import { IAreaPoint, TDDatePeriodUnitBase } from '@invest.wl/core';

export type IVChartPointLocation = IVChartLocation & IVChartLineDataItem;

export const VChartConfigTid = Symbol.for('VChartConfigTid');

export interface IVChartLocation {
  locationX: number;
  locationY: number;
}

export interface IVChartLineDataItem extends IAreaPoint {
  marker?: string;
}

export interface IVChartCandleDataItem {
  x: number;
  low: number;
  high: number;
  shadowH: number;
  shadowL: number;
  open: number;
  close: number;
  volume: number;
}

export type IVChartDataItem = IVChartLineDataItem | IVChartCandleDataItem;

export interface IVChartLayout {
  top: number;
  bottom: number;
  left: number;
  right: number;
}

export interface IVChartConfig {
  linePeriodList: TDDatePeriodUnitBase[];
  candlePeriodList: TDDatePeriodUnitBase[];
}

export interface IVChartDataEdge {
  min: number;
  max: number;
  delta: number;
}

export interface IVChartDataEdges {
  x: IVChartDataEdge;
  y: IVChartDataEdge;
}
