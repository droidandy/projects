import { TVThemeColorValue, TVThemeSizeBase } from '@invest.wl/view';
import * as React from 'react';
import { IVFlexProps } from '../../Layout';

export interface IVButtonModelProps<C = any> {
  processing?: boolean;
  disabled?: boolean;
  // Если true - кнопка выглядит как в нормальном состоянии, но не нажимается
  pressable?: boolean;
  context?: C;
  onPress?(context: C): void;
}

export type TVButtonSizeName = TVThemeSizeBase;

export enum EVButtonState {
  Normal = 'Normal',
  Press = 'Press',
  Disabled = 'Disabled',
  Processing = 'Processing',
}

export interface IVButtonProps<T = any> extends Omit<IVFlexProps, 'circle'>, IVButtonModelProps<T> {
  size?: TVButtonSizeName;
  color?: TVThemeColorValue;
  colorText?: TVThemeColorValue;
  coloring?: IVButtonColoring;
  circle?: number | true;
  children: string | React.ReactNode;
}

export interface IVButtonColor {
  border?: TVThemeColorValue;
  bg?: TVThemeColorValue;
  text?: TVThemeColorValue;
}

// true = главный цвет | false = второстепенный
interface IVButtonColoring {
  border?: boolean;
  bg?: boolean;
  text?: boolean;
}
