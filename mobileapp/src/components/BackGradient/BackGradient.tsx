import React from 'react';
import { View } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';

import { styles, topColors, bottomColors } from './BackGradient.styles';

const BackGradientBase: React.FC = () => (
  <View key="container" style={styles.container}>
    <LinearGradient key="top-gradient" colors={topColors} style={styles.top} />
    <View key="middle-data" style={styles.middle} />
    <LinearGradient key="bottom-gradient" colors={bottomColors} style={styles.bottom} />
  </View>
);

export const BackGradient = React.memo<{}>(BackGradientBase);
