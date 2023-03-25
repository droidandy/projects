import React from 'react';
import { View, Text, StyleProp, TextStyle } from 'react-native';
import { Pagination } from 'react-native-snap-carousel';

import { styles } from './Carousel.style';

export const getPaginationContentText = (
  activeSlideId: number,
  totalSlidesCount: number,
  paginationStyle?: StyleProp<TextStyle>,
): React.ReactNode => (
  <Text key="container" style={paginationStyle}>
    {activeSlideId + 1} из {totalSlidesCount}
  </Text>
);

export const getPaginationContentDots = (
  activeSlideId: number,
  totalSlidesCount: number,
  paginationStyle?: StyleProp<TextStyle>,
): React.ReactNode => {
  return (
    <View key="container" style={paginationStyle}>
      <Pagination
        dotsLength={totalSlidesCount}
        activeDotIndex={activeSlideId}
        containerStyle={styles.paginationContainer}
        dotStyle={styles.paginationDot}
        inactiveDotStyle={styles.paginationDotInactive}
        inactiveDotOpacity={1}
        inactiveDotScale={0.8}
      />
    </View>
  );
};
