import styled, { css } from 'styled-components';

interface BaseTableRowProps {
  sticky?: boolean;
}

export const BaseTableRow = styled.div<BaseTableRowProps>`
  display: flex;
  place-items: center;
  width: 100%;
  padding: 15px 30px;
  font-size: 14px;
  background: white;
  & > div {
    flex-shrink: 0;
  }

  ${props =>
    props.sticky &&
    css`
      position: fixed;
      top: 60px;
      width: 100%;
      max-width: 1320px;
      z-index: 3;
      border-bottom: 1px solid #dee1e9;
    `}
`;
