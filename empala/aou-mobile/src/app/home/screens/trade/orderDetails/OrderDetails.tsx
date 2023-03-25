import { RouteProp } from '@react-navigation/native';
import React from 'react';

import { OrderBuy } from './OrderBuy';
import { OrderSell } from './OrderSell';

import { Routes } from '~/app/home/navigation/routes';
import { TradeParamList } from '~/app/home/navigation/types';
import { TradeType } from '~/app/home/types/trade';

type Props = {
  route: RouteProp<TradeParamList, Routes.OrderDetails>;
};

export const OrderDetails = ({ route }: Props): JSX.Element => {
  const order = route.params?.order;

  switch (order.type) {
    case TradeType.buy:
      return <OrderBuy order={order} />;
    case TradeType.sell:
      return <OrderSell order={order} />;
    default:
      return <OrderSell order={order} />;
  }
};
