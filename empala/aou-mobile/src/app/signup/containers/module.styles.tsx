import { Animated, KeyboardAvoidingView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import styled from 'styled-components/native';

export const KeyboardAvoidingViewContainer = styled(KeyboardAvoidingView)`
  flex: 1;
  justify-content: center;
`;

export const ErrorMessage = styled.View`
  width: 100%;
  align-self: stretch;
  margin-bottom: 12px;
`;

export const ScreenContainer = styled(SafeAreaView)`
  flex: 1;
  justify-content: center;
`;

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
  flex-direction: row;
  margin: 7px 0;
  z-index: 2;
`;

export const ButtonContainer = styled.View`
  padding: 0 16px;
`;

export const BtnWrapper = styled.View`
  flex: 1;
`;

export const Action = styled.TouchableOpacity`
  padding: 16px;
  margin-right: 16px;
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
  margin-bottom: 25px;
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
  justify-content: flex-start;
  padding-top: 16px;
`;

export const FieldsContainer = styled.View`
  padding-bottom: 10px;
`;

export const TermsContainer = styled.View`
  margin-top: 16px;
  align-items: center;
  width: 100%;
`;
