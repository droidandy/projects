import React from 'react';

import * as s from './styles';

import { ButtonWithIcon } from '~/components/atoms/buttonWithIcon';

type Props = {
  onBackPress?: () => void;
};

export const HeaderButtons = ({ onBackPress }: Props): JSX.Element => (
  <s.TitleIconsWrapper>
    <ButtonWithIcon
      icon="accountBalance"
      onPress={() => {}}
    />
    <ButtonWithIcon
      icon="search"
      onPress={() => {}}
    />
  </s.TitleIconsWrapper>
);
