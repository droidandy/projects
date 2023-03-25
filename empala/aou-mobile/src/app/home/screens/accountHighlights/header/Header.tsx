import React from 'react';

import * as s from './styles';

import { ProfileItem } from '~/app/profile/components/ProfileItem';
import { ButtonWithIcon } from '~/components/atoms/buttonWithIcon';

type Props = {
  onBackPress: () => void;
};

export const Header = ({ onBackPress }: Props): JSX.Element => {
  return (
    <s.Wrapper>
      <ButtonWithIcon
        icon="backArrow"
        color="black"
        onPress={onBackPress}
      />
      <s.TitleWrapper>
        <s.Title>
          <s.TitleMain>Account Highlights</s.TitleMain>
          <s.TitleSecond>Retirement</s.TitleSecond>
        </s.Title>
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
      </s.TitleWrapper>
    </s.Wrapper>
  );
};
