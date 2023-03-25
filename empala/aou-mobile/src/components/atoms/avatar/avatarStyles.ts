import FastImage from 'react-native-fast-image';
import styled from 'styled-components/native';

export const Container = styled.TouchableOpacity`
  width: 64px;
  height: 84px;
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: hidden;
`;

export const Avatar = styled(FastImage)`
  width: 64px;
  height: 64px;
  border-radius: 32px;
  overflow: hidden;
  background-color: ${({ theme }) => theme.colors.Grey600};
`;

export const Name = styled.Text`
  color: ${({ theme }) => theme.colors.Grey400};
  margin: 8px 0 0 0;
  text-align: center;
  font-size: 12px;
  font-weight: 400;
`;
