/* @flow */
import React from 'react';
import styled from 'styled-components';

import type { MetaProps, InputProps } from 'redux-form';

import InfoIcon from './InfoIcon';

const Container = styled.div`
  display: inline-flex;
  position: relative;
  padding: 0.15em ${props => (props.infoText ? '1.5em' : '0')} 0 0;
`;

const Input = styled.input`margin-right: 8px;`;

const Label = styled.label`
  margin: 0;
  position: relative;
`;

type Props = {
  label: string,
  infoText?: string,
  className?: string,
  input?: InputProps,
  meta?: MetaProps,
};

export default (props: Props) => {
  const { input, className, label, infoText, ...restProps } = props;

  return (
    <Container className={className} infoText={infoText}>
      {infoText && <InfoIcon text={infoText} />}
      <Label>
        <Input {...input} {...restProps} type="checkbox" />
        {label}
      </Label>
    </Container>
  );
};
