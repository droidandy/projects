import { useState, useEffect } from 'react';
import { Dimensions, ScaledSize } from 'react-native';

import { CHANGE_EVENT } from '~/constants/events';

const window = Dimensions.get('window');
const screen = Dimensions.get('screen');

type ReturnType = {
  window: ScaledSize;
  screen: ScaledSize;
};

export const useDimensions = (): ReturnType => {
  const [dimensions, setDimensions] = useState<ReturnType>({ window, screen });

  useEffect(() => {
    const dimensionChangeHandler = ({ window: w, screen: s }: ReturnType): void => {
      setDimensions({ window: w, screen: s });
    };

    Dimensions.addEventListener(
      CHANGE_EVENT,
      dimensionChangeHandler,
    );

    return () => {
      Dimensions.removeEventListener(
        CHANGE_EVENT,
        dimensionChangeHandler,
      );
    };
  }, []);

  return dimensions;
};
