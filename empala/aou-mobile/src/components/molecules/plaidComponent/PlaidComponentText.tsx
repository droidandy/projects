import React from 'react';
import { View, Text } from 'react-native';

export const PlaidComponentText = (): JSX.Element => (
  <View style={{ marginHorizontal: 20 }}>
    <Text style={{ fontWeight: '500', fontSize: 24, color: '#55a333' }}>Add bank account</Text>
    <Text style={{ fontWeight: '300', fontSize: 16, color: '#575757' }}>
      We use Plaid to link your bank account. In order to fulfill our regulatory obligations, we can only establish a
      link with institutions that allow us to verify a name match. If your bank or credit union does not populate in the
      Plaid interface, we are unable to set up a link at this time.
    </Text>
  </View>
);
