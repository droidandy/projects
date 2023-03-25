import React, { FC } from 'react';
import { Alert } from 'react-native';

import * as s from './AccountsStyles';

import { HomeNavProps } from '~/app/home/navigation/types';
import { Button } from '~/components/atoms/button';

type Props = {
  navigation: HomeNavProps;
};

export const Accounts: FC<Props> = ({ navigation }) => {
  const errorMessage = () => {
    Alert.alert(
      'We’re sorry!',
      'We’re unable to support opening your account at this time. We’re working hard to enhance our offering.',
      [
        { text: 'OK', onPress: () => navigation.goBack() },
      ],
    );
  };
  return (
    <s.SafeArea>
      <s.Container>
        <s.Title>
          Start trading
          {'\n'}
          in no time!
        </s.Title>

        <s.SubTitle>
          In order to start trading, you have to upgrade and be eligible for trading.
          {' '}
          We will guide you through and it should take about 5 min.
        </s.SubTitle>
      </s.Container>

      <Button
        disabled={false}
        title="Let’s go"
        face="blue"
        onPress={errorMessage}
      />
    </s.SafeArea>
  );
};
