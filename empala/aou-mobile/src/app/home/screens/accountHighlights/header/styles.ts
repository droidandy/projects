import { SafeAreaView } from 'react-native-safe-area-context';
import styled from 'styled-components/native';

export const Wrapper = styled(SafeAreaView)`
  width: 100%;
`;

export const Title = styled.View`
  margin-top: 8px;
`;

export const TitleWrapper = styled.View`
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
`;

export const TitleMain = styled.Text`
  font-weight: 800;
  font-size: 24px;
  line-height: 34px;
  color: ${({ theme }): string => theme.colors.Black};
`;

export const TitleSecond = styled.Text`
  font-weight: 400;
  font-size: 14px;
  line-height: 24px;
  color: ${({ theme }): string => theme.colors.GreyDarkest};
`;

export const TitleIconsWrapper = styled.View`
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
  
  width: 64px;
`;
