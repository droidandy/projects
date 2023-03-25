import React, { useEffect } from 'react';
import {
  StyleSheet, View, Text, FlatList, ScrollView, RefreshControl,
} from 'react-native';

import { Endpoints } from '~/constants/endpoints';
import { ItemProps } from '~/network/responses';
import { useFetch } from '~/network/useFetch';

type Props = { item: ItemProps };

const Item = ({
  symbol, companyName, marketValue, percentChange,
}: ItemProps) => (
  <View style={styles.item}>
    <View>
      <Text style={styles.title}>{symbol}</Text>
      <Text style={styles.subTitle}>{companyName}</Text>
    </View>
    <View style={styles.stub} />
    <View style={styles.itemColumn}>
      <Text style={styles.itemPrice}>{marketValue.shortFormattedCurrency}</Text>
    </View>
    <View style={styles.itemColumn}>
      <Text style={percentChange && percentChange.value >= 0 ? styles.itemPricePositive : styles.itemPriceNegative}>
        {percentChange && percentChange.formattedPercent}
      </Text>
    </View>
  </View>
);

const EmptyComponent = () => (
  <View style={styles.emptyContainer}>
    <Text style={styles.noDataTitle}>No open positions</Text>
  </View>
);

export const Positions = (): JSX.Element => {
  const [{ response, error, isLoading }, doFetch] = useFetch(Endpoints.positions);

  useEffect(() => {
    doFetch();
  }, [doFetch]);

  useEffect(() => {
    if (response) {
      console.log('### Positions -->', response);
    }
  }, response);

  const renderItem = ({ item }: Props) => (
    <Item
      symbol={item.symbol}
      marketValue={item.marketValue}
      companyName={item.companyName}
      percentChange={item.percentChange}
    />
  );

  return (
    <View style={styles.container}>
      <ScrollView refreshControl={<RefreshControl refreshing={isLoading} onRefresh={doFetch} />}>
        <ScrollView horizontal>
          <FlatList
            data={response as ItemProps[]}
            renderItem={renderItem}
            keyExtractor={(item) => item.symbol}
            style={styles.flatList}
            ListEmptyComponent={EmptyComponent()}
          />
        </ScrollView>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  emptyContainer: {
    marginVertical: 100,
  },
  flatList: {
    width: '100%',
  },
  noDataTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: 'black',
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    color: 'white',
  },
  subTitle: {
    fontSize: 16,
    fontWeight: 'normal',
    color: 'white',
  },
  separator: {
    marginVertical: 30,
    height: 1,
    width: '80%',
  },
  item: {
    flex: 1,
    flexDirection: 'row',
    backgroundColor: '#000',
    padding: 20,
    marginVertical: 2,
    marginHorizontal: 16,
    width: 340,
  },
  itemTitle: {},
  itemPrice: {
    color: 'white',
  },
  itemPricePositive: {
    color: 'lime',
  },
  itemPriceNegative: {
    color: 'red',
  },
  itemColumn: {
    width: 68,
    justifyContent: 'center',
    alignItems: 'flex-end',
  },
  stub: {
    flex: 1,
  },
});
