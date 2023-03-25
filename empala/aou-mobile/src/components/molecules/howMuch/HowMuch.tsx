import { get } from 'lodash';
import React from 'react';
import { Text, TouchableWithoutFeedback, Keyboard, Platform } from 'react-native';

import * as Styled from './howMuchStyles';

import { ActionTypes, CallbackType } from '~/components/StepContainer/types';
import { SubmitButton } from '~/components/atoms/funding/submitButton';
import { AccountProps } from '~/types/account';

type Props = {
  callback?: CallbackType;
  bankAccount: AccountProps;
  isDeposit: boolean;
};

export const HowMuch = ({ callback, bankAccount, isDeposit }: Props): JSX.Element => {
  const [number, onChangeNumber] = React.useState('');
  const direction = isDeposit ? 'deposit' : 'withdraw';

  const onContinue = () => {
    callback &&
      callback({
        type: ActionTypes.NEXT_SCREEN,
        args: {
          isDeposit,
          amount: Number.parseInt(number, 10),
        },
      });
  };

  return (
    <Styled.Container behavior={Platform.OS === 'ios' ? 'padding' : 'height'} keyboardVerticalOffset={60}>
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <Styled.Content>
          <Styled.Amount>
            <Styled.Title>Enter an amount to {direction}: </Styled.Title>
            <Styled.Input
              placeholder="Enter amount"
              keyboardType="decimal-pad"
              value={number}
              onChangeText={onChangeNumber}
            />
            <Text>
              Available to {direction} {get(bankAccount, 'funds.available.formattedCurrency', 'Not Available')}
            </Text>
          </Styled.Amount>

          <SubmitButton title="CONTINUE" enabled={Boolean(number)} onSubmit={onContinue} />
        </Styled.Content>
      </TouchableWithoutFeedback>
    </Styled.Container>
  );
};
