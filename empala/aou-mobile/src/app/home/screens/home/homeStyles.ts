import { LinearGradient } from 'expo-linear-gradient';
import { SafeAreaView } from 'react-native-safe-area-context';
import styled from 'styled-components/native';

export const SafeArea = styled(SafeAreaView)`
 flex: 1;
`;

export const Container = styled.ScrollView``;

export const ContainerCard = styled.View`
    margin: 20px 16px 40px 16px;
`;

export const GradientLayer = styled(LinearGradient).attrs(({ theme }) => ({
  start: { x: 0.8, y: 0 },
  end: { x: 0.3, y: 1 },
  colors: [theme.colors.Green200, theme.colors.Greenish],
}))`
  flex: 1;
  background-color: transparent;
`;

export const Scroll = styled.FlatList.attrs(() => ({
  contentContainerStyle: {
    marginHorizontal: 10,
    justifyContent: 'center',
    alignItems: 'flex-start',
  },
}))`
  width: 100%;
`;

export const Divider = styled.View`
  height: 100%;
  width: 14px;
`;

export const ChartWrapper = styled.View`
  padding: 0 10px 10px;
  width: 100%;
  height: 350px;
`;
