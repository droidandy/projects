import styled from 'styled-components/native';

export const Wrapper = styled.View`
  flex-direction: row;
  justify-content: space-around;
`;

export const Tab = styled.TouchableOpacity`
`;

export const TabLabel = styled.Text<{ active: boolean }>`
  font-weight: ${({ active }): number => (active ? 700 : 500)};
  font-size: 16px;
  line-height: 24px;
  color: ${({ theme }): string => theme.colors.Black};
  opacity: ${({ active }): number => (active ? 1 : 0.5)};
`;
