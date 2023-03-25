import React from 'react';
import { View } from 'react-native';

import { styles } from './Tabs.styles';

const SeparatorBase: React.FC = () => {
  return <View key="separator" style={styles.separator} />;
};

export const Separator = React.memo<{}>(SeparatorBase);
