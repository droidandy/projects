import FastImage from 'react-native-fast-image';
import styled from 'styled-components/native';

export const Container = styled.TouchableOpacity`
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  border-radius: 16px;
  background: ${({ theme }) => theme.colors.White};
  overflow: hidden;
  width: 96px;
  height: 96px;
  padding: 7px 6px 12px 8px;
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
  font-size: 14px;
  color: ${({ theme }) => theme.formatterColor.Dark800};
`;

export const Row = styled.View`
  flex-direction: row;
`;
