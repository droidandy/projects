import { SafeAreaView } from 'react-native-safe-area-context';
import styled from 'styled-components/native';

export const SafeArea = styled(SafeAreaView).attrs(() => ({
  edges: ['bottom'],
}))`
  flex: 1;
`;

export const Container = styled(SafeAreaView)`
  flex-grow: 1;
  justify-content: center;
  align-items: center;
`;

export const TitleContainer = styled.View`
  flex-direction: row;
`;

export const Title = styled.Text`
  font-size: 16px;
`;

export const TitleBold = styled.Text`
  font-weight: bold;
`;

export const Amount = styled.Text`
  font-weight: 900;
  font-size: 81.6px;
`;

export const AmountExplainationContainer = styled.View`
  flex-direction: row;
`;

export const WorthOf = styled.Text`
  font-size: 16px;
`;

export const CompanyLogo = styled.Image`
  width: 15px;
  height: 15px;
`;

export const CompanyName = styled.Text`
  font-weight: bold;
  font-size: 16px;
`;

export const SharePrice = styled.Text`
  font-size: 14px;
`;

export const DetailsContainer = styled.View`
  padding: 0 21px;
`;

export const DetailsRow = styled.View`
  flex-direction: row;
  justify-content: space-between;
  margin-top: 8px;
`;

export const DetailsText = styled.Text`
  font-size: 11px;
`;

export const Btn = styled.View`
  margin: 26px 21px;
`;
