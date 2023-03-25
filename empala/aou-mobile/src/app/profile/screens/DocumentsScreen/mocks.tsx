import React from 'react';

import { Document } from './types';

import { ImagePlaceholder } from '~/assets/icons/lib/imagePlaceholder';

export const today: Document[] = [
  {
    id: 1,
    image: <ImagePlaceholder />,
    name: 'Apple',
    sym: 'AAPL',
    value: -235,
    type: 'BUY',
    date: new Date(2021, 12, 28),
    status: 'Trade Confirmation',
  },
  {
    id: 2,
    image: <ImagePlaceholder />,
    name: 'Tesla',
    sym: 'TSLA',
    value: 235,
    type: 'SELL',
    date: new Date(2021, 12, 28),
    status: 'Trade Confirmation',
  },
  {
    id: 3,
    image: <ImagePlaceholder />,
    name: 'Monthly \nStatement',
    value: 'December',
    date: new Date(2021, 12, 28),
    status: 'Statement',
  },
];

export const lastWeek: Document[] = [
  {
    id: 4,
    image: <ImagePlaceholder />,
    name: 'Tax form',
    sym: 'Retirement',
    date: new Date(2021, 12, 23),
    status: 'Statement',
  },
];
