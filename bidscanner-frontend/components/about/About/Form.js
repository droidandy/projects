// @flow
import React from 'react';
import styled from 'styled-components';
import { reduxForm, Field } from 'redux-form';

import compose from 'recompose/compose';

import { Box } from 'grid-styled';
import BlackButton from 'components/styled/BlackButton';
import Input from 'components/forms-components/new/Input';
import Editor from 'components/forms-components/new/Editor';
import NameInput from './NameInput';

const Container = styled.div`
  width: 100%;
  max-width: 333px;
`;

const enhance = compose(
  reduxForm({
    form: 'contact-us',
  })
);

const FieldBox = styled(Box).attrs({ mb: 2 })``;

// type RecomposeProps = {};

type ExternalProps = void;

type EnhancedType = Class<React$Component<void, ExternalProps, void>>;

const EnhancedComponent: EnhancedType = enhance(() =>
  <Container>
    <FieldBox>
      <Field name="name" component={NameInput} />
    </FieldBox>
    <FieldBox>
      <Field name="email" component={Input} type="email" placeholder="email" />
    </FieldBox>
    <FieldBox>
      <Field name="message" component={Editor} placeholder="Your Message" infoText="Info about this field" />
    </FieldBox>
    <FieldBox mt={3}>
      <BlackButton>Contact Us</BlackButton>
    </FieldBox>
  </Container>
);

export default EnhancedComponent;
