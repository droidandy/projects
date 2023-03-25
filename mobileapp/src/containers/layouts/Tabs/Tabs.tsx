import React, { useState } from 'react';
import { View } from 'react-native';
import { TabButton } from './TabButton';
import { styles } from './Tabs.styles';
import { Separator } from './Separator';

interface TTab {
  key: string;
  label: React.ReactNode;
  content: React.ReactNode;
}

interface Props {
  defaultTab?: string;
  tabs: TTab[];
}

const TabsBase: React.FC<Props> = ({ defaultTab, tabs }: Props) => {
  const [activeTab, setActiveTab] = useState<string>(defaultTab || tabs[0].key);
  const tabButtons: React.ReactNode[] = [];
  let tabContent: React.ReactNode = null;

  tabs.forEach(tab => {
    tabButtons.push(
      <TabButton
        key={tab.key}
        name={tab.key}
        onPress={setActiveTab}
        selected={tab.key === activeTab}
      >
        {tab.label}
      </TabButton>,
      <Separator key={tab.key + '-separator'} />,
    );
    if (tab.key === activeTab) {
      tabContent = (
        <View key={tab.key} style={styles.content}>
          {tab.content}
        </View>
      );
    }
  });

  tabButtons[tabButtons.length - 1] = null;

  return (
    <View key="container" style={styles.container}>
      <View key="tabs" style={styles.tabs}>
        {tabButtons}
      </View>
      <View key="content" style={styles.content}>
        {tabContent}
      </View>
    </View>
  );
};

export const Tabs = React.memo<Props>(TabsBase);
