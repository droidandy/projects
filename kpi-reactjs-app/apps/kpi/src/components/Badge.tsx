import * as React from 'react';
import styled, { css } from 'styled-components';

interface BadgeProps {
  className?: string;
  type: 'brand' | 'dark' | 'success' | 'error' | 'warning';
  children: React.ReactNode;
  size?: 'large' | 'medium';
}

const _Badge = (props: BadgeProps) => {
  const { className, children } = props;
  return <span className={className}>{children}</span>;
};

export const Badge = styled(_Badge)`
  margin: 0;
  display: inline-flex;
  justify-content: center;
  align-items: center;
  font-size: 0.8rem;
  height: 0;
  width: auto;
  padding: 0.75rem 0.75rem;
  border-radius: 2px;
  ${props =>
    props.type === 'brand' &&
    css`
      color: #ffffff;
      background: #5d78ff;
    `}
  ${props =>
    props.type === 'dark' &&
    css`
      color: #ffffff;
      background: #282a3c;
    `}
  ${props =>
    props.type === 'success' &&
    css`
      color: #ffffff;
      background: #0abb87;
    `}
  ${props =>
    props.type === 'warning' &&
    css`
      color: #111;
      background: #ffb822;
    `}
  ${props =>
    props.type === 'error' &&
    css`
      color: #ffffff;
      background: #fd397a;
    `}
  ${props =>
    props.size === 'large' &&
    css`
      font-size: 1.2rem;
    `}
  ${props =>
    props.size === 'medium' &&
    css`
      padding: 1rem 1rem;
      font-size: 1rem;
      i {
        margin-right: 0.5rem;
      }
    `}
`;
