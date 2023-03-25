import styled from 'styled-components/native';

import { FillableContainer } from '~/components/atoms/fillableContainer';

export const Wrapper = styled(FillableContainer)`
  margin-top: 10px;
  border-radius: 16px;
  width: 100%;
  overflow: hidden;
  background-color: #E2E8F0;
  height: 70px;
`;

export const Content = styled.View`
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
  padding: 11px;
  width: 100%;
  height: 100%;
`;

export const Name = styled.Text`
  color: ${({ theme }): string => theme.colors.GreyDarkest};
  font-weight: bold;
  font-size: 16px;
  line-height: 24px;
`;

export const Shares = styled.Text`
  color: ${({ theme }): string => theme.colors.GreyDarkest};
  font-size: 11px;
  line-height: 16px;
`;

export const Value = styled.Text`
  color: ${({ theme }): string => theme.colors.Black};
  font-weight: bold;
  font-size: 16px;
  line-height: 24px;
`;

export const ValueChangesWrapper = styled.View`
  flex-direction: row;
  align-items: center;
  justify-content: center;
`;

export const LineIconWrapper = styled.View`
  margin-right: 5px;
`;

export const NameWrapper = styled.View`
  flex-grow: 1;
  justify-content: flex-start;
  height: 100%;
`;

export const ValueWrapper = styled.View`
  justify-content: flex-start;
  height: 100%;
`;
