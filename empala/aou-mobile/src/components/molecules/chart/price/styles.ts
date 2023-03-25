import styled from 'styled-components/native';

export const Wrapper = styled.View``;

export const Price = styled.Text`
  color: ${({ theme }): string => theme.colors.GreyDarkest};
  fontFamily: 'Inter_800ExtraBold';
  font-size: 24px;
  line-height: 34px;
`;

export const LineIconWrapper = styled.View`
  height: 18px;
`;

export const ExtraInfoWrapper = styled.View`
  flex-direction: row;
  align-items: center;
`;

export const ExtraInfo = styled.Text`
  color: ${({ theme }): string => theme.colors.GreyDarkest};
  font-family: 'Inter_400Regular';
  font-size: 14px;
  line-height: 24px;
`;
