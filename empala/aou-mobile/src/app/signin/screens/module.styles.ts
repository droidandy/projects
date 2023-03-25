import { LinearGradient } from 'expo-linear-gradient';
import styled from 'styled-components/native';

export const Background = styled(LinearGradient).attrs(() => ({
  start: { x: 0.8, y: 0 },
  end: { x: 0.3, y: 1 },
  colors: ['#00C0BF', '#245CC0'],
}))`
  flex: 1;
  background-color: #fff;
`;

export const Form = styled.View`
  flex: 1;
  width: 100%;
`;

export const Message = styled.View`
  width: 100%;
  align-self: stretch;
  margin-bottom: 12px;
`;

export const InputsContainer = styled.View`
  margin-top: 88px;
  flex: 1;
  width: 100%;
  padding: 0 16px;
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

export const LinkButtonContainer = styled.View`
  margin-top: 12px;
  margin-bottom: 32px;
`;

export const ButtonContainer = styled.View`
  padding: 24px 16px;
`;
