import styled from 'styled-components/native';

export const Wrapper = styled.View`
  flex-direction: row;
  justify-content: space-between;
  align-items: flex-start;
`;

export const Underline = styled.View`
  opacity: 0.2;
  width: 100%;
  height: 1px;
  background-color: ${({ theme }): string => theme.colors.Black};
  margin-top: 8px;
  margin-bottom: 10px;
`;

export const Column = styled.View<{ align?: string, grow?: boolean }>`
  justify-content: space-between;
  align-items: ${({ align }): string => align ?? 'flex-start'};
  width: 30%;
  margin-left: 10px;
`;

export const MainText = styled.Text`
  font-family: 'Inter_400Regular';
  font-size: 16px;
  line-height: 24px;
  color: ${({ theme }): string => theme.colors.Black};
`;

export const SecondaryText = styled.Text`
  font-family: 'Inter_400Regular';
  font-size: 11px;
  line-height: 16px;
  color: ${({ theme }): string => theme.colors.Geyser};
`;
