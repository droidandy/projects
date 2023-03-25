import { IoC } from '@invest.wl/core';
import { VThemeStore, VThemeStoreTid } from '@invest.wl/view';
import { useIsFocused } from '@react-navigation/native';
import React from 'react';
import { StatusBar, StatusBarProps } from 'react-native';
import { VThemeUtil } from '../../../Theme/V.Theme.util';
import { IVFlexProps, VCol } from '../Flex';

export interface IVStatusBarProps extends StatusBarProps, Pick<IVFlexProps, 'bg'> {
}

// https://reactnavigation.org/docs/status-bar/#tabs-and-drawer
export function VStatusBar(props: IVStatusBarProps) {
  const theme = IoC.get<VThemeStore>(VThemeStoreTid).kit.StatusBar;
  const isFocused = useIsFocused();
  const bgColor = props.bg ? props.bg : VThemeUtil.colorPick(theme.cBg);

  return isFocused ? (
    <>
      <VCol absolute top left right height={theme.sHeight?.md! * 2} bg={bgColor} />
      <StatusBar backgroundColor={bgColor} barStyle={theme.barStyle} {...props} />
    </>
  ) : null;
}
