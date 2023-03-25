import React from 'react';
import { TouchableWithoutFeedback, Keyboard, Platform } from 'react-native';
import { useSelector } from 'react-redux';


import * as Styled from './allSetStyles';

import { AouAccount } from '~/components/AouAccount';
import { BankAccount } from '~/components/BankAccount';
import { CallbackType } from '~/components/StepContainer/types';
import { SubmitButton } from '~/components/atoms/funding/submitButton';
import { RootState } from '~/store/createStore';
import { AccountProps } from '~/types/account';
import { toCurrency } from '~/utils/formatter';

type Props = {
  callback?: CallbackType;
  bankAccount: AccountProps;
  isDeposit: boolean;
  amount: number;
};

export const AllSet = ({ callback, bankAccount, isDeposit, amount }: Props): JSX.Element => {
  const { selectedAccount } = useSelector((state: RootState) => state.account.settings);

  const onContinue = () => {
    // callback && callback({
    //   type: ActionTypes.NEXT_SCREEN, args: {
    //   }
    // });
  };

  return (
    <Styled.Container behavior={Platform.OS === 'ios' ? 'padding' : 'height'} keyboardVerticalOffset={60}>
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <Styled.Content>
          <Styled.Content2>
            <Styled.Title>From</Styled.Title>
            {isDeposit ? (
              <BankAccount bankAccount={bankAccount} />
            ) : (
              selectedAccount && <AouAccount selectedAccount={selectedAccount.type} />
            )}

            <Styled.Title>To</Styled.Title>
            {isDeposit ? (
              selectedAccount && <AouAccount selectedAccount={selectedAccount.type} />
            ) : (
              <BankAccount bankAccount={bankAccount} />
            )}

            <Styled.Title>Amount</Styled.Title>
            <Styled.Amount>{toCurrency(amount)}</Styled.Amount>
          </Styled.Content2>

          <SubmitButton title="Submit" enabled onSubmit={onContinue} />
        </Styled.Content>
      </TouchableWithoutFeedback>
    </Styled.Container>
  );
};
