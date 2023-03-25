import { API } from 'aws-amplify';
import * as React from 'react';
import { Text, View, StyleSheet, TextInput, ScrollView, Button, Image, Picker, Animated } from 'react-native';
import { TouchableOpacity } from 'react-native-gesture-handler';

export default function TradeScreen(): React.ReactElement {
  const [viewHeight, setViewHeight] = React.useState<number>(0);
  const [bounceValue] = React.useState<Animated.Value>(new Animated.Value(100));
  const [isPopupVisible, setIsPopupVisible] = React.useState<boolean>(false);
  const [popupError, setPopupError] = React.useState<boolean>(false);
  const [popupMsg, setPopupMsg] = React.useState<string>('');
  const [popupIsPreview, setPopupIsPreview] = React.useState<string>('');

  const [symbol, setSymbol] = React.useState<string>('');
  const [shares, setShares] = React.useState<string>('');
  const [action, setAction] = React.useState<string>('BUY');
  const [orderType, setOrderType] = React.useState<string>('MARKET');
  const [limitPrice, setLimitPrice] = React.useState<string>('');
  const [stopPrice, setStopPrice] = React.useState<string>('');

  console.log(
    `symbol: ${symbol}, shares: ${shares}, orderType: ${orderType}, action: ${action}, limitPrice: ${limitPrice}, stopPrice: ${stopPrice}`,
  );

  const lookupSymbol = async () => {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
    const result = await API.get('allofus', '/symbol-lookup/search', {
      queryStringParameters: { searchValue: symbol },
    });
    const mapped: string[] = result.map((item) => `${item.marketsymbol} - ${item.description1}`);
    console.log(mapped);
    alert(`Results:\n${mapped.join('\n')}`);
  };

  function createOrder() {
    return {
      symbol,
      transaction: action,
      orderType,
      quantity: Number(shares),
      limitPrice: Number(limitPrice),
      stopPrice: Number(stopPrice),
    };
  }

  async function previewOrder() {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
    const result = await API.post('allofus', '/trade/preview', { body: createOrder() });
    console.log('preview:', result);

    setPopupIsPreview(true);
    setPopupError(!!result.isError);
    setPopupMsg(result.isError ? result.message : `Expected order value: ${result.expectedQty * result.expectedPx}`);
    setIsPopupVisible(true);
  }

  async function placeOrder() {
    setIsPopupVisible(false);
    const result = await API.post('allofus', '/trade/place', { body: createOrder() });
    console.log('execute:', result);

    setPopupIsPreview(false);
    setPopupError(!!result.isError);
    setPopupMsg(result.isError ? result.message : 'Successful order execution!');
    setIsPopupVisible(true);
  }

  React.useEffect(() => {
    // Move popup when isPopupVisible is updated
    const aniVals: Animated.SpringAnimationConfig = {
      toValue: isPopupVisible ? -1000 + viewHeight / 10 : 0,
      velocity: 3,
      tension: 2,
      friction: 8,
      useNativeDriver: false,
    };
    Animated.spring(bounceValue, aniVals).start();
  }, [isPopupVisible]);

  return (
    <View style={{ height: '100%' }} onLayout={(event) => setViewHeight(event.nativeEvent.layout.height)}>
      <ScrollView style={styles.container}>
        <View style={styles.row}>
          <Text style={styles.label}>Symbol</Text>
          <View style={[styles.rightSide, { justifyContent: 'center', alignItems: 'center' }]}>
            <TextInput style={styles.input} value={symbol} onChangeText={setSymbol} />
            <TouchableOpacity onPress={lookupSymbol}>
              <Image style={styles.magnifyingGlass} source={require('~/assets/images/magnifying-glass.png')} />
            </TouchableOpacity>
          </View>
        </View>
        <View style={styles.row}>
          <Text style={styles.label}>Shares</Text>
          <TextInput style={[styles.input, styles.rightSide]} value={shares} onChangeText={setShares} />
        </View>
        <View style={styles.row}>
          <Text style={styles.label}>Action</Text>
          <Picker
            style={[styles.input, styles.rightSide]}
            selectedValue={action}
            onValueChange={(value) => setAction(value)}>
            <Picker.Item label="Buy" value="BUY" />
            <Picker.Item label="Sell" value="SELL" />
          </Picker>
        </View>
        <View style={styles.row}>
          <Text style={styles.label}>Order Type</Text>
          <Picker
            style={[styles.input, styles.rightSide]}
            selectedValue={orderType}
            onValueChange={(value) => setOrderType(value)}>
            <Picker.Item label="Market" value="MARKET" />
            <Picker.Item label="Limit" value="LIMIT" />
            <Picker.Item label="Stop" value="STOP" />
            <Picker.Item label="Stop Limit" value="STOP_LIMIT" />
          </Picker>
        </View>
        {(orderType === 'L' || orderType === 'SL') && (
          <View style={styles.row}>
            <Text style={styles.label}>Limit Price</Text>
            <TextInput style={[styles.input, styles.rightSide]} value={limitPrice} onChangeText={setLimitPrice} />
          </View>
        )}
        {(orderType === 'S' || orderType === 'SL') && (
          <View style={styles.row}>
            <Text style={styles.label}>Stop Price</Text>
            <TextInput style={[styles.input, styles.rightSide]} value={stopPrice} onChangeText={setStopPrice} />
          </View>
        )}
        <View style={{ margin: 20 }}>
          <Button title="Preview Order" onPress={previewOrder} />
        </View>
      </ScrollView>

      <Animated.View style={[styles.popup, { transform: [{ translateY: bounceValue }] }]}>
        <View style={{ padding: 20, alignItems: 'center' }}>
          <Text style={[styles.white, { fontWeight: 'bold', fontSize: 20 }]}>ORDER EXECUTION</Text>
        </View>
        <View style={styles.row}>
          {popupError && (
            <Text style={{ color: '#FF0000', fontWeight: 'bold', fontSize: 16, paddingLeft: 20 }}>ERROR:</Text>
          )}
          <Text style={[styles.white, { paddingLeft: 10 }]}>{popupMsg}</Text>
        </View>
        {!popupError && popupIsPreview && (
          <View style={{ padding: 20 }}>
            <Button title="Execute" onPress={placeOrder} />
          </View>
        )}
        <View style={{ padding: 20 }}>
          <Button title={popupIsPreview ? 'Cancel' : 'OK'} onPress={() => setIsPopupVisible(false)} />
        </View>
      </Animated.View>
    </View>
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
  rightSide: {
    flex: 2,
    flexDirection: 'row',
  },
  input: {
    borderWidth: 1,
    borderRadius: 5,
    flex: 1,
    height: 40,
  },
  magnifyingGlass: {
    width: 25,
    height: 25,
    marginLeft: 10,
  },
  popup: {
    position: 'absolute',
    top: 1000,
    left: '10%',
    right: '10%',
    backgroundColor: '#000000',
    borderRadius: 20,
    height: '80%',
    flexDirection: 'column',
  },
  white: { color: '#FFFFFF' },
});
