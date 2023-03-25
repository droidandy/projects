import { ISelectItem, TObject } from '@invest.wl/core';
import { LayoutChangeEvent, StyleProp, ViewStyle } from 'react-native';

export type IVSelectData<V> = IVSelectDataItem<V>[];

export type TVSelectValue = Date | number | string | boolean | TObject;

export interface IVSelectDataItem<V extends TVSelectValue | TVSelectValue[] = any> extends ISelectItem<V> {
  hint?: string;
}

export interface IVSelectItemRenderProps<V extends TVSelectValue | TVSelectValue[] = any> {
  onPress(item: IVSelectDataItem<V>): void;
  onLayout?(event: LayoutChangeEvent, index: number): void;
}

export interface IVSelectProps<V extends TVSelectValue | TVSelectValue[]> {
  data: IVSelectData<V>;
  style?: StyleProp<ViewStyle>;
  selected?: V;
  nullable?: string;
  disabled?: boolean;
  scrollable?: boolean;
  onChange(value?: V): void;
}
