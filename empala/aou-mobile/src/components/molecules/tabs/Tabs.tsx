import React, { useCallback, useEffect, useState } from 'react';

import { Tab } from './Tab';
import * as s from './styles';

import { Tab as TabType } from '~/components/molecules/tabs/types';

type Props = {
  initialTab?: string | number;
  tabs: TabType[];
  onSelectedChange: (id: string | number) => void;
};

export const Tabs = ({ initialTab, tabs, onSelectedChange }: Props): JSX.Element => {
  const [activeTab, setActiveTab] = useState(() => initialTab ?? tabs[0].id);
  const selectTab = useCallback((id: string | number) => {
    setActiveTab(id);
  }, []);

  useEffect(() => {
    onSelectedChange(activeTab);
  }, [onSelectedChange, activeTab]);

  return (
    <s.Wrapper>
      {tabs.map(({ id, label }) => {
        const active = id === activeTab;

        return (
          <Tab
            key={id}
            id={id}
            label={label}
            active={active}
            onPress={selectTab}
          />
        );
      })}
    </s.Wrapper>
  );
};
