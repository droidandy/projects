import React, { ReactNode } from 'react';

import * as s from './Background.styles';

import { ScreenConfig } from '~/components/StepContainer/types';

type BackgroundProps = {
  children: ReactNode;
  screenConfig: ScreenConfig;
};

export const Background = ({ children }: BackgroundProps): JSX.Element => (
  <s.Container>
    {children}
  </s.Container>
);
