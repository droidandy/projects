import React, { useEffect } from 'react';
import { View, TouchableOpacity, ActivityIndicator } from 'react-native';

import { BankAccount } from '~/components/atoms/account';
import { Endpoints } from '~/constants/endpoints';
import { useFetch } from '~/network/useFetch';
import { AccountProps } from '~/types/account';

type Props = {
  selectedAccount: AccountProps;
  onPress: (account: AccountProps) => void;
};

export const BankAccountsList = ({ selectedAccount, onPress }: Props): JSX.Element => {
  const [{ response, error, isLoading }, doFetch] = useFetch(Endpoints.bankAccounts);

  useEffect(() => {
    doFetch();
  }, [selectedAccount]);

  const bankAccounts = response && (response as Array<AccountProps>);

  if (!bankAccounts || isLoading) {
    return <ActivityIndicator size="large" color="#00ff00" />;
  }

  return (
    <View>
      {bankAccounts.map((bankAccount) => (
        <TouchableOpacity key={bankAccount.id} style={{ paddingVertical: 20 }} onPress={() => onPress(bankAccount)}>
          <BankAccount account={bankAccount} />
        </TouchableOpacity>
      ))}
    </View>
  );
};
