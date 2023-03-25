import { LinearGradient } from 'expo-linear-gradient';
import { theme } from '../helpers/theme';
import React from 'react';

export const InnerShadow = () => (
  <>
    <LinearGradient
      style={{
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        height: theme.sizing(1),
        zIndex: 100,
      }}
      colors={['#0000', '#0002']}
    />
    <LinearGradient
      style={{
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        height: theme.sizing(1),
        zIndex: 100,
      }}
      colors={['#0002', '#0000']}
    />
  </>
);
