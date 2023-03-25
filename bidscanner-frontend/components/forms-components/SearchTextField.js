// @flow
import React from 'react';
import styled from 'styled-components';
import type { MetaProps, InputProps } from 'redux-form';

const Input = styled.span`
  & input[type='text'] {
    box-sizing: border-box;
    width: 100%;
    font-size: ${props => (props.header ? '15px' : '26px')};
    font-weight: bold;
    padding: 0px 0px;
    padding-bottom: ${props => (props.header ? '3px' : '0px')};
    border: none;
    @media (max-width: 1024px) {
      font-weight: normal;
      font-size: ${props => (props.header ? '0.8em' : '1em')};
    }

    &:active,
    &:focus {
      outline: none;
    }

    &::placeholder {
      font-size: 14px;
      font-style: italic;
      font-weight: normal;
      color: #bcbec0;
    }

    border-bottom: 1px solid #e1e1e1;
  }
  width: 100%;
`;

type PropsFromField = {
  type: string,
  placeholder?: string,
  meta: MetaProps,
  input: InputProps,
};

const moveCaretAtEnd = e => {
  const value = e.target.value;
  e.target.value = '';
  e.target.value = value;
};

export default (field: PropsFromField) => (
  <Input header={field.header}>
    <input
      type="text"
      placeholder={field.placeholder}
      {...field.input}
      ref={input => input && field.autofocus && input.focus()}
      onFocus={moveCaretAtEnd}
    />
  </Input>
);
