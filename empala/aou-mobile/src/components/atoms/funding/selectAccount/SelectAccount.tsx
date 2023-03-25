import React from 'react';
import { useSelector } from 'react-redux';

import * as Styled from './selectAccountStyles';

import { Routes } from '~/app/home/navigation/routes';
import { ActionTypes, CallbackType } from '~/components/StepContainer/types';
import { RootState } from '~/store/createStore';

type Props = {
  callback?: CallbackType;
};

export const SelectAccount = ({ callback }: Props): JSX.Element => {
  const { selectedAccount } = useSelector((state: RootState) => state.account.settings);

  return (
    <Styled.Container
      onPress={() =>
        callback &&
        callback({
          type: ActionTypes.NAVIGATE,
          args: {
            route: Routes.AccountSelector,
            params: {},
          },
        })
      }>
      <Styled.Title>Account</Styled.Title>
      <Styled.AccountName>
        {`Brokerage Account [${selectedAccount && selectedAccount.apexAccountNumber}]`}
      </Styled.AccountName>
    </Styled.Container>
  );
};
