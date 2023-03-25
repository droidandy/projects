import * as React from 'react';
import { Text, View, StyleSheet, TextInput, ScrollView } from 'react-native';

import sockets, { Quote } from '../../../utils/sockets';

export default function WatchListScreen(): React.ReactElement {
  const [spy, setSpy] = React.useState<string>('');
  const [dia, setDia] = React.useState<string>('');
  const [qqq, setQqq] = React.useState<string>('');

  React.useEffect(() => {
    sockets.connect((quote: Quote) => {
      switch (quote.symbol) {
        case 'SPY':
          setSpy(quote.price.toString());
          break;
        case 'DIA':
          setDia(quote.price.toString());
          break;
        case 'QQQ':
          setQqq(quote.price.toString());
          break;
        default:
      }
    });
  }, []);

  return (
    <ScrollView style={styles.container}>
      <View style={styles.row}>
        <Text style={styles.label}>SPY:</Text>
        <TextInput style={styles.input} value={spy} onChangeText={setSpy} />
      </View>
      <View style={styles.row}>
        <Text style={styles.label}>DIA:</Text>
        <TextInput style={styles.input} value={dia} onChangeText={setDia} />
      </View>
      <View style={styles.row}>
        <Text style={styles.label}>QQQ:</Text>
        <TextInput style={styles.input} value={qqq} onChangeText={setQqq} />
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: 'white',
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
