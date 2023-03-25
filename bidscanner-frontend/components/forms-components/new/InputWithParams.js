/* @flow */
import React, { type Children } from 'react';
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

function createDropdown(element: React$Element<*>, input: {}): React$Element<*> {
  const { subfield } = element.props;

  if (!subfield) {
    throw new Error('Please provide subfield name for InputWithParams');
  }

  return React.cloneElement(element, {
    subfield: undefined,
    value: input.value[subfield],
    onChange: value => input.onChange({ ...input.value, [subfield]: value }),
  });
}

type Props = {
  infoText?: string,
  className?: string,
  input: InputProps,
  meta?: MetaProps,
  children: Children,
};

export default (props: Props) => {
  const { input, className, infoText, children, ...restProps } = props;

  return (
    <Container className={className} infoText={infoText}>
      {infoText && <InfoIcon text={infoText} />}
      <Input
        {...restProps}
        value={input.value.value}
        onChange={event => input.onChange({ ...input.value, value: event.target.value })}
      />
      {React.Children.map(children, child => createDropdown(child, input))}
    </Container>
  );
};
