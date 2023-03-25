import { SafeAreaView } from 'react-native-safe-area-context';
import styled from 'styled-components/native';

interface ContainerProps {
  readonly isActive: boolean;
}

export const Content = styled.View`
  margin-top: 28px;
  padding: 0 8px;
`;

export const Body = styled.View`
  flex: 1;
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
  align-self: center;
  justify-content: center;
`;

export const TickerContainer = styled.View`
  height: 269px;
  border-radius: 31px;
  align-items: center;
  margin-top: 13px;
  margin-bottom: 17px;
  background-color: ${({ theme }) => theme.formatterColor.Dark400};
`;

export const TickerHeaderContainer = styled.View`
  flex-direction: row;
  height: 56px;
  padding-right: 21px;
  align-items: center;
`;

export const TickerHeaderTitleContainer = styled.View`
flex: 1;
  margin-left: 22px;
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

export const TickerContainerTitle = styled.Text`
  color: white;
  font-weight: 700;
  font-size: 16px;
  font-family: 'Inter_700Bold';
`;

export const TickerContainerPrice = styled.Text`
  color: white;
  font-weight: 400;
  font-size: 13px;
  font-family: 'Inter_400Regular';
  margin-right: 10px;
`;

export const TickerContainerChange = styled.Text`
  color: white;
  font-weight: 400;
  font-size: 12px;
  font-family: 'Inter_400Regular';
  margin-right: 10px;
`;

export const Trend = styled.View<ContainerProps>`
  background-color: ${({ theme }) => theme.colors.White};
  margin: 0 9px 0 4px;
  height: 28px;
  width: 28px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 28px;
`;

export const ButtonsContainer = styled.View`
  flex-direction: column;
  justify-content: flex-start;
  height: 238px;
`;

export const Btn = styled.View`
  flex: 1;
  justify-content: flex-end;
`;

export const HeaderContent = styled.View`
  flex-direction: row;
  justify-content: space-between;
`;

export const HeaderIconsContent = styled.View`
  flex-direction: row;
`;

export const DescriptionContainer = styled.View`
`;

export const Description = styled.TextInput`
  font-size: 14px;
  font-weight: 700;
  color: ${({ theme }) => theme.formatterColor.Light600};
  padding: 20px 5px;
`;
