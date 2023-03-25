import React from 'react';

import * as s from './ErrorMessageStyles';

import Theme from '~/theme';

type Props = {
  label?: string;
  text?: string;
  type?: 'error'
};

export const ErrorMessage = ({
  type = 'error',
  label,
  text,
}: Props): JSX.Element => (
  <Theme>
    <s.Container>
      <s.Error name={type} size={28} color="red" />
      <s.Block>
        {label && <s.Label>{label}</s.Label>}
        {text && <s.Text>{text}</s.Text>}
      </s.Block>
    </s.Container>
  </Theme>
);
