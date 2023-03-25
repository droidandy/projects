import React from 'react';
import { Text, StyleSheet, View, Image } from 'react-native';

import { fallbackLogo } from '~/assets/images';

type Props = {
  bankAccount: {
    logo: string;
    institutionName: string;
    accountNumber: string;
  };
};

export const BankAccount = ({ bankAccount }: Props): JSX.Element => (
  <View style={styles.container}>
    <Image
      source={{ uri: `data:image/jpeg;base64,${bankAccount.logo || fallbackLogo}` }}
      style={{ width: 48, height: 48 }}
    />
    <Text style={styles.title}>
      {bankAccount.institutionName} - {bankAccount.accountNumber}
    </Text>
  </View>
);

const styles = StyleSheet.create({
  container: { flexDirection: 'row', alignItems: 'center', marginBottom: 20 },
  title: { marginLeft: 20 },
});
