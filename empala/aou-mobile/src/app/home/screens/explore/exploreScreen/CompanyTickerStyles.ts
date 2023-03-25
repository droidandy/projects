import styled from 'styled-components/native';
import FastImage from "react-native-fast-image";

export const Container = styled.TouchableOpacity`
  margin: 2px 16px;
  padding: 0 8px;
  height: 52px;
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: space-around;
  background-color: ${({ theme }) => theme.colors.White};
  border-radius: 8px;
`;

export const Trend = styled.View`
  display: flex;
  align-items: center;
  justify-content: center;
`;

export const Name = styled.Text`
  margin-left: 13px;
  font-family: 'Inter_700Bold';
  font-style: normal;
  font-weight: normal;
  font-size: 14px;
  color: ${({ theme }) => theme.colors.Black};
  opacity: 0.8;
  flex: 1;
`;

export const Symbol = styled.Text`
  font-family: 'Inter_700Bold';
  font-style: normal;
  font-weight: normal;
  font-size: 14px;
  margin: 0 9px 0 4px;
  color: ${({ theme }) => theme.colors.Grey400};
`;

export const Price = styled.Text`
  margin-left: 7px;
  font-family: 'Inter_700Bold';
  font-style: normal;
  font-weight: normal;
  font-size: 14px;
  color: ${({ theme }) => theme.colors.Green200};
`;

export const Left = styled.View`
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: center;
  flex-wrap: wrap;
  flex: 1;
`;

export const Right = styled.View`
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: center;
`;

export const Avatar = styled(FastImage)`
  width: 24px;
  height: 24px;
  border-radius: 24px;
  overflow: hidden;
  background-color: ${({ theme }) => theme.colors.Grey600};
`;
