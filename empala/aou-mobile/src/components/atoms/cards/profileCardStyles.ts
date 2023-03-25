import FastImage from 'react-native-fast-image';
import styled, { css } from 'styled-components/native';

import { ProfileCardTypes } from './types';

export const Container = styled.TouchableOpacity<{ type?: string; }>`
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  border-radius: 16px;
  background: ${({ theme }) => theme.colors.White};
  overflow: hidden;

  ${({ type }) => type === ProfileCardTypes.Hunch
    && css`
      width: 162px;
      height: 144px;
      padding: 10px 9px 11px 10px;
    `}
  ${({ type }) => type === ProfileCardTypes.Investack
    && css`
      width: 104px;
      height: 155px;
      padding: 7px 6px 12px 8px;
    `}
`;

export const Content = styled.View`
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
  width: 100%;
`;

export const Avatar = styled(FastImage)`
  width: 24px;
  height: 24px;
  border-radius: 24px;
  overflow: hidden;
  background-color: ${({ theme }) => theme.colors.Grey600};
`;

export const Percent = styled.Text<{ trend: string; }>`
  margin-left: 7px;
  font-family: 'Inter_400Regular';
  font-style: normal;
  font-weight: normal;
  font-size: 11px;
  line-height: 14px;
  color: ${({ trend, theme }) => ({
    minus: theme.colors.Grey400,
    upLine: theme.colors.Green200,
    downLine: theme.colors.Red,
  }[trend] || theme.colors.Grey400)};
`;

export const Symbol = styled.Text`
  font-family: 'Inter_700Bold';
  font-style: normal;
  font-weight: normal;
  font-size: 16px;
  line-height: 22px;
  color: ${({ theme }) => theme.formatterColor.Dark660};
`;

export const Row = styled.View`
  flex-direction: row;
`;

export const Column = styled.View`
  flex-direction: column;
`;

export const Price = styled.Text`
  font-family: 'Inter_700Bold';
  font-style: normal;
  font-weight: normal;
  font-size: 16px;
  line-height: 22px;
  color: ${({ theme }) => theme.colors.Grey800};
`;

export const Date = styled.Text`
  font-family: 'Inter_400Regular';
  font-style: normal;
  font-weight: normal;
  font-size: 11px;
  line-height: 15px;
  color: ${({ theme }) => theme.colors.Grey400};
`;
export const Counter = styled.View`
  background-color: ${({ theme }) => theme.colors.Grey600};
  border-radius: 20px;
  padding: 4px;
  margin-right: 6px;
  min-width: 20px;
  min-height: 20px;
  display: flex;
  align-items: center;
  justify-content: center;
`;

export const Count = styled.Text`
  font-family: 'Inter_800ExtraBold';
  font-style: normal;
  font-weight: normal;
  font-size: 11px;
  line-height: 11px;
  color: ${({ theme }) => theme.colors.White};
`;

export const Footer = styled.View`
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
`;
