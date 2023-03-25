import FastImage from 'react-native-fast-image';
import styled from 'styled-components/native';

export const Container = styled.View`
  width: 100%;
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: flex-start;
  border-radius: 16px;
  background-color: ${({ theme }) => theme.colors.White};
  overflow: hidden;
  padding: 10px;
`;

export const Header = styled.View`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  padding: 0 7px 7px 10px;
`;

export const Names = styled.View`
  display: flex;
  flex-direction: row;
  align-items: center;
  padding: 0 7px 5px 10px;
`;

export const LatestTime = styled.Text`
  font-family: 'Inter_400Regular';
  font-style: normal;
  font-weight: normal;
  font-size: 11px;
  color: ${({ theme }) => theme.colors.Grey800};
`;

export const Type = styled.Text`
  font-family: 'Inter_400Regular';
  font-style: normal;
  font-weight: normal;
  font-size: 11px;
  color: ${({ theme }) => theme.colors.Grey600};
`;

export const UserName = styled.Text`
  font-family: 'Inter_700Bold';
  font-style: normal;
  font-weight: bold;
  font-size: 14px;
  color: ${({ theme }) => theme.colors.Grey800};
`;

export const FullName = styled.Text`
  margin-left: 7px;
  font-family: 'Inter_400Regular';
  font-style: normal;
  font-weight: normal;
  font-size: 11px;
  color: ${({ theme }) => theme.colors.Grey800};
  opacity: 0.5;
`;

export const Description = styled.Text`
  font-family: 'Inter_500Medium';
  font-style: normal;
  font-weight: 500;
  font-size: 14px;
  color: ${({ theme }) => theme.colors.Grey800};
`;

export const Action = styled.TouchableOpacity`
  justify-content: center;
  align-items: center;
  width: 40px;
  height: 40px;
  border-radius: 20px;
  background-color: ${({ theme }) => theme.formatterColor.Light200};
`;

export const Avatar = styled(FastImage)`
  width: 42px;
  height: 42px;
  border-radius: 21px;
  overflow: hidden;
  background-color: ${({ theme }) => theme.colors.White};
`;

export const Block = styled.View`
  flex: 1;
  padding: 0 1px 7px 3px;
`;
