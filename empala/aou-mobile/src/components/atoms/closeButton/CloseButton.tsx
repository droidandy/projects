import React from 'react';

import * as s from './closeButtonStyles';

import { CloseIcon } from '~/assets/icons/Icons';
import Theme from '~/theme';

type Props = {
  onPress: () => void,
  lightMode?: boolean,
};

export const CloseButton = ({ onPress, lightMode }: Props): JSX.Element => (
  <Theme>
    <s.Container onPress={onPress} lightMode={lightMode}>
      <CloseIcon />
    </s.Container>
  </Theme>
);
