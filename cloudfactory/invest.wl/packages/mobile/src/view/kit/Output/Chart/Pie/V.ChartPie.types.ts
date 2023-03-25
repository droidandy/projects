export interface IVChartPieItem {
  value: number;
  label?: string;
}

export interface IVChartPieEventSelect extends IVChartPieItem {
  data: IVChartPieItem;
}
