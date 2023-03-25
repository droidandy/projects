import { LayoutRectangle } from 'react-native';
import styled from 'styled-components/native';

import downArrow from '~/assets/icons/lib/downArrow';

export const Wrapper = styled.View`
  position: relative;
`;

export const Button = styled.TouchableOpacity`
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  height: 30px;
  padding: 3px 12px;
  background-color: #E2E8F0;
  border-radius: 16px;
`;

export const Label = styled.Text`
  font-weight: 700;
  font-size: 12px;
  line-height: 24px;
  color: ${({ theme }): string => theme.colors.Black};
  opacity: 0.6;
  min-width: 70px;
`;

export const Arrow = styled(downArrow)`
  width: 24px;
  height: 24px;
`;

export const List = styled.View<{ buttonLayoutRect?: LayoutRectangle }>`
  position: absolute;
  top: ${({ buttonLayoutRect }) => (buttonLayoutRect ? (buttonLayoutRect.y + buttonLayoutRect.height) : 0) + 3}px;
  left: ${({ buttonLayoutRect }) => buttonLayoutRect?.x ?? 0};
  width: ${({ buttonLayoutRect }) => buttonLayoutRect?.width ?? 0}px;
  background-color: #E2E8F0;
  border-radius: 16px;
  z-index: 1;
`;

export const ListItem = styled(Button)`
  background-color: transparent;
  border-radius: 0;
`;
