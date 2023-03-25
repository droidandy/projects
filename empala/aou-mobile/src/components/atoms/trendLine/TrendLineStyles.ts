import styled from 'styled-components/native';

export const Container = styled.View`
  width: 42px;
  height: 42px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: ${({ theme }) => theme.colors.White};;
  border-radius: 42px;
`;
