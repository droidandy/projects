import { Animated } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import styled from 'styled-components/native';

export const BubbleSelectContainer = styled.View`
  width: 100%;
  flex-grow: 1;
`;

export const AnimatedView = styled(Animated.View) <{ width: number }>`
  position: absolute;
  top: 0;
  bottom: 0;
  width: ${({ width }) => `${width}px`};
`;

export const Btn = styled.View`
  width: 100%;
  margin: 7px 0;
  z-index: 2;
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
  flex: 1;
  justify-content: center;
  padding: 0 16px;
`;

export const Scroll = styled.ScrollView.attrs(() => ({
  contentContainerStyle: { marginHorizontal: 10, justifyContent: 'center', alignItems: 'center' },
}))`
  width: 100%;
`;

export const Form = styled.View`
  flex: 1;
  width: 100%;
`;

export const Fields = styled.View`
  flex: 1;
`;

export const ButtonContainer = styled.View`
  align-items: center;
  width: 100%;
  margin-bottom: 42px;
`;

export const TextInputContainer = styled.View`
  align-items: center;
  width: 100%;
  margin-top: 32px;
  margin-bottom: 42px;
`;

export const NameTextInput = styled.TextInput`
  width: 100%;
  height: 56px;
  align-items: center;
  background-color: ${({ theme }) => theme.formatterColor.Dark400};
  border-radius: 120px;
  border-color: white;
  border-bottom-color: ${({ theme }) => theme.colors.White};
  border-top-color: ${({ theme }) => theme.colors.White};
  border-left-color: ${({ theme }) => theme.colors.White};
  border-right-color: ${({ theme }) => theme.colors.White};
  border: ${({ value }) => (value ? '2px' : 0)};
  font-size: 16px;
  color: white;
`;
