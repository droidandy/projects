import styled from 'styled-components/native';

export const SectionHeader = styled.Text`
  font-weight: bold;
  font-size: 16px;
  line-height: 24px;
  color: ${({ theme }): string => theme.colors.GreyGull};
  background-color: ${({ theme }): string => theme.colors.White};
`;
