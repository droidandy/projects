import React from 'react';
import styled, { css } from 'styled-components';
import { Spinner } from './Spinner';
import { rtlMargin } from 'shared/rtl';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children: React.ReactNode;
  block?: boolean;
  large?: boolean;
  small?: boolean;
  loading?: boolean;
  bold?: boolean;
  styling?: 'primary' | 'brand' | 'secondary';
  iconSize?: 'lg';
  innerRef?: (ref: HTMLButtonElement | null) => void;
}

const _Button = (props: ButtonProps) => {
  const {
    children,
    large,
    block,
    loading,
    disabled,
    small,
    bold,
    innerRef,
    iconSize,
    ...rest
  } = props;
  return (
    <button {...rest} disabled={disabled || loading} ref={innerRef}>
      {loading && <Spinner />}
      {children}
    </button>
  );
};

interface ButtonTheme {
  color: string;
  normal: string;
  border?: string;
  hover: string;
  hoverColor?: string;
  hoverBorder?: string;
  active: string;
  activeColor?: string;
  activeBorder?: string;
}

const primary: ButtonTheme = {
  color: '#fff',
  normal: '#5867dd',
  hover: '#384ad7',
  active: '#2a4eff',
};

const brand: ButtonTheme = {
  color: '#5d78ff',
  hoverColor: '#fff',
  normal: '#eef1ff',
  hover: '#5d78ff',
  active: '#5d78ff',
};

const secondary: ButtonTheme = {
  color: '#6c7293',
  border: '#ebedf2',
  normal: 'transparent',
  hover: '#f4f5f8',
  hoverBorder: '#ebedf2',
  hoverColor: '#6c7293',
  active: '#f4f5f8',
  activeBorder: '#ebedf2',
  activeColor: '#6c7293',
};

const includeStyles = (theme: ButtonTheme) => css`
  color: ${theme.color};
  background-color: ${theme.normal};
  border-color: ${theme.border || theme.normal};

  &:hover {
    color: ${theme.hoverColor || theme.color};
    background-color: ${theme.hover};
    border-color: ${theme.hoverBorder || theme.hover};
  }
  &:active {
    color: ${theme.activeColor || theme.hoverColor || theme.color};
    background-color: ${theme.active};
    border-color: ${theme.activeBorder || theme.active};
  }
`;

export const Button = styled(_Button)`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  font-weight: 400;
  text-align: center;
  white-space: nowrap;
  vertical-align: middle;
  -webkit-user-select: none;
  -moz-user-select: none;
  -ms-user-select: none;
  user-select: none;
  border: 1px solid transparent;
  padding: 0.65rem 1rem;
  font-size: 1rem;
  line-height: 1.5;
  border-radius: 0.25rem;
  transition: color 0.15s ease-in-out, background-color 0.15s ease-in-out,
    border-color 0.15s ease-in-out, box-shadow 0.15s ease-in-out;
  color: #fff;
  box-shadow: none;
  outline: 0 !important;
  font-weight: ${props => (props.bold ? '600' : 'normal')};
  min-width: 100px;

  ${includeStyles(primary)}

  ${props => props.styling === 'brand' && includeStyles(brand)}
  ${props => props.styling === 'secondary' && includeStyles(secondary)}

  &&&:disabled {
    background-color: #5867dd;
    border-color: #5867dd;
  color: #fff;
    opacity: 0.65;
  }

  &:not(:disabled) {
    cursor: pointer;
  }

  ${props =>
    props.block &&
    css`
      width: 100%;
      display: block;
    `};

  ${props =>
    props.large &&
    css`
      padding-top: 0.85rem;
      padding-bottom: 0.85rem;
      padding-left: 2.25rem;
      padding-right: 2.25rem;
    `};

  ${props =>
    props.small &&
    css`
      padding: 0.5rem 1rem;
      font-size: 0.875rem;
      line-height: 1.5;
      border-radius: 0.2rem;
      min-width: 0;
    `};

  ${Spinner} {
    margin-right: 10px;
  }

  i {
    ${rtlMargin('7px', 0)}
    font-size: 0.6rem;
    font-style: normal;
    font-weight: normal;
    font-variant: normal;
    line-height: 2.1;
    display: inline-block;
    &:first-child {
      ${rtlMargin(0, '7px')}
    }
    ${props =>
      props.iconSize === 'lg' &&
      css`
        font-size: 1.2rem;
        line-height: 0;
      `}
  }
`;
