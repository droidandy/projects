import React from 'react';
import { ActivityIndicator } from 'react-native';

import * as s from './ButtonStyles';

import Theme from '~/theme';

type Props = {
  title: string;
  loading?: boolean;
  disabled?: boolean;
  blur?: number;
  face?: s.ButtonFace;
  onPress?: () => void;
};

export const Button = ({
  title, loading, disabled, blur, face, onPress,
}: Props): JSX.Element => (
  <Theme>
    <s.Button disabled={loading || disabled} face={face} onPress={onPress}>
      {blur && (
        <s.BlurBackdrop
          blurType="light"
          blurAmount={blur}
          reducedTransparencyFallbackColor="white"
        />
      )}
      {loading && <ActivityIndicator size="large" color="#ffffff" />}
      {!loading && <s.Title face={face}>{title}</s.Title>}
    </s.Button>
  </Theme>
);
