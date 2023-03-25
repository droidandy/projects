import styled from 'styled-components/native';

import { Icon } from '~/components/atoms/icon';

export const Container = styled.View`
  margin: 4px;
  display: flex;
  flex-direction: row;
  align-items: center;
  border-radius: 120px;
  padding: 11px 14px;
  background: ${({ theme }) => theme.colors.White};
`;

export const Label = styled.Text`
  font-family: Inter_700Bold;
  font-size: 16px;
  line-height: 24px;
  color: ${({ theme }) => theme.colors.Red};
`;

export const Text = styled.Text`
  font-family: Inter_500Medium;
  font-size: 14px;
  line-height: 20px;
  color: ${({ theme }) => theme.colors.Red};
  opacity: 0.7;
`;

export const Block = styled.View`
  flex-shrink: 1;
`;

export const Error = styled(Icon)`
  margin-right: 15px;
`;
