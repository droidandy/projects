// @flow
import React from 'react';
import styled from 'styled-components';

import type { InputProps } from 'redux-form';

import compose from 'recompose/compose';
import withHandlers from 'recompose/withHandlers';

const Container = styled.div`position: relative;`;

const FirstNameInput = styled.input`
  border: 1px solid #e1e1e1;
  border-radius: 4px 0 0 4px;
  background-color: white;
  width: 50%;
  box-sizing: border-box;
  padding: 0.25em 1em;

  &:focus,
  &:active {
    outline: none;
  }

  &::placeholder {
    color: #bcbec0;
  }
`;

const LastNameInput = styled.input`
  border: solid #e1e1e1;
  border-width: 1px 1px 1px 0;
  border-radius: 0 4px 4px 0;
  background-color: white;
  width: 50%;
  box-sizing: border-box;
  padding: 0.25em 1em;

  &:focus,
  &:active {
    outline: none;
  }

  &::placeholder {
    color: #bcbec0;
  }
`;

const enhance = compose(
  withHandlers({
    onFirstNameChange: props => event => {
      props.onChange({ ...props.input.value, first: event.target.value });
    },
    onLastNameChange: props => event => {
      props.onChange({ ...props.input.value, last: event.target.value });
    },
  })
);

type RecomposeProps = {
  onFirstNameChange: any => void,
  onLastNameChange: any => void,
};

type ExternalProps = {
  className?: string,
  input: InputProps,
};

type EnhancedType = Class<React$Component<void, ExternalProps, void>>;

const EnhancedComponent: EnhancedType = enhance((props: ExternalProps & RecomposeProps) => {
  const { className, input, onFirstNameChange, onLastNameChange } = props;

  return (
    <Container className={className}>
      <FirstNameInput
        type="text"
        value={input.value.first}
        onChange={onFirstNameChange}
        placeholder="First Name"
      />
      <LastNameInput
        type="text"
        value={input.value.last}
        onChange={onLastNameChange}
        placeholder="First Name"
      />
    </Container>
  );
});

export default EnhancedComponent;
