import React from 'react';
import styled, { css } from 'styled-components';

const Icon = styled.div`
  display: flex;
  align-items: center;
  padding: 0 1.25rem 0 0;
`;

interface AlertProps {
  className?: string;
  children: React.ReactNode;
  type?: 'info' | 'warning';
  icon?: React.ReactNode;
}

const _Alert = (props: AlertProps) => {
  const { className, children, icon } = props;
  return (
    <div className={className}>
      {icon && <Icon>{icon}</Icon>}
      {children}
    </div>
  );
};

export const Alert = styled(_Alert)`
  display: flex;
  align-items: center;
  padding: 1rem 2rem;
  border-radius: 3px;
  margin: 0 0 20px 0;

  i {
    font-size: 1.4rem;
  }

  background: #ffb822;
  border: 1px solid #ffb822;
  color: #111111;

  ${props =>
    props.type === 'info' &&
    css`
      background: #5867dd;
      border: 1px solid #5867dd;
      color: #ffffff;
    `}
`;
