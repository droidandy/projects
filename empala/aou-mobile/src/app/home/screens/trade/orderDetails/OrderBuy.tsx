import React, { useEffect, createRef } from 'react';
import {
  FlatList, RefreshControl,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import * as s from './orderDetailsStyles';

import { OrderStatus, Order } from '~/app/home/types/trade';
import { Button } from '~/components/atoms/button';
import { Icon } from '~/components/atoms/icon';
import Theme from '~/theme';

const wait = (timeout: number) => new Promise((resolve) => {
  setTimeout(resolve, timeout);
});

const DATA = [
  { title: 'Status', value: 'Open' },
  { title: 'Price', value: '$214.5' },
  { title: 'Number of shares', value: '1' },
  { title: 'Order type', value: 'Limit @ $210' },
  { title: 'Time In Force', value: 'Day' },
  { title: 'Trade ID', value: '123456AS' },
  { title: 'Account', value: 'Retirement' },
];

type Props = {
  order: Order;
};

export const OrderBuy = ({ order }: Props): JSX.Element => {
  const [refreshing, setRefreshing] = React.useState(false);

  const onRefresh = React.useCallback(() => {
    setRefreshing(true);

    wait(2000).then(() => {
      setRefreshing(false);
    }).catch(() => {});
  }, []);

  const flatlistRef = createRef<FlatList<unknown> | undefined>();
  useEffect(() => {
    flatlistRef.current?.scrollToOffset({
      animated: false,
      offset: -200,
    });
  }, []);

  const headerComponent = () => (
    <s.HeaderContainer>
      <s.TitleContainer>
        <s.Title>
          BUY LIMIT
          {' '}
          <s.TitleGrey>
            AAPL
          </s.TitleGrey>
        </s.Title>

        <Icon name="orderType" size={27} />
      </s.TitleContainer>

      <s.SubTitle>-$210</s.SubTitle>
      <s.NoteContainer>
        <s.NoteTitle> 1.3 shares @ $214.5 / share </s.NoteTitle>
        <s.NoteTitle> 2021.12.28 16:30 </s.NoteTitle>
      </s.NoteContainer>
    </s.HeaderContainer>
  );

  const footerComponent = () => (
    <s.FooterContainer />
  );

  const renderItem = ({ item }: { item: { title: string, value: string } }) => (
    <s.ItemContainer>
      <s.ItemText>{item.title}</s.ItemText>
      <s.ItemValue>{item.value}</s.ItemValue>
    </s.ItemContainer>
  );

  return (
    <Theme>
      <SafeAreaView edges={['top', 'bottom']}>
        <s.FlatList
          ref={flatlistRef}
          showsVerticalScrollIndicator={false}
          initialNumToRender={2}
          data={DATA}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
            }
          keyExtractor={(item) => item.value}
          ListHeaderComponent={headerComponent}
          ListFooterComponent={footerComponent}
          renderItem={renderItem}
          ItemSeparatorComponent={() => <s.Separator />}
        />
        {order.status === OrderStatus.open && (
        <s.Btn>
          <Button
            title="Cancel order"
            face="blue"
          />
        </s.Btn>
        )}
      </SafeAreaView>
    </Theme>
  );
};
