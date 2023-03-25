import React from 'react';
import styled, { css } from 'styled-components';
import { ErrorMessage } from './ErrorMessage';

export interface InputProps
  extends React.InputHTMLAttributes<HTMLInputElement> {
  className?: string;
  label?: string;
  error?: React.ReactNode | null;
  multiline?: boolean;
}

const Label = styled.label`
  display: block;
  font-weight: 400;
  margin-bottom: 0.5rem;
`;

const StyledInput = styled.input`
  display: block;
  width: 100%;
  padding: 0 15px;
  line-height: 1.5;
  height: 40px;
  box-shadow: none !important;
  outline: 0;
  color: #495057;
  font-size: 16px;
  background-color: #fff;
  background-clip: padding-box;
  border: 1px solid #dee1e9;
  border-radius: 4px;
  font-size: 13px;
  transition: border-color 0.15s ease-in-out, box-shadow 0.15s ease-in-out;
  &&::placeholder {
    color: #808080;
    opacity: 1;
  }
  &:focus {
    color: #495057;
    background-color: #fff;
    border-color: #9aabff;
    outline: 0;
  }
`;

const _Input = React.forwardRef((props: InputProps, ref) => {
  const { className, label, error, multiline, style = {}, ...rest } = props;
  return (
    <div className={className}>
      {label && <Label>{label}</Label>}
      <StyledInput
        ref={ref as any}
        {...rest}
        as={multiline ? 'textarea' : 'input'}
        style={
          multiline
            ? {
                ...style,
                padding: '15px',
                minHeight: 100,
              }
            : style
        }
      />
      {error && <ErrorMessage>{error}</ErrorMessage>}
    </div>
  );
});

export const Input = styled(_Input)`
  width: 100%;
  display: block;
  ${props =>
    props.error &&
    css`
      ${StyledInput} {
        border-color: #dc3545;
        &:focus {
          box-shadow: 0 0 0 3px rgba(220, 53, 69, 0.25);
        }
      }
    `};
  ${props =>
    props.type === 'file' &&
    css`
      ${StyledInput} {
        padding: 10px;
      }
    `}
`;
