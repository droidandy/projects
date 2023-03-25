import React from 'react';

import * as s from './linkButtonStyles';

import Theme from '~/theme';

type Props = {
  title: string;
  onPress?: () => void;
};

export const LinkButton = ({ title, onPress }: Props): JSX.Element => (
  <Theme>
    <s.LinkButton onPress={onPress}>
      {title}
    </s.LinkButton>
  </Theme>
);
