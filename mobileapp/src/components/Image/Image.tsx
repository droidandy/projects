import * as React from 'react';
import { Image as NativeImage, ImageProps } from 'react-native';

const defaultProps: Partial<ImageProps> = { resizeMode: 'contain', resizeMethod: 'scale' };

export const Image = (props: ImageProps) => {
  const val = { ...defaultProps, ...props };
  return <NativeImage {...val} />;
};
