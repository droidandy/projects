import { LayoutRectangle } from 'react-native';
import styled from 'styled-components/native';

import { ChartModeSwitcher as ChartModeSwitcherComponent } from './chartModeSwitcher';
import { FullscreenSwitcher as FullscreenSwitcherComponent } from './fullscreenSwitcher';
import { OverlaySwitcher as OverlaySwitcherComponent } from './overlaySwitcher';
import { Price as PriceComponent } from './price';

export const Wrapper = styled.View<{ fullscreen: boolean }>`
  position: relative;
  width: 100%;
  height: 100%;
  background-color: ${({ fullscreen }) => (fullscreen ? 'transparent' : 'white')};
  overflow: hidden;
  border-radius: 10px;
`;

export const ChatOverlayWrapper = styled.View<{ sizes: LayoutRectangle }>`
  position: absolute;
  height: ${({ sizes }): number => sizes.height}px;
  width: ${({ sizes }): number => sizes.width}px;
`;

export const OverlaySwitcher = styled(OverlaySwitcherComponent)`
  position: absolute;
  bottom: 0;
  left: 14px;
`;

export const ChartModeSwitcher = styled(ChartModeSwitcherComponent)`
  position: absolute;
  bottom: 0;
  right: 38px;
`;

export const FullscreenSwitcher = styled(FullscreenSwitcherComponent)`
  position: absolute;
  bottom: 0;
  right: 14px;
`;

export const Price = styled(PriceComponent)`
  position: absolute;
  top: 9px;
  left: 11px;
`;

export const ChartBackdrop = styled.View<{ height: number; width: number }>`
  position: absolute;
  left: 0;
  top: 0;
  background-color: #E2E8F0;
  flex: 1;
  height: ${({ height }): number => height}px;
  width: ${({ width }): number => width}px;
`;
