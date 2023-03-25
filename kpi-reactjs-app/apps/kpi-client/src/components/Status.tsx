import styled, { css } from 'styled-components';

export interface StatusProps {
  status: 'ok' | 'warning' | 'error' | 'info';
  large?: boolean;
}

export const Status = styled.div<StatusProps>`
  display: flex;
  align-items: center;
  color: white;
  border: 1px solid transparent;
  text-align: center;
  padding: 5px 10px;
  border-radius: 4px;
  ${props =>
    props.large &&
    css`
      padding: 0.65rem 1rem;
      font-size: 1rem;
      line-height: 1.5;
    `}

  ${props => {
    switch (props.status) {
      case 'ok': {
        return css`
          background: #10a6e9;
        `;
      }
      case 'error': {
        return css`
          background: #ff3766;
        `;
      }
      case 'warning': {
        return css`
          background: #fead33;
        `;
      }
      case 'info': {
        return css`
          background: white;
          border: 1px solid #dee1e9;
          color: #244159;
        `;
      }
    }
  }}
`;
