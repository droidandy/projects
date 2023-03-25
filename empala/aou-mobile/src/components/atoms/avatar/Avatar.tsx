import React from 'react';
import { FastImageProps } from 'react-native-fast-image';

import * as s from './avatarStyles';

import Theme from '~/theme';

interface Props extends FastImageProps {
  name?: string;
}

export const Avatar = ({ name, ...props }: Props): JSX.Element => (
  <Theme>
    <s.Container>
      {props.source && <s.Avatar {...props} />}
      {name && <s.Name>{`@ ${name}`}</s.Name>}
    </s.Container>
  </Theme>
);
