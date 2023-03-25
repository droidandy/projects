import styled, { css } from 'styled-components/native';

export const Container = styled.View`
  width: 100%;
`;

export const Button = styled.TouchableOpacity`
  height: 56px;
  border-radius: 32px;
  background-color: ${({ theme }) => theme.formatterColor.Dark200};
`;

export const Title = styled.Text<{ face?: string }>`
  font-family: 'Inter_400Regular';
  font-style: normal;
  font-weight: 400;
  font-size: 16px;
  line-height: 24px;

  opacity: 0.4;
  color: ${({ theme }) => theme.colors.White};
`;

export const PriceTitle = styled.Text`
  font-family: 'Inter_400Regular';
  font-style: normal;
  font-weight: 400;
  font-size: 14px;
  line-height: 24px;

  opacity: 0.4;
  color: ${({ theme }) => theme.colors.White};
`;

export const PriceText = styled.Text`
  font-family: 'Inter_500Medium';
  font-style: normal;
  font-weight: 500;
  font-size: 16px;
  line-height: 24px;

  color: ${({ theme }) => theme.colors.White};
`;

export const PercentText = styled.Text`
  font-family: 'Inter_500Medium';
  font-style: normal;
  font-weight: 500;
  font-size: 16px;
  line-height: 24px;

  padding-left: 8px;
  color: ${({ theme }) => theme.colors.White};
  opacity: 0.6;
`;

export const ButtonContainer = styled.View`
  flex: 1;
  flex-direction: row;
  margin: 0 23px;
  align-items: center;
`;

export const TitleContainer = styled.View`
  flex: 1;
  align-items: center;
  margin-left: 11px;
`;

export const PriceTitleContainer = styled.View`
  width: 90px;
  flex-direction: row;
  align-items: center;
`;

export const PriceContainer = styled.View`
  flex: 1;
  flex-direction: row;
  align-items: center;
  margin-left: 11px;
`;
