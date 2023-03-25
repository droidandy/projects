import styled from 'styled-components/native';

import { IconContainer } from '~/components/atoms/icon';
import { ToggleSwitch } from '~/components/atoms/toggleSwitch';

export const Container = styled.KeyboardAvoidingView`
  justify-content: space-between;
  padding: 0 16px 87px 16px;
`;

export const InfoIcon = styled(IconContainer).attrs(() => ({
  name: 'info',
  size: 20,
}))`
  margin-left: 10px;
`;

export const Row = styled.View<{ marginTop?: number }>`
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  margin-top: ${({ marginTop }) => marginTop || 0}px;
`;

export const RowAlignRight = styled(Row)`
  justify-content: flex-end;
  align-items: baseline;
`;

export const ExtendedHoursCaption = styled.Text`
  flex-grow: 1;
  font-size: 16px;
  color: ${({ theme }) => theme.colors.White};
`;

export const ExtendedHoursSwitch = styled.Switch`
  
`;

export const TimeInForceCaption = styled.Text`
  flex-grow: 1;
  font-size: 16px;
  color: ${({ theme }) => theme.colors.White};
`;

export const TimeInForceSwitch = styled(ToggleSwitch)`
  margin-right: 14px;
`;

export const InputSubtitle = styled.Text`
  font-size: 14px;
  color: ${({ theme }) => theme.colors.White};
`;

export const Input = styled.TextInput`
  margin-left: 4px;
  font-weight: 900;
  font-size: 48px;
  color: ${({ theme }) => theme.colors.White};
`;

export const Dollar = styled.Text`
  font-weight: 800;
  font-size: 18px;
`;

export const Btn = styled.View`
  margin-top: 58px;
`;
