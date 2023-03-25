import styled from 'styled-components/native';

import { Orientation } from '~/hooks/useOrientation';

export const Wrapper = styled.View<{ height?: number; orientation: Orientation }>`
  flex-direction: row;
  flex: 1;
  align-items: center;
  justify-content: center;;
  height: ${({ height }): string => (height ? `${height}px` : 'auto')};
  padding-top: 5px;
  margin-bottom: 5px;
  background-color: ${({ orientation }): string => (orientation === Orientation.horizontal ? 'white' : 'transparent')};
  border-radius: ${({ orientation }): string => (orientation === Orientation.horizontal ? '15px' : '0')};
`;

export const Selector = styled.TouchableOpacity`
  justify-content: space-between;
  height: 100%;
`;

export const Label = styled.Text<{ selected: boolean; highlight: boolean; }>`
  font-weight: ${({ selected }): string => (selected ? '700' : '400')};
  color: ${({ selected, highlight }): string => (selected || highlight ? '#475569' : '#8B9195')};
  font-size: 16px;
  padding: 10px;
`;

export const UnderlineWrapper = styled.View`
  width: 100%;
  height: 4px;
  justify-content: flex-end;
  margin-top: -4px;
`;

export const Underline = styled.View<{ selected: boolean }>`
  width: 100%;
  height: ${({ selected }): number => (selected ? 4 : 1)}px;
  background-color: #475569;
`;
