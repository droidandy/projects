import { StyleProp, ViewStyle } from 'react-native';
import styled from 'styled-components/native';

import FilterArrow from '~/assets/icons/lib/filterArrow';

export const Wrapper = styled.View`
  width: 100%;
  background-color: ${({ theme }): string => theme.colors.Grey300};
  border-radius: 8px;
  padding: 11px;
  
  flex-direction: row;
  justify-content: space-between;
`;

export const Filters = styled.View<{ justify?: string }>`
  flex-direction: row;
  justify-content: ${({ justify }): string => (justify ?? 'space-around')};
  flex: 1;
`;

export const Filter = styled.TouchableOpacity`
  flex-direction: row;
  align-items: center;
  margin-left: 5px;
`;

export const FilterLabelWrapper = styled.View`
  justify-content: center;
  align-items: center;
  margin-right: 4px;
`;

export const FilterLabel = styled.Text`
  font-weight: 500;
  font-size: 14px;
  line-height: 24px;
  color: ${({ theme }): string => theme.colors.GreyDarkest};
`;

export const FilterLabelUnderline = styled.View`
  width: 100%;
  height: 1px;
  background-color: ${({ theme }): string => theme.colors.GreyDarkest};
  margin-top: -2px;
`;

export const FilterArrowIconWrapper = styled.View<{ hidden: boolean }>`
  opacity: ${({ hidden }): number => (hidden ? 0 : 1)};
  margin-top: 4px;
`;

export const FilterArrowIcon = styled(FilterArrow)<{ style: StyleProp<ViewStyle> }>`
  height: 16px;
  width: 16px;
`;
