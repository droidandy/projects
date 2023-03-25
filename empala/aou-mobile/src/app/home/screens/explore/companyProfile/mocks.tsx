import React from 'react';

import { ImagePlaceholder } from '~/assets/icons/lib/imagePlaceholder';

type Company = {
  name: string;
  sym: string;
  image: JSX.Element;
};

enum OrderType {
  marketOrder = 'Market Order',
  limitOrder = 'Limit Order',
  stopOrder = 'Stop Order',
}

export type Order = {
  id: string | number;
  company: Company;
  type: OrderType;
  value: number;
  shares: number;
  sharesValue: number;
  exp: string | Date;
};

export const orders: Order[] = [
  {
    id: 1,
    company: {
      name: 'Apple',
      sym: 'AAPL',
      image: <ImagePlaceholder />,
    },
    type: OrderType.limitOrder,
    value: -210,
    shares: 1,
    sharesValue: 210,
    exp: 'EOD',
  },
];
