import * as React from 'react';
import styled, { css } from 'styled-components';
import { rtlTextLeft, rtlLeft, rtlPadding } from 'shared/rtl';

interface CheckboxProps extends React.InputHTMLAttributes<HTMLInputElement> {
  className?: string;
  children?: React.ReactNode;
  radio?: boolean;
  noMargin?: boolean;
}

const _Checkbox = (props: CheckboxProps) => {
  const { className, children, style, radio, noMargin, ...rest } = props;
  return (
    <label className={className} style={style}>
      <input type="checkbox" {...rest} />
      {children}
      <span />
    </label>
  );
};

export const Checkbox = styled(_Checkbox)`
  ${rtlTextLeft()}
  ${rtlPadding('30px', '0')}
  display: block;
  position: relative;
  margin-bottom: ${props => (props.noMargin ? null : '10px')};
  ${props =>
    !props.children &&
    css`
      height: 18px;
      width: 18px;
      padding: 0;
    `}
  cursor: pointer;
  transition: all 0.3s ease;
  input {
    position: absolute;
    z-index: -1;
    opacity: 0;
  }
  & > span {
    border: 1px solid #d1d7e2;
    border-radius: ${props => (props.radio ? '100%' : '3px')};
    background: none;
    position: absolute;
    top: 1px;
    height: 18px;
    width: 18px;
    ${rtlLeft(0)}
    ${props =>
      !props.radio &&
      css`
        &:after {
          content: '';
          position: absolute;
          display: none;
          top: 50%;
          left: 50%;
          margin-left: -2px;
          margin-top: -6px;
          width: 5px;
          height: 10px;
          border-width: 0 2px 2px 0 /*rtl:ignore*/ !important;
          transform: rotate(45deg) /*rtl:ignore*/;
          border: solid #bfc7d7;
        }
      `}
    ${props =>
      props.radio &&
      css`
        &:after {
          content: '';
          position: absolute;
          display: none;
          top: 50%;
          left: 50%;
          margin-left: -3px;
          margin-top: -3px;
          width: 6px;
          height: 6px;
          border-radius: 100% !important;
          border: solid #bfc7d7;
          background: #bfc7d7;
        }
      `}
  }
  input:checked ~ span:after {
    display: block;
  }
`;
