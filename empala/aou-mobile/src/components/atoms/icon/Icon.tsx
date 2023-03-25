import { get } from 'lodash';
import * as React from 'react';

import { IconProps } from './types';

import lib from '~/assets/icons/lib';

export const Icon = ({
  name,
  size,
  width = 22,
  height = 22,
  color,
  ...rest
}: IconProps): JSX.Element | null => {
  if (!name) {
    return null;
  }

  // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
  const svg = get(lib, name);

  if (!svg) {
    return null;
  }

  const svgWidth = size || width;
  const svgHeight = size || height;

  return React.createElement(svg, {
    ...rest,
    color,
    width: svgWidth,
    height: svgHeight,
  });
};
