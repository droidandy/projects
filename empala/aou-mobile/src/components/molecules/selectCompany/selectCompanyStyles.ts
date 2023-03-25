import { SafeAreaView } from 'react-native-safe-area-context';
import styled from 'styled-components/native';

export const Content = styled.View`
  margin-top: 44px;
  margin-left: 16px;
  margin-right: 16px;
  align-items: center;
  text-align: center;
  flex: 1;
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

export const FlatListContainer = styled.View<{ loading: boolean }>`
  flex: 1;
  width: 100%;
  margin-top: 32px;
  position: relative;
`;

export const LoadingIndicatorContainer = styled.View`
  position: absolute;
  top: 0;
  left: 0;
  height: 50%;
  width: 100%;
`;

export const Label = styled.Text`
  font-family: 'Baloo2_700Bold';
  font-style: normal;
  font-weight: bold;
  font-size: 24px;
  line-height: 32px;
  color: #ffffff;
  text-align: center;
`;

export const Text = styled.Text`
  margin-top: 25px;
  font-family: 'Inter_500Medium';
  font-style: normal;
  font-weight: 500;
  font-size: 16px;
  line-height: 24px;
  text-align: center;
  color: #ffffff;
  opacity: 0.7;
  margin-left: 16px;
  margin-right: 16px;
`;

export const Slide = styled(SafeAreaView)`
  width: 100%;
  height: 100%;
  align-self: center;
  justify-content: center;
  align-items: center;
`;

export const Scroll = styled.ScrollView.attrs(() => ({
  contentContainerStyle: { marginHorizontal: 10, justifyContent: 'center', alignItems: 'center' },
}))`
  width: 100%;
`;

export const TextInputContainer = styled.View`
  align-items: center;
  width: 100%;
  margin-top: 62px;
  margin-bottom: 42px;
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

export const ButtonContainer = styled(SafeAreaView)`
  height: 56px;
  width: 90%;
  justify-content: center;
  position: absolute;
  bottom: 0;
`;
