import { LinearGradient } from 'expo-linear-gradient';
import { SafeAreaView } from 'react-native-safe-area-context'
import { LinearGradientProps } from 'react-native-svg';
import styled from 'styled-components/native';

export const SafeArea = styled(SafeAreaView)`
 flex: 1;
`;

export const GradientLayer = styled(LinearGradient).attrs(({ theme }) => ({
  start: { x: 0.8, y: 0 },
  end: { x: 0.3, y: 1 },
  colors: [theme.colors.Green200, theme.colors.Greenish],
}))`
  flex: 1;
  background-color: transparent;
`;

export const GradientLayerInner = styled(LinearGradient).attrs(({ theme }) => ({
  start: { x: 0.8, y: 0 },
  end: { x: 0.3, y: 1 },
  colors: [theme.colors.Green200, theme.colors.Greenish],
}))`
  width: 100%;
  height: 100%;
  align-self: center;
  justify-content: center;
  align-items: center;
  background-color: transparent;
`;

export const Scroll = styled.FlatList.attrs(() => ({
  contentContainerStyle: { marginHorizontal: 10, justifyContent: 'center', alignItems: 'center' },
}))`
  width: 100%;
`;

export const Divider = styled.View`
  height: 100%;
  width: 14px;
`;

export const Empty = styled.View`
  margin-left: 6px;
`;

export const Divider1 = styled.View`
  height: 14px;
`;

export const Scroll1 = styled.FlatList.attrs(() => ({
  contentContainerStyle: { justifyContent: 'space-between', alignItems: 'flex-start' },
}))`
  align-self: center;
`;

export const Feed = styled.FlatList.attrs(() => ({}))`
  padding: 15px;
`;

export const Card = styled.View`
  margin: 10px;
`;

export const Content = styled.View`
  margin-top: 88px;
  margin-left: 16px;
  margin-right: 16px;
  align-items: center;
  text-align: center;
  flex: 1;
  width: 100%;
`;

export const HeaderWP = styled.View`
  margin-left: 16px;
  margin-right: 16px;
  width: 100%;
`;

export const HeaderContent = styled.View`
  flex-direction: row;
  width: 90%;
  justify-content: space-between;
`;

export const HeaderIconsContent = styled.View`
  flex-direction: row;
`;

export const Label = styled.Text`
  font-family: 'Baloo2_700Bold';
  font-style: normal;
  font-weight: bold;
  font-size: 24px;
  line-height: 32px;
  color: ${({ theme }) => theme.colors.White};
  text-align: center;
`;

export const EmptyContainer = styled.View`
  align-self: center;
  justify-content: space-between;
  align-items: center;
  width: 294px;
  height: 162px;
`;

export const EmptyText = styled.Text`
  text-align: center;
  font-size: 16px;
  line-height: 22px;
  color: ${({ theme }) => theme.formatterColor.Light400};
`;

export const TextInputContainer = styled.View`
  align-items: center;
  width: 100%;
  margin-top: 32px;
  margin-bottom: 32px;
`;

export const BtnWrapper = styled.View`
  flex: 1;
`;
export const Btn = styled.View`
  flex-direction: row;
  margin: 7px 0;
  z-index: 2;
  padding: 0 20px;
`;

export const Row = styled.View`
  width: 100%;
  padding: 4px 16px;
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
`;

export const FlatListContainer = styled.View`
  flex: 1;
  width: 100%;
`;

export const CounterContainer = styled.View`
  justify-content: space-between;
  width: 100%;
  flex-direction: row;
  align-items: center;
  padding: 0 20px;
`;

export const CounterTitleContainer = styled.View`
  justify-content: center;
  flex-direction: row;
  align-items: center;
`;

export const CounterTitle = styled.Text`
  font-family: 'Baloo2_700Bold';
  font-style: normal;
  font-size: 22px;
  color: ${({ theme }) => theme.colors.White};
`;

export const CounterSticker = styled.View`
  width: 22px;
  border-radius: 14px;
  background-color: ${({ theme }) => theme.formatterColor.Light200};
`;

export const CounterTopSticker = styled.View`
  padding: 3px 8px;
  border-radius: 14px;
  background-color: ${({ theme }) => theme.formatterColor.Light200};
`;

export const Percent = styled.Text`
  margin-left: 7px;
  font-family: 'Inter_400Regular';
  font-style: normal;
  font-weight: normal;
  font-size: 14px;
  line-height: 20px;
  color: ${({ theme }) => (theme.colors.White)};
  opacity: 0.8;
`;

export const Trend = styled.View`
  background-color: ${({ theme }) => theme.colors.White};
  margin: 0 9px 0 4px;
  height: 28px;
  width: 28px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 28px;
`;

export const ChartWrapper = styled.View`
  padding-left: 20px;
  padding-right: 20px;
  width: 100%;
  height: 300px;
  overflow: hidden;
`;

export const CounterStickerText = styled.Text`
  font-family: 'Baloo2_700Bold';
  font-style: normal;
  font-size: 12px;
  text-align: center;
  color: ${({ theme }) => theme.colors.White};
`;

export const FooterContent = styled(LinearGradient).attrs(({ theme }) => ({
  start: { x: 0.8, y: 0 },
  end: { x: 0.3, y: 1 },
  colors: [theme.formatterColor.Dark400, theme.colors.Dark],
}))<LinearGradientProps & { justify?: string }>`
  border-radius: 36px;
  width: 100%;
  height: 100%;
  align-self: center;
  justify-content: ${({ justify }): string => justify ?? 'center'};
  align-items: center;
  background-color: transparent;
  padding: 24px 0 0 0;
  margin: 15px 0 0 0;
`;

export const Chart = styled.View`
  height: 200px;
`;
