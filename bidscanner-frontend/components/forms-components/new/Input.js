/* @flow */
import React from 'react';
import styled from 'styled-components';

import type { MetaProps, InputProps } from 'redux-form';

import InfoIcon from './InfoIcon';

const Container = styled.div`
  display: inline-flex;
  position: relative;
  border: 1px solid #e1e1e1;
  border-radius: 4px;
  padding: 0.25em ${props => (props.infoText ? '1.5em' : '1em')} 0.25em 1em;
  width: 100%;
`;

// const IconWrapper = styled.div`
//   display: flex;
//   align: center;
//   margin-right: 5px;
//   padding-top: 3px;
// `;

const Input = styled.input`
  position: relative;
  border: 0 none;
  background-color: transparent;
  width: 100%;
  padding: 0 1px;

  &:focus,
  &:active {
    outline: none;
  }

  &::placeholder {
    color: #bcbec0;
  }
`;

const PseudoInputValue = styled.span`
  position: relative;
  padding: 0 1px;
  width: 100%;
  cursor: text;

  &:empty:before {
    content: '\u200b';
  }
`;

const Error = styled.span`
  color: #ff2929;
  font-size: 12px;
`;

const InputContainer = styled.div`
  text-align: center;
  width: 100%;
`;

const PseudoPlaceholder = styled(PseudoInputValue)`color: #bcbec0;`;

const PseudoInput = props => {
  const { value, placeholder, ...restProps } = props;

  return !value && placeholder ? (
    <PseudoPlaceholder {...restProps}>{placeholder}</PseudoPlaceholder>
  ) : (
    <PseudoInputValue {...restProps}>{value}</PseudoInputValue>
  );
};

type Props = {
  infoText?: string,
  className?: string,
  pseudo?: boolean,
  input?: InputProps,
  meta?: MetaProps,
};

export default (props: Props) => {
  const { input, className, pseudo, infoText, meta: { touched, error }, ...restProps } = props;

  return (
    <InputContainer>
      <Container className={className} infoText={infoText}>
        {infoText && <InfoIcon text={infoText} />}
        {pseudo ? <PseudoInput {...input} {...restProps} /> : <Input {...input} {...restProps} />}
      </Container>
      {touched && (error && <Error>{error}</Error>)}
    </InputContainer>
  );
};
