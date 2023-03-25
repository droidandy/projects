import React from 'react';

import { Order, OrderStatus, TradeType } from '~/app/home/types/trade';
import { ImagePlaceholder } from '~/assets/icons/lib/imagePlaceholder';

export const ordersGenerator = (prefix: string, count: number, dateK: number): Order[] => {
  const orderStatus = [OrderStatus.failed, OrderStatus.open, OrderStatus.filled, OrderStatus.canceled];
  const orderType = [TradeType.buy, TradeType.sell];
  const currentDate = new Date();

  return Array(count).fill(null).map((_, index) => ({
    id: `${prefix}${index}`,
    company: {
      name: 'Apple',
      sym: 'AAPL',
      image: <ImagePlaceholder />,
    },
    type: orderType[Math.floor(Math.random() * orderType.length)],
    status: orderStatus[Math.floor(Math.random() * orderStatus.length)],
    statusDate: new Date(Number(currentDate) - dateK),
    shares: 1,
    value: Math.floor(Math.random() * 500 - 250),
  }));
};
