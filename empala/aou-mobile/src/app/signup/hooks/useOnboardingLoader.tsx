import { useContext, useCallback, useState } from 'react';
import { Animated } from 'react-native';

import { SignUpContext } from '../loaderContext';

type ReturnT = (loading: boolean) => void;

export const useOnboardingLoader = (): ReturnT => {
  const signUpContext = useContext(SignUpContext);
  const { loaderOpacity } = signUpContext;
  const [isShowing, setIsShowing] = useState(true);

  const fadeIn = () => {
    Animated.timing(loaderOpacity, {
      toValue: 1,
      duration: 2000,
      useNativeDriver: true,
    }).start();
  };

  const fadeOut = () => {
    Animated.timing(loaderOpacity, {
      toValue: 0,
      duration: 500,
      useNativeDriver: true,
    }).start();
  };

  const setOnboardingLoader = useCallback((loading: boolean) => {
    if (loading === isShowing) return;

    setIsShowing(loading);
    loading ? fadeIn() : fadeOut();
  }, [isShowing, loaderOpacity]);

  return setOnboardingLoader;
};
