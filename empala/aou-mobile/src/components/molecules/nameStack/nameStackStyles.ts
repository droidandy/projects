import { SafeAreaView } from 'react-native-safe-area-context';
import styled from 'styled-components/native';

export const Content = styled.View`
  flex: 1;
  width: 100%;

  margin-top: 44px;
  align-items: center;
  text-align: center;
`;

export const Slide = styled(SafeAreaView)`
  flex: 1;
  justify-content: center;
`;

export const TextInputContainer = styled.View`
  align-items: center;
  width: 100%;
  margin-top: 32px;
  margin-bottom: 42px;
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

export const FlatListContainer = styled.View`
  flex: 1;
  width: 100%;
  margin-top: 32px;
`;

export const ButtonContainer = styled.View`
  position: absolute;
  bottom: 0;
  width: 90%;
  justify-content: flex-end;
`;

export const CounterContainer = styled.View`
  justify-content: space-between;
  width: 100%;
  flex-direction: row;
  align-items: center;
  padding: 0 20px;
`;

export const CounterButton = styled.TouchableOpacity`
  flex-direction: row;
  background-color: #ffffff40;
  width: 133px;
  height: 40px;
  border-radius: 120px;
  justify-content: center;
  align-items: center;
`;

export const CounterButtionTitle = styled.Text`
  font-family: 'Inter_700Bold';
  font-style: normal;
  font-size: 14px;
  color: #ffffff;
  padding-left: 10px;
`;

export const CounterTitleContainer = styled.View`
  justify-content: center;
`;

export const CounterTitle = styled.Text`
  font-family: 'Baloo2_700Bold';
  font-style: normal;
  font-size: 22px;
  color: #ffffff;
`;

export const CounterSticker = styled.View`
  width: 22px;
  border-radius: 14px;
  background-color: #00000050;
`;

export const CounterStickerText = styled.Text`
  font-family: 'Baloo2_700Bold';
  font-style: normal;
  font-size: 12px;
  line-height: 22px;
  text-align: center;
  color: #ffffff;
`;

export const ErrorContainer = styled.View`
  flex:1;
  flex-direction: column;
  justify-content: flex-end;
`;

export const ErrorMessage = styled.Text`
  color: white;
  font-weight: 700;
  font-size: 28px;
  font-family: 'Baloo2_700Bold';
  text-align: center;
`;

export const ErrorMessageText = styled.Text`
  color: white;
  font-weight: 500;
  font-size: 16px;
  line-height: 22px;
  font-family: 'Inter_700Bold';
  text-align: center;
`;

export const Btn = styled.View`
  flex: 1;
  justify-content: flex-end;
`;

export const Body = styled.View`
  flex: 1;
`;
