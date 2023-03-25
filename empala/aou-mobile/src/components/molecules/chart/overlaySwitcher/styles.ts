import styled from 'styled-components/native';

import { Switcher as SwitcherComponent } from './Switcher';

export const Wrapper = styled.TouchableOpacity`
  flex-direction: row;
  justify-content: center;
  align-items: center;
  width: 100px;
  height: 40px;
`;

export const Switcher = styled(SwitcherComponent)`
  margin-right: 6px;
`;

export const Label = styled.View`
  align-items: center;
`;

export const LabelText = styled.Text`
  font-weight: 500;
  font-size: 14px;
  line-height: 24px;
  color: ${({ theme }): string => theme.colors.GreyGull};
`;

export const LabelUnderline = styled.View`
  height: 1px;
  width: 100%;
  background-color: ${({ theme }): string => theme.colors.GreyGull};
`;
