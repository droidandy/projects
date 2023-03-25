import { Picker } from '@react-native-picker/picker';
import React from 'react';
import { View, Text, Button, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useDispatch, useSelector } from 'react-redux';
import { Routes } from '~/app/home/navigation/routes';

import { actions } from '~/store/accountReducer';
import { RootState } from '~/store/createStore';
import { AccountProps } from '~/types/account';

export const AccountSelector = ({ navigation }) => {
  const dispatch = useDispatch();
  const { accounts, selectedAccount } = useSelector((state: RootState) => state.account.settings);

  const dispatchChange = (itemValue: number) => {
    const newSelectedAccount = accounts.find((acc) => {
      const account = acc;
      return account.id === itemValue;
    }) as AccountProps;
    dispatch(actions.settings.setSelectedAccount(newSelectedAccount));
  };

  const renderPickerItems = () =>
    accounts.map((acc) => {
      const account = acc;
      return <Picker.Item key={account.id} label={account.apexAccountNumber} value={account.id} />;
    });

  const addNewAccount = () => {
    navigation.navigate(Routes.NewAccountFlow);
  };

  return (
    <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
      <TouchableOpacity style={{ flex: 1, width: '100%' }} onPress={() => navigation.goBack()} />
      <SafeAreaView style={{ width: '100%', backgroundColor: 'white' }} edges={['bottom', 'right', 'left']}>
        <View style={{ flexDirection: 'row', backgroundColor: '#E1E4EA', paddingVertical: 15 }}>
          <Text
            style={{
              fontSize: 30,
              textAlign: 'center',
              flex: 1,
            }}>
            Account
          </Text>
        </View>

        <Picker
          selectedValue={selectedAccount.id}
          style={{ height: 200, width: '100%' }}
          onValueChange={(itemValue, itemIndex) => dispatchChange(itemValue)}>
          {renderPickerItems()}
        </Picker>
        <Button color="#55a333" onPress={addNewAccount} title="Add new account" />
      </SafeAreaView>
    </View>
  );
};
