import React from 'react';

import * as Styled from './navIconStyles';

import { Icon } from '~/components/atoms/icon/Icon';
import Theme from '~/theme';
import { colors } from '~/theme/colors';

type Props = {
  focused: boolean;
  name: string;
};

const colorScheme = [
  { color: colors.BrandBlue600, secondColor: colors.Green200 },
  { color: colors.White, secondColor: colors.Grey200 },
];

export const NavIcon = ({ focused, name }: Props): JSX.Element => (
  <Theme>
    <Styled.Container focused={focused}>
      <Icon name={name} size={24} {...colorScheme[Number(focused)]} />
    </Styled.Container>
  </Theme>
);
