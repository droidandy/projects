import { IVChartLocation } from '@invest.wl/view';

export interface IVChartSelectEvent<T extends Record<string, any>> {
  nativeEvent: IVChartSelectEventNative<T>;
}

export interface IVChartSelectEventNative<T> extends IVChartLocation {
  data: T;
}

export enum EVChartMarkerPosition {
  Horizontal,
  Top
}

export enum EVChartChangeAction {
  TransformScale = 'chartScaled',
  TransformTranslate = 'chartTranslated',
  GestureStart = 'chartGestureStart',
  GestureEnd = 'chartGestureEnd',
  TapSingle = 'chartSingleTap',
  TapDouble = 'doubleTapped',
  TapLong = 'chartLongPress',
}

export interface IVChartChangeEvent {
  nativeEvent: {
    right: number;
    bottom: number;
    centerY: number;
    centerX: number;
    scaleY: number;
    top: number;
    left: number;
    scaleX: number;
    action: EVChartChangeAction;
  };
}
