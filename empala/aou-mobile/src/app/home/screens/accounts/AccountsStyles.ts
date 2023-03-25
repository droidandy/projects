import { SafeAreaView } from 'react-native-safe-area-context';
import styled from 'styled-components/native';

export const SafeArea = styled(SafeAreaView)`
  flex: 1;
  padding: 36px;
  justify-content: center;
`;

export const Container = styled.View`
  flex: 1;
  justify-content: center;
`;

export const Title = styled.Text`
  font-family: 'Inter_900Black';
  font-size: 36px;
  line-height: 48px;
  text-align: center;
`;

export const SubTitle = styled.Text`
  font-family: 'Inter_400Regular';
  font-size: 16px;
  line-height: 24px;
  padding-top: 20px;
  text-align: center;
`;
