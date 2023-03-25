import React from 'react';

import { AccountActivity } from './accountActivity';
import { OrderHistory } from './orderHistory';
import { Overview } from './overview';
import * as s from './styles';

import { Tab } from '~/app/home/screens/accountHighlights/types';

type Props = {
  tabId?: string | number;
};

const TabContentComponent = ({ tabId }: Props): JSX.Element => (
  <s.Wrapper>
    {tabId === Tab.overview && (
      <Overview />
    )}
    {tabId === Tab.accountActivity && (
      <AccountActivity />
    )}
    {tabId === Tab.orderHistory && (
      <OrderHistory />
    )}
  </s.Wrapper>
);

export const TabContent = React.memo(TabContentComponent);
