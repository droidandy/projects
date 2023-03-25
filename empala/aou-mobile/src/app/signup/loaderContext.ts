import { createContext } from 'react';
import { Animated } from 'react-native';

export const SignUpContext = createContext({} as { loaderOpacity: Animated.Value });