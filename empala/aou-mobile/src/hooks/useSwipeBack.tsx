import * as React from 'react';
import GestureRecognizer from 'react-native-swipe-gestures';

export const useSwipeBack = (callback: () => void): (({ children }: any) => JSX.Element) => {
  const config = {
    velocityThreshold: 0.1,
    directionalOffsetThreshold: 30,
  };

  const SwipeBackHandler = React.useCallback(
    ({ children }) => (
      <GestureRecognizer onSwipeRight={callback} config={config}>
        {children}
      </GestureRecognizer>
    ),
    [],
  );

  return SwipeBackHandler;
};
