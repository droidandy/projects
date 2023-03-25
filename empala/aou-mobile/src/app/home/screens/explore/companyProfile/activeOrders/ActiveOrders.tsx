import { useNavigation } from '@react-navigation/native';
import React, { useCallback } from 'react';

import * as s from './styles';

import { Routes } from '~/app/home/navigation/routes';
import { Tab } from '~/app/home/screens/accountHighlights/types';
import { Order as OrderType } from '~/app/home/screens/explore/companyProfile/mocks';
import { Order } from '~/app/home/screens/explore/companyProfile/order';
import { Icon } from '~/components/atoms/icon';

type Props = {
  orders: OrderType[];
};

const DEBUG_MODE = true;

export const ActiveOrders = ({ orders }: Props): JSX.Element => {
  const navigation = useNavigation();
  const handleOrderSelect = useCallback(
    (order) => navigation.navigate(Routes.Trade, {
      screen: Routes.OrderDetails,
      params: { order },
    }),
    [navigation],
  );

  const handleAllOrdersNavigate = useCallback(() => {
    navigation.navigate(Routes.Trade, {
      screen: Routes.AccountHighlights,
      params: { initialTab: Tab.orderHistory },
    });
  }, [navigation]);

  return (
    <s.Wrapper>
      <s.Header>
        <s.HeaderLabel debug={DEBUG_MODE}>Active Orders</s.HeaderLabel>
        <s.HeaderArrow onPress={handleAllOrdersNavigate}>
          <Icon name="rightArrow" color={DEBUG_MODE ? 'black' : 'white'} width={11} />
        </s.HeaderArrow>
      </s.Header>
      <s.Content>
        {orders.map((order) => <Order key={order.id} order={order} onPress={handleOrderSelect} />)}
      </s.Content>
    </s.Wrapper>
  );
};
