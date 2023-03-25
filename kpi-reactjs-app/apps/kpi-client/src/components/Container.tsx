import styled, { css } from 'styled-components';

export const Container = styled.div<{ flex?: boolean }>`
  width: 100%;

  ${props =>
    props.flex &&
    css`
      height: 100%;
      display: flex;
      flex-direction: column;
    `}

  @media (min-width: 1025px) {
    padding: 0 30px;
  }

  @media (min-width: 1429px) {
    width: 1380px;
    margin: 0 auto;
  }
`;
