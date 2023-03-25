import { RouteProp } from '@react-navigation/native';
import React from 'react';

import { AccountLinked } from './AccountLinked';
import { AccountRemoved } from './AccountRemoved';
import { AccountUpdated } from './AccountUpdated';
import { Divident } from './Divident';
import { Interest } from './Interest';
import { Withdrawal } from './Withdrawal';

import { Routes } from '~/app/home/navigation/routes';
import { TradeParamList } from '~/app/home/navigation/types';
import { ActivityTypes } from '~/app/home/screens/accountHighlights/tabContent/accountActivity/types';

type Props = {
  route: RouteProp<TradeParamList, Routes.ActivityDetails>;
};

export const ActivityDetails = ({ route }: Props): JSX.Element => {
  const activity = route.params?.activity;

  switch (activity.type) {
    case ActivityTypes.divident:
      return <Divident activity={activity} />;
    case ActivityTypes.withDrawal:
      return <Withdrawal activity={activity} />;
    case ActivityTypes.linked:
      return <AccountLinked activity={activity} />;
    case ActivityTypes.removed:
      return <AccountRemoved activity={activity} />;
    case ActivityTypes.updated:
      return <AccountUpdated activity={activity} />;
    case ActivityTypes.interest:
      return <Interest activity={activity} />;
    default:
      return <Withdrawal activity={activity} />;
  }
};
