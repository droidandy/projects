/* eslint-disable linebreak-style */
/* eslint-disable @typescript-eslint/no-use-before-define */

import Amplify, { API } from 'aws-amplify';
import * as React from 'react';
import { Text, View, StyleSheet, TextInput, ScrollView, Button, Picker } from 'react-native';

import sockets from '../../utils/sockets';

const API_NAME = 'allofus';

export default function TabTwoScreen(): React.ReactElement {
  const [symbol, setSymbol] = React.useState<string>('');
  const [shares, setShares] = React.useState<string>('');
  const [action, setAction] = React.useState<string>('B');
  const [orderType, setOrderType] = React.useState<string>('M');
  const [limitPrice, setLimitPrice] = React.useState<string>('');
  const [stopPrice, setStopPrice] = React.useState<string>('');
  const [spy, setSpy] = React.useState<string>('');

  console.log(
    `symbol: ${symbol}, shares: ${shares}, orderType: ${orderType}, action: ${action}, limitPrice: ${limitPrice}, stopPrice: ${stopPrice}`,
  );

  React.useEffect(() => {
    sockets.connect((quote) => setSpy(quote.price.toString()));
  }, []);

  const previewOrder = async () => {
    console.log('executing', symbol);
    const x = await API.get(API_NAME, '/investments-portfolio/me/positions', {});
    console.log(x);
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.row}>
        <Text style={styles.label}>Symbol</Text>
        <TextInput style={styles.input} value={symbol} onChangeText={setSymbol} />
      </View>
      <View style={styles.row}>
        <Text style={styles.label}>Shares</Text>
        <TextInput style={styles.input} value={shares} onChangeText={setShares} />
      </View>
      <View style={styles.row}>
        <Text style={styles.label}>Action</Text>
        <Picker style={styles.input} selectedValue={action} onValueChange={(value) => setAction(value)}>
          <Picker.Item label="Buy" value="B" />
          <Picker.Item label="Sell" value="S" />
          <Picker.Item label="Sell Short" value="SS" />
          <Picker.Item label="Buy to Cover" value="BC" />
        </Picker>
      </View>
      <View style={styles.row}>
        <Text style={styles.label}>Order Type</Text>
        <Picker style={styles.input} selectedValue={orderType} onValueChange={(value) => setOrderType(value)}>
          <Picker.Item label="Market" value="M" />
          <Picker.Item label="Limit" value="L" />
          <Picker.Item label="Stop" value="S" />
          <Picker.Item label="Stop Limit" value="SL" />
        </Picker>
      </View>
      {(orderType === 'L' || orderType === 'SL') && (
        <View style={styles.row}>
          <Text style={styles.label}>Limit Price</Text>
          <TextInput style={styles.input} value={limitPrice} onChangeText={setLimitPrice} />
        </View>
      )}
      {(orderType === 'S' || orderType === 'SL') && (
        <View style={styles.row}>
          <Text style={styles.label}>Stop Price</Text>
          <TextInput style={styles.input} value={stopPrice} onChangeText={setStopPrice} />
        </View>
      )}
      <View style={{ margin: 20 }}>
        <Button title="Preview Order" onPress={previewOrder} />
      </View>
      <View style={styles.row}>
        <Text style={styles.label}>Price of SPY:</Text>
        <TextInput style={styles.input} value={spy} onChangeText={setSpy} />
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: 'white',
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  row: {
    flexDirection: 'row',
    margin: 10,
  },
  label: {
    fontWeight: 'bold',
    padding: 10,
    flex: 1,
  },
  input: {
    borderWidth: 1,
    borderRadius: 5,
    flex: 2,
  },
});
