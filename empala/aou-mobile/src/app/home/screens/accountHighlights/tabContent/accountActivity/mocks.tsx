import React from 'react';

import { Activity, ActivityTypes } from './types';

import { ImagePlaceholder } from '~/assets/icons/lib/imagePlaceholder';

const today = new Date();
const yesterday = new Date();
yesterday.setDate(today.getDate() - 1);

export const todayActivities: Activity[] = [
  {
    id: 1, name: 'Withdrawal', type: ActivityTypes.withDrawal, value: -325, date: today, image: <ImagePlaceholder />,
  },
  {
    id: 2,
    name: 'Bank Account Removed',
    type: ActivityTypes.removed,
    value: 3035,
    date: today,
    image: <ImagePlaceholder />,
  },
  {
    id: 3, name: 'Dividend', type: ActivityTypes.divident, value: 5, date: today, image: <ImagePlaceholder />,
  },
];

export const yesterdayActivities: Activity[] = [
  {
    id: 4,
    name: 'Account Linked',
    type: ActivityTypes.linked,
    value: 'Bank of America',
    date: yesterday,
    image: <ImagePlaceholder />,
  },
  {
    id: 5,
    name: 'Interest',
    type: ActivityTypes.interest,
    value: 45,
    date: yesterday,
    image: <ImagePlaceholder />,
  },
  {
    id: 6,
    name: 'Removed Account',
    type: ActivityTypes.removed,
    value: 'Citadel',
    date: yesterday,
    image: <ImagePlaceholder />,
  },
  {
    id: 7,
    name: 'Account Updated',
    type: ActivityTypes.updated,
    value: 'Approved',
    date: yesterday,
    image: <ImagePlaceholder />,
  },
];
