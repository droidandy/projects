import React from 'react';
import { TouchableOpacity } from 'react-native';

import * as s from './TabBarStyles';

import Theme from '~/theme';

type Props = {
  activeTab: number;
  onTabChange: (id: number) => void;
  tabs: { label: string; id: number; }[];
};

export const TabBar = ({
  activeTab,
  onTabChange,
  tabs,
}: Props): JSX.Element => {
  const handlePress = React.useCallback(
    (id) => {
        onTabChange && onTabChange(id);
    },
    [onTabChange],
  );

  const renderTab = React.useCallback(({ label, id }) => {
    const isActive = id === activeTab;
    return (
      <TouchableOpacity onPress={() => handlePress(id)}>
        <s.View isActive={isActive}>
          <s.Text isActive={isActive}>
            {label}
          </s.Text>
        </s.View>
      </TouchableOpacity>
    );
  },
  [activeTab, onTabChange]);

  return (
    <Theme>
      <s.Container
        keyboardShouldPersistTaps="handled"
        horizontal
        showsHorizontalScrollIndicator={false}
        bounces={false}
      >
        {tabs.map(renderTab)}
      </s.Container>
    </Theme>
  );
};
