import { IVChartLayout, IVChartLineDataItem } from '@invest.wl/view';
import { StyleProp, ViewStyle } from 'react-native';
import { CombinedChart, ICombinedData, IXAxis, IYAxis } from 'react-native-charts-wrapper';
import { IVChartChangeEvent } from '../V.Chart.types';

interface StyleProps {
  style?: StyleProp<ViewStyle>;
}

export interface IVChartLineProps extends StyleProps {
  data: ICombinedData;
  selectedPoint?: IVChartLineDataItem;
  axisX?: Partial<IXAxis>;
  axisY?: Partial<IYAxis>;
  noData?: string;
  layout?: Partial<IVChartLayout>;

  onChange?(event?: IVChartChangeEvent): void;
  onTouchMove?(e: any): void;
  onTouchStart?(e: any): void;
  onTouchEnd?(e: any): void;
  onSelectPoint?(point: IVChartLineDataItem): void;
}

export interface IChartCombined extends CombinedChart {
  // reset zoom
  fitScreen(): void;
}
