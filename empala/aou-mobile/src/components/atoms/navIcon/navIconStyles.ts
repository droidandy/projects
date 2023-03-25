import styled, { css } from 'styled-components/native';

export const Container = styled.View<{ focused: boolean }>`
  padding: 7px 12px;
  ${({ focused }) => focused && css`
    background-color: ${({ theme }) => theme.colors.BrandBlue200};
    border-radius: 16px;
  `}
`;
