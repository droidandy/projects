import { SafeAreaView } from 'react-native-safe-area-context';
import styled from 'styled-components/native';

import { Chart as ChartComponent } from '~/components/molecules/chart';

export const SafeArea = styled(SafeAreaView)`
  flex: 1;
  background-color: ${({ theme }) => theme.colors.White};
`;

export const Content = styled.KeyboardAvoidingView`
  flex: 1;
  margin: 17px;
`;

export const Row = styled.View<{ marginTop?: number }>`
  flex-direction: row;
  justify-content: space-between;
  align-items: baseline;
  margin-top: ${({ marginTop }) => marginTop || 0}px;
`;

export const RowAlignRight = styled(Row)`
  justify-content: flex-end;
`;

export const HalfWidth = styled.View`
  flex-direction: row;
  align-items: center;
`;

export const HalfWidthTouchable = styled.TouchableOpacity`
  flex-direction: row;
  align-items: center;
`;

export const CompanyName = styled.Text`
  font-weight: 900;
  font-size: 36px;
  line-height: 48px;
  color: ${({ theme }): string => theme.colors.GreyDarkest};
`;

export const Logo = styled.Image`
  width: 30px;
  height: 30px;
`;

export const CurrentPrice = styled.Text`
  font-weight: bold;
  font-size: 16px;
  color: ${({ theme }) => theme.colors.GreyDarkest};
`;

export const OrderType = styled.Text`
  margin-right: 9px;
  font-weight: 500;
  font-size: 14px;
  text-decoration-line: underline;
  color: ${({ theme }) => theme.colors.GreyDarkest};
`;

export const Subcontainer = styled.View`
  background-color: ${({ theme }) => theme.colors.Grey300};
  margin-top: 30px;
  border-radius: 16px;
  overflow: hidden;
`;

export const ChartWrapper = styled.View`
  height: 147px;
`;

export const Chart = styled(ChartComponent)`
  background-color: ${({ theme }): string => theme.colors.Grey300};
  border-bottom-right-radius: 0;
  border-bottom-left-radius: 0;
`;

export const BelowChartContent = styled.View`
  padding: 0 18px 14px;
`;

export const PriceCaption = styled.Text`
  margin-right: 7px;
  font-size: 14px;
  text-decoration-line: underline;
  color: ${({ theme }) => theme.colors.GreyDarkest};
`;

export const UserPrice = styled.Text`
  font-weight: 800;
  font-size: 18px;
`;

export const Ticker = styled.Text`
  font-weight: 800;
  font-size: 18px;
`;

export const Amount = styled.TextInput`
  margin-left: 4px;
  font-weight: 900;
  font-size: 48px;
  color: ${({ theme }) => theme.colors.BrandBlue600};
`;

export const BalanceCaption = styled.Text`
  font-size: 14px;
`;

export const Balance = styled.Text`
  font-size: 14px;
`;

export const Total = styled.Text`
  margin-right: 7px;
  font-size: 14px;
`;

export const Btn = styled.View`
  margin-top: 58px;
`;
