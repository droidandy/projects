import React, { useState } from 'react';
import { View } from 'react-native';

import { Drugs } from './Drugs';
import { Pharmacies } from './Pharmacies';
import { styles } from './Favourites.styles';
import SegmentedControlTab from 'react-native-segmented-control-tab';

const segmentedControlItems = ['Препараты', 'Аптеки'];

export const Favourites: React.FC = () => {
  const [favouritesType, setFavouriteType] = useState(0);
  let content;
  switch (favouritesType) {
    case 0:
      content = <Drugs key="drugs" />;
      break;
    case 1:
      content = <Pharmacies key="pharmacies" />;
  }

  return (
    <View key="container" style={styles.container}>
      <View style={styles.tabs}>
        <SegmentedControlTab
          values={segmentedControlItems}
          selectedIndex={favouritesType}
          onTabPress={(index): void => setFavouriteType(index)}
          activeTabStyle={styles.activeTab}
          tabStyle={styles.tabsContainer}
          tabTextStyle={styles.tabText}
        />
      </View>
      {content}
    </View>
  );
};
