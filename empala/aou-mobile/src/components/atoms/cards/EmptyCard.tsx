import React from 'react';

import { Icon } from '../icon';

import * as s from './emptyCardStyles';
import { EmptyCardTypes } from './types';

import Theme, { theme } from '~/theme';

export type EmptyCardProps = {
  type?: EmptyCardTypes;
  first?: boolean;
  onPress?: () => void;
};

export const EmptyCard = ({
  type = EmptyCardTypes.Default,
  first,
  onPress,
}: EmptyCardProps): JSX.Element => (
  <Theme>
    <s.Container type={type} first={first} onPress={onPress}>
      <Icon name="plus" size={24} color={theme.colors.White} />
    </s.Container>
  </Theme>
);
