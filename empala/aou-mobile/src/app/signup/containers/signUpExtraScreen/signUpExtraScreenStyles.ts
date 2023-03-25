import { KeyboardAvoidingView } from 'react-native';
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

export const Slide = styled(SafeAreaView)`
  flex: 1;
  justify-content: center;
  padding: 0 16px;
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

export const Link = styled(Text)`
  margin-top: 16px;
  align-items: center;
  text-decoration: underline;
  text-decoration-color: white;
`;
