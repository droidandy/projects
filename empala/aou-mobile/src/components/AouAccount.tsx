import React from 'react';
import { Text, StyleSheet } from 'react-native';

type Props = {
  selectedAccount: string;
};

export const AouAccount = ({ selectedAccount }: Props): JSX.Element => {
  const accountTypes = {
    ROTH: 'Roth IRA',
    TRADITIONAL: 'Traditional IRA',
    CASH: 'Cash',
    MARGIN: 'Margin',
  };
  return <Text style={styles.title}>All of Us - {accountTypes[selectedAccount]} account</Text>;
};

const styles = StyleSheet.create({
  title: { fontWeight: '300', fontSize: 22, marginBottom: 20 },
});
