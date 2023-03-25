import LottieView from 'lottie-react-native';
import React, { useMemo } from 'react';
import { Animated } from 'react-native';

import * as Styled from './loaderStyles';

export type Props = {
  opacity?: Animated.Value;
  color?: string;
};

const LAYERS = [
  'Shape Layer 1',
  'Shape Layer 2',
  'Shape Layer 3',
  'Shape Layer 4',
];

export const OnboardingLoader = ({ opacity, color }: Props): JSX.Element => {
  const colorFilters = useMemo(
    () => color && LAYERS.map((l) => ({
      keypath: l,
      color,
    })), [color],
  );

  return (
    <Styled.Container style={{ opacity }}>
      <LottieView
        source={require('~/assets/animations/preload-lottie.json')}
        colorFilters={colorFilters || undefined}
        autoPlay
      />
    </Styled.Container>
  );
};
