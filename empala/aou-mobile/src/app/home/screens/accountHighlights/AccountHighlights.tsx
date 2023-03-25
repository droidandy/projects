import { RouteProp } from '@react-navigation/native';
import React, { useCallback, useState } from 'react';

import * as s from './styles';
import { TabContent } from './tabContent';
import { Tab } from './types';

import { Routes } from '~/app/home/navigation/routes';
import { RootStackParamList } from '~/app/home/navigation/types';
import { Tabs } from '~/components/molecules/tabs';
import { Tab as TabType } from '~/components/molecules/tabs/types';
import Theme from '~/theme';

const TABS: TabType[] = [
  { id: Tab.overview, label: 'Overview' },
  { id: Tab.accountActivity, label: 'Account Activity' },
  { id: Tab.orderHistory, label: 'Order History' },
];

type Props = {
  route: RouteProp<RootStackParamList, Routes.AccountHighlights>;
};

export const AccountHighlights = ({ route }: Props): JSX.Element => {
  const [activeTab, setActiveTab] = useState<Tab | undefined>(route.params?.initialTab);
  const selectTab = useCallback((tabId) => {
    if (Tab[tabId as Tab]) {
      setActiveTab(tabId);
    }
  }, []);

  return (
    <Theme>
      <s.TabsWrapper>
        <Tabs initialTab={activeTab} tabs={TABS} onSelectedChange={selectTab} />
      </s.TabsWrapper>
      <s.Content>
        <TabContent tabId={activeTab} />
      </s.Content>
    </Theme>
  );
};
