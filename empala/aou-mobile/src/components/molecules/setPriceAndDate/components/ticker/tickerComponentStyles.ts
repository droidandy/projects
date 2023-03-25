import styled from 'styled-components/native';

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
