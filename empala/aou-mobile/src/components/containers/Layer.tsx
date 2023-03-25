import React, { ReactNode } from 'react';

import * as s from './layerStyles';

type LayerProps = {
  children: ReactNode;
};

export const Layer = ({ children }: LayerProps): JSX.Element => (
  <s.Container>
    <s.GradientLayer />
    {children}
  </s.Container>
);
