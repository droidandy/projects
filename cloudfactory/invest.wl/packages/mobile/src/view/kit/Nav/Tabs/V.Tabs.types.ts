import { EVRouterScreen, TVIconName } from '@invest.wl/view';
import { BottomTabBarProps } from '@react-navigation/bottom-tabs';
import { MaterialTopTabBarProps } from '@react-navigation/material-top-tabs';
import * as React from 'react';
import { IVFlexProps } from '../../Layout/Flex';

export interface IVTabsRouteItem<P = any> {
  name: EVRouterScreen;
  title?: string;
  icon?: TVIconName;
  screen: React.ComponentType<any>;
  props?: P;
  disabled?: boolean;
  replaceRouteName?: EVRouterScreen;
  readonly isActive?: boolean;
}

export interface IVTabsProps extends IVFlexProps {
  routes: IVTabsRouteItem[];
  initialRouteName?: EVRouterScreen;
  itemWidthMin?: number;
  onBlur?(): void;
  onChange?(route: EVRouterScreen): void;
  itemRender?(item: IVTabsRouteItem): React.ReactElement;
}

export interface IVTabsHeaderProps extends MaterialTopTabBarProps, IVTabsProps {
}

export interface IVTabsFooterProps extends BottomTabBarProps, Omit<IVTabsProps, 'style'> {
}
