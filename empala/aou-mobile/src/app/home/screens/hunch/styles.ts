import styled from 'styled-components/native';

export const FooterHeader = styled.View`
  flex-direction: row;
  justify-content: flex-start;
  width: 100%;
  padding: 0 26px 20px;
`;

export const CompanyName = styled.Text`
  font-size: 24px;
  font-weight: 700;
  color: ${({ theme }) => theme.colors.White};
`;
