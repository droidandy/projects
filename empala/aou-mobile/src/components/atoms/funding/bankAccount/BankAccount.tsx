import { get } from 'lodash';
import React, { useEffect } from 'react';
import { useSelector } from 'react-redux';

import * as Styled from './bankAccountStyles';

import { fallbackLogo } from '~/assets/images';
import { ActionTypes, CallbackType } from '~/components/StepContainer/types';
import { Endpoints } from '~/constants/endpoints';
import { useFetch } from '~/network/useFetch';
import { RootState } from '~/store/createStore';
import { AccountProps } from '~/types/account';

type Props = {
  callback?: CallbackType;
};

export const BankAccount = ({ callback }: Props): JSX.Element => {
  const { selectedAccount } = useSelector((state: RootState) => state.account.settings);

  const [{ response: bankAccounts, error, isLoading }, doFetch] = useFetch(Endpoints.bankAccounts);

  useEffect(() => {
    console.log('### selectedAccount:', selectedAccount);
    doFetch();
  }, [selectedAccount]);

  return (
    <Styled.Container>
      {(bankAccounts as AccountProps[]).map((bankAccount) => (
        <Styled.BankAccountItem
          key={bankAccount.id}
          onPress={() =>
            callback &&
            callback({
              type: ActionTypes.NEXT_SCREEN,
              args: { bankAccount },
            })
          }>
          <Styled.BankDetails>
            <Styled.BankLogo source={{ uri: `data:image/jpeg;base64,${bankAccount.logo || fallbackLogo}` }} />
            <Styled.BankName>
              {bankAccount.institutionName} - {bankAccount.accountNumber}
            </Styled.BankName>
          </Styled.BankDetails>

          <Styled.Amount>
            Available to withdraw {get(bankAccount, 'funds.available.formattedCurrency', 'Not Available')}
          </Styled.Amount>
        </Styled.BankAccountItem>
      ))}
    </Styled.Container>
  );
};
