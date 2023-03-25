import styled from 'styled-components/native';

export const LinkButton = styled.Text`
  font-size: 13px;
  line-height: 18px;
  text-align: center;
  color: ${({ theme }) => theme.colors.White};
  text-decoration: underline;
  text-decoration-color: ${({ theme }) => theme.colors.White};
`;
