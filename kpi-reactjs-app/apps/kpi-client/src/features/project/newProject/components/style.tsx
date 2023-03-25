import styled, { css } from 'styled-components';

export const Content = styled.div<{ flex?: boolean }>`
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

export const Container = styled.div`
  background: white;
  border-radius: 3px;
  position: relative;
  margin-top: 30px;
  margin-bottom: 30px;
  box-shadow: 0px 2px 15px rgba(0, 0, 0, 0.2);
`;
